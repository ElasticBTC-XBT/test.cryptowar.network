pragma solidity ^0.6.0;

import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts-upgradeable/utils/PausableUpgradeable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "./pancakeUtils.sol";
import "./characters.sol";
import "./weapons.sol";
import "./CryptoWars.sol";

contract SecretBox is Initializable, OwnableUpgradeable, PausableUpgradeable {
    mapping(address => uint256) lastBlockNumberCalled;

    CryptoWars public game;
    Characters public characters;
    Weapons public weapons;

    IERC20 public xBlade;

    uint256 public commonBoxPrice;
    uint256 public rareBoxPrice;
    uint256 public commonBoxAmount;
    uint256 public rareBoxAmount;

    function initialize(
        IERC20 _xBlade,
        Characters _characters,
        Weapons _weapons
    ) public initializer {
        OwnableUpgradeable.__Ownable_init();
        __Pausable_init();

        xBlade = _xBlade;
        characters = _characters;
        weapons = _weapons;
        commonBoxAmount = 1000;
        rareBoxAmount = 100;
        commonBoxPrice = 1000; // xBlade
        rareBoxPrice = 4000; // xBlade
    }

    modifier onlyNonContract() {
        _onlyNonContract();
        _;
    }

    modifier oncePerBlock(address user) {
        _oncePerBlock(user);
        _;
    }

    function _onlyNonContract() internal view {
        require(!_isContract(msg.sender), "contract not allowed");
        require(msg.sender == tx.origin, "proxy contract not allowed");
    }

    function _isContract(address addr) internal view returns (bool) {
        uint256 size;
        assembly {
            size := extcodesize(addr)
        }
        return size > 0;
    }

    function _oncePerBlock(address user) internal {
        require(lastBlockNumberCalled[user] < block.number, "OCB");
        lastBlockNumberCalled[user] = block.number;
    }

    function setCommonBoxPrice(uint256 _price) public onlyOwner {
        commonBoxPrice = _price;
    }

    function setRareBoxPrice(uint256 _price) public onlyOwner {
        rareBoxPrice = _price;
    }

    function setCommonBoxAmount(uint256 _amount) public onlyOwner {
        commonBoxAmount = _amount;
    }

    function setRareBoxAmount(uint256 _amount) public onlyOwner {
        rareBoxAmount = _amount;
    }

    function setXBlade(address _address) public onlyOwner {
        xBlade = IERC20(_address);
    }

    function setWeapons(Weapons _weapons) public onlyOwner {
        weapons = _weapons;
    }

    function setCharacter(Characters _characters) public onlyOwner {
        characters = _characters;
    }

    function setGame(CryptoWars _game) public onlyOwner {
        game = _game;
    }

    function openCommonBox()
        public
        onlyNonContract
        oncePerBlock(msg.sender)
        whenNotPaused
    {
        require(characters.balanceOf(msg.sender) > 0, "Get first hero");
        require(commonBoxAmount > 0, "Sold out");
        require(
            xBlade.balanceOf(msg.sender) >= commonBoxPrice,
            "Not enough xBlade"
        );

        commonBoxAmount = commonBoxAmount - 1;
        xBlade.transferFrom(msg.sender, address(this), commonBoxPrice);

        weapons.mint(
            msg.sender,
            uint256(
                keccak256(
                    abi.encodePacked(blockhash(block.number - 1), msg.sender)
                )
            )
        );
    }

    function openRareBox()
        public
        onlyNonContract
        oncePerBlock(msg.sender)
        whenNotPaused
    {
        require(characters.balanceOf(msg.sender) > 0, "Get first hero");
        require(rareBoxAmount > 0, "Sold out");
        require(
            xBlade.balanceOf(msg.sender) >= rareBoxPrice,
            "Not enough xBlade"
        );

        rareBoxAmount = rareBoxAmount - 1;
        xBlade.transferFrom(msg.sender, address(this), rareBoxPrice);

        weapons.mintWithRareBox(
            msg.sender,
            uint256(
                keccak256(
                    abi.encodePacked(blockhash(block.number - 1), msg.sender)
                )
            )
        );
    }
}
