pragma solidity ^0.6.0;

import "@openzeppelin/contracts-upgradeable/proxy/Initializable.sol";
import "@openzeppelin/contracts-upgradeable/access/OwnableUpgradeable.sol";
import "@openzeppelin/contracts/token/ERC20/IERC20.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";
import "./interfaces/IPancakeRouter02.sol";

contract BoostVolume is Initializable, OwnableUpgradeable {
    using SafeMath for uint256;

    address public bot;
    IERC20 public xBlade;
    IPancakeRouter02 public router;

    function initialize(
        IERC20 _xBlade,
        address _router,
        address _bot
    ) public initializer {
        OwnableUpgradeable.__Ownable_init();

        xBlade = _xBlade;
        bot = _bot;
        router = IPancakeRouter02(_router);
    }

    function makeSomeVolume() public {
        require(msg.sender == bot, "This is not a bot");
        uint256 bnbBalance = address(this).balance;
        swapBNBForTokens(address(xBlade), bnbBalance);

        // uint256 tokenBalance = xBlade.balanceOf(address(this));
        // swapTokensForBNB(address(xBlade), tokenBalance);
    }

    function swapBNBForTokens(address _token, uint256 _bnbAmount) public {
        // generate the pancake pair path of token -> weth
        address[] memory path = new address[](3);
        path[0] = router.WETH();
        path[1] = address(_token);
        path[2] = router.WETH();

        // make the swap
        router.swapExactETHForTokensSupportingFeeOnTransferTokens{
            value: _bnbAmount
        }(
            0, // accept any amount of BNB
            path,
            address(this),
            block.timestamp + 360
        );
    }

    function swapTokensForBNB(address _token, uint256 _tokenAmount) public {
        // generate the pancake pair path of token -> weth
        address[] memory path = new address[](2);
        path[0] = router.WETH();
        path[1] = address(_token);

        // make the swap
        router.swapExactTokensForETHSupportingFeeOnTransferTokens(
            _tokenAmount,
            0, // accept any amount of BNB
            path,
            address(this),
            block.timestamp + 360
        );
    }
}
