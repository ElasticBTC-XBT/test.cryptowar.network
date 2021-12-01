pragma solidity ^0.6.0;

import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/token/ERC721/ERC721Upgradeable.sol";
import "@openzeppelin/contracts-upgradeable/access/AccessControlUpgradeable.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
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
    using SafeMath for uint256;

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

    event NewBlindBox(uint256 indexed boxId, address indexed minter);
    event Burned(address indexed owner, uint256 indexed burned);
    event Open(address indexed minter, uint256 stars);

    function initialize(address _weapon, address _character, address _xBlade, address _cwController) public initializer {
        __ERC721_init("CryptoWars BlindBox", "CBB");
        __AccessControl_init_unchained();

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        _setupRole(GAME_ADMIN, msg.sender);
        commonQty = 100;
        rareQty = 100;
        epicQty = 100;

        commonPrice = 1 ether;
        rarePrice = 2 ether;
        epicPrice = 2 ether;

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

    function setBoxesPrice(
        uint256 _commonPrice,
        uint256 _rarePrice,
        uint256 _epicPrice
    ) public onlyGameAdmin {
        require(
            _commonPrice > 0 && _rarePrice > 0 && _epicPrice > 0,
            "Boxes price must be larger than 0"
        );

        commonPrice = _commonPrice;
        rarePrice = _rarePrice;
        epicPrice = _epicPrice;
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

    function buy(Type _type) public {
        uint256 tokenId = tokens.length;
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
            commonQty = commonQty - 1;
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
            rareQty = rareQty - 1;
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
            epicQty = epicQty - 1;
            tokens.push(Box(Type.EPIC));
        }

        _mint(msg.sender, tokenId);
        emit NewBlindBox(tokenId, msg.sender);
    }

    function open(uint256 id) public {
        address burnOwner = ownerOf(id);
        require(burnOwner == msg.sender, "Not box owner");
        Box storage _box = tokens[id];
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
        if (stars < 4) {
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
}
