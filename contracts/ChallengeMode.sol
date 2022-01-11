pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/IERC721ReceiverUpgradeable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "abdk-libraries-solidity/ABDKMath64x64.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/token/ERC721/IERC721.sol";
import "@openzeppelin/contracts/token/ERC20/SafeERC20.sol";
import "abdk-libraries-solidity/ABDKMath64x64.sol";
import "./interfaces/IStakeFromGame.sol";
import "./interfaces/IRandoms.sol";

import "./characters.sol";
import "./weapons.sol";
import "./CareerMode.sol";

contract ChallengeMode is
    IERC721ReceiverUpgradeable,
    Initializable,
    AccessControlUpgradeable
{
    using ABDKMath64x64 for int128;
    using SafeMath for uint256;
    using SafeMath for uint64;

    bytes4 private constant _INTERFACE_ID_ERC721 = 0x80ac58cd;
    bytes32 public constant GAME_ADMIN = keccak256("GAME_ADMIN");
    bytes32 public constant REWARD_OPERATOR = keccak256("REWARD_OPERATOR");

    Characters public characters;
    Weapons public weapons;
    IERC20 public xBlade;
    IRandoms public randoms;
    CareerMode public careerMode;

    /**
        uint256 data structure
        result (0 - not done, 1 - done, 2 - cancel) |
        handicapPercent (0 - 50) |
        isOwnerHandicap (0 or 1) |
        win (0 or 1)
     */
    struct Room {
        uint256 id;
        address owner;
        uint256 matchReward;
        uint256 weaponId;
        uint256 characterId;
        uint256 data;
    }

    Room[] rooms;

    uint8 durabilityCostFight;
    uint8 staminaCostFight;
    uint256 public minimumRoundDuration;
    uint256 public feeRate;

    mapping(uint256 => uint256) roomTimerStart;
    mapping(address => uint256[]) roomsByAddress;
    mapping(address => uint256[]) participatedRoomsByAddress;

    /** EVENTS */

    event CreateCareerRoom(
        address owner,
        uint256 matchReward,
        uint256 weaponId,
        uint256 characterId,
        uint256 handicapPercent
    );

    event FightOutCome(
        address opponent,
        address roomOwner,
        uint256 opponentRoll,
        uint256 ownerRoll,
        uint256 opponentIncome
    );

    event EndCareerRoom(uint256 id, address owner, uint256 withdrawAmount);

    function initialize(
        IERC20 _xBlade,
        Characters _characters,
        Weapons _weapons,
        IRandoms _randoms,
        CareerMode _careerMode
    ) public initializer {
        __AccessControl_init();

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(GAME_ADMIN, msg.sender);

        xBlade = _xBlade;
        characters = _characters;
        weapons = _weapons;
        randoms = _randoms;
        careerMode = _careerMode;

        staminaCostFight = 0;
        durabilityCostFight = 0;
        minimumRoundDuration = 1 hours;
        feeRate = 5; //5%
    }

    /** MODIFIERS */

    modifier restricted() {
        _restricted();
        _;
    }

    function _restricted() internal view {
        require(hasRole(GAME_ADMIN, msg.sender), "NGA");
    }

    modifier isWeaponOwner(uint256 weapon) {
        _isWeaponOwner(weapon);
        _;
    }

    function _isWeaponOwner(uint256 weapon) internal view {
        require(weapons.ownerOf(weapon) == msg.sender, "Not WPO");
    }

    modifier isWeaponsOwner(uint256[] memory weaponArray) {
        _isWeaponsOwner(weaponArray);
        _;
    }

    function _isWeaponsOwner(uint256[] memory weaponArray) internal view {
        for (uint256 i = 0; i < weaponArray.length; i++) {
            require(weapons.ownerOf(weaponArray[i]) == msg.sender, "Not WPO");
        }
    }

    modifier isCharacterOwner(uint256 character) {
        _isCharacterOwner(character);
        _;
    }

    function _isCharacterOwner(uint256 character) internal view {
        require(characters.ownerOf(character) == msg.sender, "Not CHO");
    }

    /** MUTATIVES */

    function onERC721Received(
        address, /* operator */
        address, /* from */
        uint256,
        bytes calldata /* data */
    ) external override returns (bytes4) {
        return IERC721ReceiverUpgradeable.onERC721Received.selector;
    }

    function createRoom(
        uint256 _char,
        uint256 _wep,
        uint256 _matchReward,
        uint256 _handicapPercent,
        uint8 _isOwnerHandicap
    ) public isWeaponOwner(_wep) isCharacterOwner(_char) {
        require(_matchReward > 0, "Match reward must be greater than 0");
        require(_handicapPercent < 51, "Handicap percent max is 50%");
        require(xBlade.balanceOf(msg.sender) > _matchReward);

        xBlade.transferFrom(msg.sender, address(this), _matchReward);
        // To prevent room owner sell NFT
        IERC721(address(characters)).safeTransferFrom(
            msg.sender,
            address(this),
            _char
        );
        IERC721(address(weapons)).safeTransferFrom(
            msg.sender,
            address(this),
            _wep
        );
        uint256 roomId = rooms.length;
        roomTimerStart[roomId] = block.timestamp;
        roomsByAddress[msg.sender].push(roomId);
        uint256 _fightData = encodingFightData(
            0,
            _handicapPercent,
            _isOwnerHandicap,
            0
        );
        rooms.push(
            Room(roomId, msg.sender, _matchReward, _wep, _char, _fightData)
        );
        emit CreateCareerRoom(
            msg.sender,
            _matchReward,
            _wep,
            _char,
            _handicapPercent
        );
    }

    function fight(
        uint256 _roomId,
        uint256 _wep,
        uint256 _char
    ) public {
        Room storage _room = rooms[_roomId];
        (uint256 result, , , ) = decodingFightData(_room.data);
        require(
            xBlade.balanceOf(msg.sender) >= _room.matchReward,
            "Not enough xBlade to fight"
        );
        require(weapons.ownerOf(_wep) == msg.sender, "Not own weapon");
        require(characters.ownerOf(_char) == msg.sender, "Now own character");
        require(result == 0, "Room is end");
        participatedRoomsByAddress[msg.sender].push(_roomId);
        performFight(
            _roomId,
            getPlayerPower(_room.characterId, _room.weaponId),
            getPlayerPower(_char, _wep)
        );
    }

    function performFight(
        uint256 _roomId,
        uint24 _ownerPower,
        uint24 _opponentPower
    ) internal {
        Room storage _room = rooms[_roomId];
        (
            ,
            uint256 handicapPercent,
            uint256 isOwnerHandicap,

        ) = decodingFightData(_room.data);

        uint256 seed = randoms.getRandomSeed(msg.sender);
        uint24 playerRoll = getPlayerPowerRoll(
            _ownerPower,
            seed,
            handicapPercent,
            isOwnerHandicap == 1
        ); // owner roll
        uint24 opponentRoll = getPlayerPowerRoll(
            _opponentPower,
            seed,
            0,
            false
        ); // requester roll

        uint256 tokensWin = _room.matchReward.sub(
            _room.matchReward.mul(feeRate).div(100)
        );
        bool _opponentWin = opponentRoll >= playerRoll;
        if (_opponentWin) {
            careerMode.updateTokenRewards(msg.sender, tokensWin);
        } else {
            careerMode.updateTokenRewards(_room.owner, tokensWin);
            tokensWin = 0;
        }
        _room.data = encodingFightData(
            1,
            handicapPercent,
            isOwnerHandicap,
            _opponentWin ? 0 : 1
        );

        emit FightOutCome(
            msg.sender,
            _room.owner,
            opponentRoll,
            playerRoll,
            tokensWin
        );
    }

    function endCareer(uint256 id) public {
        require(
            block.timestamp >= roomTimerStart[id].add(minimumRoundDuration),
            "Cannot end career"
        );
        Room storage _room = rooms[id];
        (
            uint256 fightResult,
            uint256 handicapPercent,
            uint256 isOwnerHandicap,
            uint256 win
        ) = decodingFightData(_room.data);

        require(msg.sender == _room.owner, "Must be owner");
        require(fightResult == 0, "Room is end");
        _room.data = encodingFightData(
            2,
            handicapPercent,
            isOwnerHandicap,
            win
        );
        xBlade.transfer(_room.owner, _room.matchReward);
        IERC721(address(characters)).safeTransferFrom(
            address(this),
            _room.owner,
            _room.characterId
        );
        IERC721(address(weapons)).safeTransferFrom(
            address(this),
            _room.owner,
            _room.weaponId
        );
        emit EndCareerRoom(id, _room.owner, _room.matchReward);
    }

    function setFeeRate(uint256 _rate) public restricted {
        feeRate = _rate;
    }

    function setMinimumRoundDuration(uint256 _minimumRoundDuration)
        public
        restricted
    {
        minimumRoundDuration = _minimumRoundDuration;
    }

    function setStaminaCostFight(uint8 _staminaCost) public restricted {
        staminaCostFight = _staminaCost;
    }

    function setDurabilityCostFight(uint8 _cost) public restricted {
        durabilityCostFight = _cost;
    }

    /** GETTERS */

    function encodingFightData(
        uint256 fightResult,
        uint256 handicapPercent,
        uint256 isOwnerHandicap,
        uint256 win
    ) internal pure returns (uint256) {
        uint256 result = fightResult;
        result |= handicapPercent << 8;
        result |= isOwnerHandicap << 16;
        result |= win << 18;
        return result;
    }

    function decodingFightData(uint256 result)
        internal
        pure
        returns (
            uint256 fightResult,
            uint256 handicapPercent,
            uint256 isOwnerHandicap,
            uint256 win
        )
    {
        fightResult = uint256(uint8(result));
        handicapPercent = uint256(uint8(result >> 8));
        isOwnerHandicap = uint256(uint8(result >> 16));
        win = uint256(uint8(result >> 18));
    }

    function unpackFightData(uint96 playerData)
        public
        pure
        returns (
            uint8 charTrait,
            uint24 basePowerLevel,
            uint64 timestamp
        )
    {
        charTrait = uint8(playerData & 0xFF);
        basePowerLevel = uint24((playerData >> 8) & 0xFFFFFF);
        timestamp = uint64((playerData >> 32) & 0xFFFFFFFFFFFFFFFF);
    }

    function getPlayerPower(uint256 char, uint256 wep) public returns (uint24) {
        (uint8 charTrait, uint24 basePower, ) = unpackFightData(
            characters.getFightDataAndDrainStamina(char, staminaCostFight)
        );

        (, int128 weaponMultiplier, uint24 weaponBonusPower, ) = weapons
            .getFightDataAndDrainDurability(
                wep,
                charTrait,
                durabilityCostFight
            );
        return uint24(weaponMultiplier.mulu(basePower).add(weaponBonusPower));
    }

    function getPlayerPowerRoll(
        uint24 playerFightPower,
        uint256 seed,
        uint256 _handicapPercent,
        bool _isHandicap
    ) internal pure returns (uint24) {
        uint256 handicapPower = uint256(playerFightPower).add(
            uint256(playerFightPower).mul(_handicapPercent).div(100)
        );

        if (_isHandicap) {
            handicapPower = uint256(playerFightPower).sub(
                uint256(playerFightPower).mul(_handicapPercent).div(100)
            );
        }
        return uint24(plusMinus10PercentSeeded(handicapPower, seed));
    }

    function getRoom(uint256 _id)
        public
        view
        returns (
            address owner,
            uint256 matchReward,
            uint256 weaponId,
            uint256 characterId,
            uint256 fightResult,
            uint256 handicapPercent,
            uint256 isOwnerHandicap,
            uint256 win
        )
    {
        Room memory _room = rooms[_id];
        owner = _room.owner;
        matchReward = _room.matchReward;
        weaponId = _room.weaponId;
        characterId = _room.characterId;
        (
            fightResult,
            handicapPercent,
            isOwnerHandicap,
            win
        ) = decodingFightData(_room.data);
    }

    function randomSeededMinMax(
        uint256 min,
        uint256 max,
        uint256 seed
    ) internal pure returns (uint256) {
        // inclusive,inclusive (don't use absolute min and max values of uint256)
        // deterministic based on seed provided
        uint256 diff = max.sub(min).add(1);
        uint256 randomVar = uint256(keccak256(abi.encodePacked(seed))).mod(
            diff
        );
        randomVar = randomVar.add(min);
        return randomVar;
    }

    function plusMinus10PercentSeeded(uint256 num, uint256 seed)
        internal
        pure
        returns (uint256)
    {
        uint256 tenPercent = num.div(10);
        return
            num.sub(tenPercent).add(
                randomSeededMinMax(0, tenPercent.mul(2), seed)
            );
    }

    function totalRooms() public view returns (uint256) {
        return rooms.length;
    }

    function getStartTime(uint256 id) public view returns (uint256) {
        return roomTimerStart[id];
    }

    function getRooms(uint256 cursor) public view returns (Room[] memory) {
        uint256 length = 20;
        if (length > totalRooms() - cursor) {
            length = totalRooms() - cursor;
        }

        Room[] memory values = new Room[](length);
        for (uint256 i = 0; i < length; i++) {
            values[i] = rooms[i + cursor];
        }
        return values;
    }

    function getPartipatedRequests(address account)
        public
        view
        returns (uint256[] memory)
    {
        return participatedRoomsByAddress[account];
    }

    function getRoomsByAddress(address account)
        public
        view
        returns (uint256[] memory)
    {
        return roomsByAddress[account];
    }
}
