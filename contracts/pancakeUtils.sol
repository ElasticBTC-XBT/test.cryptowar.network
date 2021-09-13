pragma solidity ^0.6.0;

import "@openzeppelin/contracts/math/SafeMath.sol";
import "abdk-libraries-solidity/ABDKMath64x64.sol";
import "./interfaces/IPancakeRouter02.sol";

library PancakeUtil {
    using SafeMath for uint256;
    using SafeMath for uint64;
    using ABDKMath64x64 for int128;

    function swapBNBForTokens(address _routerAddress, address _token, uint256 _bnbAmount) public {
        IPancakeRouter02 pancakeRouter = IPancakeRouter02(_routerAddress);
        // generate the pancake pair path of token -> weth
        address[] memory path = new address[](2);
        path[0] = pancakeRouter.WETH();
        path[1] = address(_token);

        // make the swap
        pancakeRouter.swapExactETHForTokensSupportingFeeOnTransferTokens{
            value: _bnbAmount
        }(
            0, // accept any amount of BNB
            path,
            address(this),
            block.timestamp + 360
        );

    }

    function addLiquidityForTokens(address _routerAddress, address _tokenAddress, uint256 _bnbAmount) public {
        IPancakeRouter02 pancakeRouter = IPancakeRouter02(_routerAddress);
        // generate the pancake pair path of token -> weth
        address[] memory path = new address[](2);
        path[0] = pancakeRouter.WETH();
        path[1] = address(_tokenAddress);

        uint256 size1 = pancakeRouter.getAmountsOut(_bnbAmount, path)[1];

        pancakeRouter.addLiquidityETH{value: _bnbAmount}(
            _tokenAddress,
            size1,
            0, // slippage is unavoidable
            0, // slippage is unavoidable
            address(this),
            block.timestamp + 360
        );
    }

    function getAmountTokenFromBNB(address _routerAddress, address _tokenAddress, uint256 _bnbAmount) public view returns (uint) {
        IPancakeRouter02 pancakeRouter = IPancakeRouter02(_routerAddress);

        address[] memory path = new address[](2);
        path[0] = pancakeRouter.WETH();
        path[1] = address(_tokenAddress);

        return pancakeRouter.getAmountsOut(_bnbAmount, path)[1];
    }

    function getAmountBNBFromTokens(address _routerAddress, address _tokenAddress, uint256 _tokenAmount) public view returns (uint) {
        IPancakeRouter02 pancakeRouter = IPancakeRouter02(_routerAddress);

        address[] memory path = new address[](2);
        path[0] = _tokenAddress;
        path[1] = pancakeRouter.WETH();

        return pancakeRouter.getAmountsOut(_tokenAmount, path)[1];
    }

    function usdToxBlade(
        address _routerAddress,
        address usdAddress,
        address xBlade,
        int128 usdAmount
    ) public view returns (uint256) {
        IPancakeRouter02 pancakeRouter = IPancakeRouter02(_routerAddress);
        // generate the pancake pair path of token -> weth
        address[] memory path = new address[](2);
        path[0] = usdAddress;
        path[1] = xBlade;

        uint256 size1 = pancakeRouter.getAmountsOut(
            ABDKMath64x64.toUInt(usdAmount) * 10**18,
            path
        )[1];
        return size1;
    }
}
