pragma solidity ^0.6.0;
pragma experimental ABIEncoderV2;

import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "abdk-libraries-solidity/ABDKMath64x64.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";

import "./CWController.sol";
import "./characters.sol";
import "./weapons.sol";

contract BlindBox is
    Initializable,
    ERC721Upgradeable,
    AccessControlUpgradeable
{
    bytes32 public constant GAME_ADMIN = keccak256("GAME_ADMIN");
    bytes32 public constant BOX_OPENER = keccak256("BOX_SELLER");

    enum Type {
        COMMON,
        RARE,
        EPIC
    }

    struct Box {
        Type boxType;
    }
    Box[] tokens;

    IERC20 public xBlade;
    CWController private cwController;
    Characters public characters;
    Weapons public weapons;

    uint256 public commonQty;
    uint256 public rareQty;
    uint256 public epicQty;

    uint256 public commonPrice;
    uint256 public rarePrice;
    uint256 public epicPrice;
    mapping(address => uint256) fragmentQty;
    uint256 public fragmentPerBox;

    uint256 private lastMintedBlock;
    uint256 private firstMintedOfLastBlock;

    uint256 public commonPriceByXGem;
    uint256 public mintHeroPriceByXGem;
    uint256 public rarePriceByXGem;
    uint256 public epicPriceByXGem;

    uint256 public spinWheelPrice;
    mapping(address => uint256) public unclaimedStamina;

    event NewBlindBox(uint256 indexed boxId, address indexed minter);
    event Burned(address indexed owner, uint256 indexed burned);
    event Open(address indexed minter, uint256 stars);
    event Spin(address indexed spinner, uint256 result);

    function initialize(
        address _weapon,
        address _character,
        address _xBlade,
        address _cwController
    ) public initializer {
        __ERC721_init("CryptoWars BlindBox", "CBB");
        __AccessControl_init_unchained();

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(GAME_ADMIN, msg.sender);
        commonQty = 100;
        rareQty = 100;
        epicQty = 100;

        commonPrice = 50 ether;
        rarePrice = 150 ether;
        epicPrice = 140 ether;
        fragmentPerBox = 1000;

        require(_weapon != address(0));
        weapons = Weapons(_weapon);

        require(_character != address(0));
        characters = Characters(_character);

        require(_xBlade != address(0));
        xBlade = IERC20(_xBlade);

        require(_cwController != address(0));
        cwController = CWController(_cwController);
    }

    /** MODIFIERS */

    modifier onlyGameAdmin() {
        _onlyGameAdmin();
        _;
    }

    function _onlyGameAdmin() internal view {
        require(hasRole(GAME_ADMIN, msg.sender), "Not game admin");
    }

    modifier onlyNonContract() {
        _onlyNonContract();
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

    modifier noFreshLookup(uint256 id) {
        _noFreshLookup(id);
        _;
    }

    function _noFreshLookup(uint256 id) internal view {
        require(
            id < firstMintedOfLastBlock || lastMintedBlock < block.number,
            "Too fresh for lookup"
        );
    }

    function setBoxesPrice(uint8 _type, uint256 _price) public onlyGameAdmin {
        require(_price > 0, "Boxes price must be larger than 0");
        if (_type == 0) {
            commonPrice = _price;
        }
        if (_type == 1) {
            rarePrice = _price;
        }

        if (_type == 2) {
            epicPrice = _price;
        }

        if (_type == 3) {
            commonPriceByXGem = _price;
        }

        if (_type == 4) {
            mintHeroPriceByXGem = _price;
        }

        if (_type == 5) {
            rarePriceByXGem = _price;
        }

        if (_type == 6) {
            epicPriceByXGem = _price;
        }
    }

    function setBoxesQty(
        uint256 _commonQty,
        uint256 _rareQty,
        uint256 _epicQty
    ) public onlyGameAdmin {
        commonQty = _commonQty;
        rareQty = _rareQty;
        epicQty = _epicQty;
    }

    function setXBlade(address _address) public onlyGameAdmin {
        xBlade = IERC20(_address);
    }

    function setWeapons(Weapons _weapons) public onlyGameAdmin {
        weapons = _weapons;
    }

    function setCharacter(Characters _characters) public onlyGameAdmin {
        characters = _characters;
    }

    function setFragmentPerBox(uint256 _amount) public onlyGameAdmin {
        fragmentPerBox = _amount;
    }

    function buy(Type _type) public {
        uint256 tokenId = tokens.length;

        if (block.number != lastMintedBlock) {
            firstMintedOfLastBlock = tokenId;
        }
        lastMintedBlock = block.number;

        uint256 sellPrice;
        if (_type == Type.COMMON) {
            sellPrice = commonPrice;
        } else if (_type == Type.RARE) {
            sellPrice = rarePrice;
        } else if (_type == Type.EPIC) {
            sellPrice = epicPrice;
        }
        require(
            xBlade.balanceOf(msg.sender) > cwController.usdToxBlade(sellPrice),
            "No money no box"
        );
        if (_type == Type.COMMON) {
            require(
                xBlade.balanceOf(msg.sender) >
                    cwController.usdToxBlade(commonPrice),
                "No money no box"
            );
            require(commonQty > 0, "Common box sold out");
            xBlade.transferFrom(
                msg.sender,
                address(this),
                cwController.usdToxBlade(commonPrice)
            );
            commonQty = commonQty.sub(1);
            tokens.push(Box(Type.COMMON));
        } else if (_type == Type.RARE) {
            require(
                xBlade.balanceOf(msg.sender) >
                    cwController.usdToxBlade(rarePrice),
                "No money no box"
            );
            require(rareQty > 0, "Common box sold out");
            xBlade.transferFrom(
                msg.sender,
                address(this),
                cwController.usdToxBlade(rarePrice)
            );
            rareQty = rareQty.sub(1);
            tokens.push(Box(Type.RARE));
        } else if (_type == Type.EPIC) {
            require(
                xBlade.balanceOf(msg.sender) >
                    cwController.usdToxBlade(epicPrice),
                "No money no box"
            );
            require(epicQty > 0, "Common box sold out");
            xBlade.transferFrom(
                msg.sender,
                address(this),
                cwController.usdToxBlade(epicPrice)
            );
            epicQty = epicQty.sub(1);
            tokens.push(Box(Type.EPIC));
        }

        _mint(msg.sender, tokenId);
        emit NewBlindBox(tokenId, msg.sender);
    }

    function open(uint256 id) public noFreshLookup(id) {
        address burnOwner = ownerOf(id);
        require(burnOwner == msg.sender, "Not box owner");
        Box memory _box = tokens[id];

        uint256 seed = uint256(
            keccak256(abi.encodePacked(blockhash(block.number - 1), msg.sender))
        );
        uint256 stars = 0;
        if (_box.boxType == Type.COMMON) {
            stars = getCommonStars(seed);
        }
        if (_box.boxType == Type.RARE) {
            stars = getRareStars(seed);
        }
        if (_box.boxType == Type.EPIC) {
            stars = getEpicStars(seed);
        }
        if (stars <= 4) {
            weapons.mintWeaponWithStars(msg.sender, stars, seed);
        }
        if (stars == 10) {
            // Mint hero
            characters.mint(msg.sender, seed);
        }
        emit Open(msg.sender, stars);

        _burn(id);
        emit Burned(burnOwner, id);
    }

    function buyCommonBoxWithXGem() public {
        require(
            fragmentQty[msg.sender] >= commonPriceByXGem,
            "Not enough fragment to buy common box"
        );

        fragmentQty[msg.sender] = fragmentQty[msg.sender].sub(
            commonPriceByXGem
        );
        uint256 tokenId = tokens.length;
        tokens.push(Box(Type.COMMON));
        _mint(msg.sender, tokenId);
        emit NewBlindBox(tokenId, msg.sender);
    }

    function buyRareBoxWithXGem() public {
        require(
            fragmentQty[msg.sender] >= rarePriceByXGem,
            "Not enough fragment to buy common box"
        );

        fragmentQty[msg.sender] = fragmentQty[msg.sender].sub(rarePriceByXGem);
        uint256 tokenId = tokens.length;
        tokens.push(Box(Type.RARE));
        _mint(msg.sender, tokenId);
        emit NewBlindBox(tokenId, msg.sender);
    }

    function buyEpicBoxWithXGem() public {
        require(
            fragmentQty[msg.sender] >= epicPriceByXGem,
            "Not enough fragment to buy common box"
        );

        fragmentQty[msg.sender] = fragmentQty[msg.sender].sub(epicPriceByXGem);
        uint256 tokenId = tokens.length;
        tokens.push(Box(Type.EPIC));
        _mint(msg.sender, tokenId);
        emit NewBlindBox(tokenId, msg.sender);
    }

    // function mintHeroWithXGem() public {
    //     require(
    //         fragmentQty[msg.sender] >= mintHeroPriceByXGem,
    //         "Not enough fragment to buy common box"
    //     );
    //     fragmentQty[msg.sender] = fragmentQty[msg.sender].sub(
    //         mintHeroPriceByXGem
    //     );
    //     uint256 seed = uint256(
    //         keccak256(abi.encodePacked(blockhash(block.number - 1), msg.sender))
    //     );
    //     characters.mint(msg.sender, seed);
    // }

    function addFragment(address account, uint256 qty) public onlyGameAdmin {
        require(qty < 30, "Max 30 fragment");
        fragmentQty[account] = fragmentQty[account].add(qty);
    }

    function convertFragmentToNBox(uint256 boxAmount) public {
        require(
            boxAmount.mul(fragmentPerBox) >= fragmentQty[msg.sender],
            "Not enough fragment"
        );
        while (boxAmount > 0) {
            boxAmount = boxAmount.sub(1);
            convertFragmentToBox();
        }
    }

    function convertFragmentToBox() public {
        require(
            fragmentQty[msg.sender] >= fragmentPerBox,
            "Not egough fragment"
        );
        fragmentQty[msg.sender] = fragmentQty[msg.sender].sub(fragmentPerBox);
        uint256 seed = uint256(
            keccak256(abi.encodePacked(blockhash(block.number - 1), msg.sender))
        );
        uint256 tokenId = tokens.length;
        tokens.push(Box(getBoxTypeForFragment(seed)));
        _mint(msg.sender, tokenId);
        emit NewBlindBox(tokenId, msg.sender);
    }

    function getBoxTypeForFragment(uint256 seed) internal pure returns (Type) {
        Type _type;
        uint256 roll = seed % 1000;
        if (roll < 50) {
            _type = Type.EPIC;
        } else if (roll < 110) {
            _type = Type.RARE;
        } else {
            _type = Type.COMMON;
        }
        return _type;
    }

    function getCommonStars(uint256 seed) internal pure returns (uint256) {
        uint256 stars;
        uint256 roll = seed % 1000;
        // will need revision, possibly manual configuration if we support more than 5 stars
        if (roll < 5) {
            stars = 4;
        } else if (roll < 15) {
            stars = 3;
        } else if (roll < 35) {
            stars = 2;
        } else if (roll < 120) {
            stars = 1;
        } else {
            stars = 0;
        }
        return stars;
    }

    function getRareStars(uint256 seed) internal pure returns (uint256) {
        uint256 stars;
        uint256 roll = seed % 1000;
        // will need revision, possibly manual configuration if we support more than 5 stars
        if (roll < 25) {
            stars = 4;
        } else if (roll < 75) {
            stars = 3;
        } else if (roll < 175) {
            stars = 2;
        } else if (roll < 735) {
            stars = 1;
        } else {
            stars = 0;
        }
        return stars;
    }

    function getEpicStars(uint256 seed) internal pure returns (uint256) {
        uint256 stars;
        uint256 roll = seed % 1000;
        // will need revision, possibly manual configuration if we support more than 5 stars
        if (roll < 7) {
            stars = 4;
        } else if (roll < 22) {
            stars = 3;
        } else if (roll < 47) {
            stars = 2;
        } else if (roll < 147) {
            stars = 1;
        } else if (roll < 157) {
            stars = 10; // Mint hero
        } else {
            stars = 0;
        }
        return stars;
    }

    function getFragmentAmount(address _account) public view returns (uint256) {
        return fragmentQty[_account];
    }

    function getBox(uint256 _id) public view returns (uint256 boxType) {
        Box memory _box = tokens[_id];
        boxType = uint256(_box.boxType);
    }

    function commonPriceInXBlade() public view returns (uint256 _price) {
        _price = cwController.usdToxBlade(commonPrice);
    }

    function rarePriceInXBlade() public view returns (uint256 _price) {
        _price = cwController.usdToxBlade(rarePrice);
    }

    function epicPriceInXBlade() public view returns (uint256 _price) {
        _price = cwController.usdToxBlade(epicPrice);
    }

    function calculatedFragment(
        uint24 playerRoll,
        uint24 monsterRoll,
        uint256 seed
    ) external pure returns (uint256 _fragmentAmmount) {
        _fragmentAmmount = 1;
        if (playerRoll < monsterRoll) {
            return _fragmentAmmount;
        }
        if (seed.mod(1000) < 100) {
            _fragmentAmmount = _fragmentAmmount.add(1);
        }
        if (seed.mod(1000) < 50) {
            _fragmentAmmount = _fragmentAmmount.add(1);
        }
    }

    function getUnclaimedStamina(address _account)
        public
        view
        returns (uint256)
    {
        return unclaimedStamina[_account];
    }

    function claimStamina(address _account, uint256 _claimStamina) public {
        require(
            _claimStamina <= getUnclaimedStamina(msg.sender),
            "Not enough stamina to claim"
        );
        unclaimedStamina[_account] = unclaimedStamina[_account].sub(
            _claimStamina
        );
    }

    function mintWithType(Type _type) private {
        uint256 tokenId = tokens.length;
        tokens.push(Box(_type));
        _mint(msg.sender, tokenId);
        emit NewBlindBox(tokenId, msg.sender);
    }

    function spinLuckyWheel() external returns (uint256 _result) {
        require(
            xBlade.balanceOf(msg.sender) > spinWheelPrice,
            "No money no spin"
        );
        uint256 seed = uint256(
            keccak256(abi.encodePacked(blockhash(block.number - 1), msg.sender))
        );
        uint256 roll = seed % 10000;
        if (roll < 50) {
            mintWithType(Type.EPIC);
            _result = 0;
        } else if (roll < 150) {
            mintWithType(Type.RARE);
            _result = 1;
        } else if (roll < 350) {
            mintWithType(Type.COMMON);
            _result = 2;
        } else if (roll < 800) {
            unclaimedStamina[msg.sender] = unclaimedStamina[msg.sender].add(20);
            _result = 3;
        } else if (roll < 1800) {
            unclaimedStamina[msg.sender] = unclaimedStamina[msg.sender].add(10);
            _result = 4;
        } else if (roll < 3000) {
            unclaimedStamina[msg.sender] = unclaimedStamina[msg.sender].add(5);
            _result = 5;
        } else {
            fragmentQty[msg.sender] = fragmentQty[msg.sender].add(10);
            _result = 6;
        }
        emit Spin(msg.sender, _result);
    }
}
