pragma solidity ^0.6.2;

import "./staking/StakingRewardsUpgradeable.sol";
import "./interfaces/IStakeFromGame.sol";
import "./CryptoWars.sol";

contract XBladeStakingRewardsUpgradeable is IStakeFromGame, StakingRewardsUpgradeable {
    /* ========== VIEWS ========== */

    function game() external view returns (CryptoWars) {
        return __game;
    }

    /* ========== RESTRICTED FUNCTIONS ========== */

    function migrateTo_23b3a8b(CryptoWars _game) external onlyOwner {
        __game = _game;
    }

    function stakeFromGame(address player, uint256 amount)
        external
        override
        normalMode
        nonReentrant
        whenNotPaused
        onlyGame
        updateReward(player)
    {
        _stake(player, amount);
        stakingToken.safeTransferFrom(address(__game), address(this), amount);
    }

    /* ========== MODIFIERS ========== */

    modifier onlyGame() {
        require(msg.sender == address(__game), "Only callable by game");
        _;
    }
}
