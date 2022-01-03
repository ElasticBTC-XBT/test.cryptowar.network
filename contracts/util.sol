pragma solidity ^0.6.0;

import "abdk-libraries-solidity/ABDKMath64x64.sol";
import "@openzeppelin/contracts/math/SafeMath.sol";

library RandomUtil {

    using SafeMath for uint256;

    function randomSeededMinMax(uint min, uint max, uint seed) internal pure returns (uint) {
        // inclusive,inclusive (don't use absolute min and max values of uint256)
        // deterministic based on seed provided
        uint diff = max.sub(min).add(1);
        uint randomVar = uint(keccak256(abi.encodePacked(seed))).mod(diff);
        randomVar = randomVar.add(min);
        return randomVar;
    }

    function combineSeeds(uint seed1, uint seed2) internal pure returns (uint) {
        return uint(keccak256(abi.encodePacked(seed1, seed2)));
    }

    function combineSeeds(uint[] memory seeds) internal pure returns (uint) {
        return uint(keccak256(abi.encodePacked(seeds)));
    }

    function plusMinus10PercentSeeded(uint256 num, uint256 seed) internal pure returns (uint256) {
        uint256 tenPercent = num.div(10);
        return num.sub(tenPercent).add(randomSeededMinMax(0, tenPercent.mul(2), seed));
    }

    function plusMinus10PercentSeededWithLv(uint256 num, uint256 seed, uint8 level) internal pure returns (uint256) {
        uint256 tenPercent = num.div(10);
        uint256 r = combineSeeds(seed, level);
        if (r.mod(100) < 10){
            return num.sub(tenPercent).add(randomSeededMinMax(0, tenPercent.mul(2), seed));
        }
        uint256 buffOrNerf = 100;
        uint256 r2 = combineSeeds(r, level);
        if (level < 8 ) {
            buffOrNerf = randomSeededMinMax(98, 101, r2);
        } else if (level <= 11) {
            buffOrNerf = randomSeededMinMax(88, 96, r2);
        } else if (level <= 21) {
            buffOrNerf = randomSeededMinMax(86, 94, r2);
        } else if (level <= 31) {
            buffOrNerf = randomSeededMinMax(80, 94, r2);
        } else {
            buffOrNerf = randomSeededMinMax(68, 80, r2);
        }
        return num.sub(tenPercent).add(randomSeededMinMax(0, tenPercent.mul(2), seed)).mul(buffOrNerf).div(100);
    }

    function uint2str(uint _i) internal pure returns (string memory _uintAsString) {
        if (_i == 0) {
            return "0";
        }
        uint j = _i;
        uint len;
        while (j != 0) {
            len++;
            j /= 10;
        }
        bytes memory bstr = new bytes(len);
        uint k = len - 1;
        while (_i != 0) {
            bstr[k--] = byte(uint8(48 + _i % 10));
            _i /= 10;
        }
        return string(bstr);
    }
}