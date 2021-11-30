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

    uint256 commonQty;
    uint256 rareQty;
    uint256 epicQty;

    uint256 commonPrice;
    uint256 rarePrice;
    uint256 epicPrice;

    event NewBlindBox(uint256 indexed boxId, address indexed minter);

    function initialize() public initializer {
        __ERC721_init("CryptoWars BlindBox", "CBB");
        __AccessControl_init_unchained();

        _setupRole(DEFAULT_ADMIN_ROLE, msg.sender);
        commonQty = 0;
        rareQty = 0;
        epicQty = 0;
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
}
