const { deployProxy } = require("@openzeppelin/truffle-upgrades");

const BNBLPStakingRewardsUpgradeable = artifacts.require(
  "BNBLPStakingRewardsUpgradeable"
);

// const XBNLPStakingRewardsUpgradeable = artifacts.require(
//   "XBNLPStakingRewardsUpgradeable"
// );

// const BUSDLPStakingRewardsUpgradeable = artifacts.require(
//   "BUSDLPStakingRewardsUpgradeable"
// );

module.exports = async function (deployer, network, accounts) {
  if (network === "bscmainnet" || network === "bscmainnet-fork") {
    const ownerAddress = accounts[0];
    const rewardDistributorAddress =
      "0x5678917FfEb77827Aafc33419E99DaCd707313a9";

    const xBladeTokenAddress = "0x27a339d9B59b21390d7209b78a839868E319301B"; // Reward token
    const bnbLPTokenAddress = "0xfea1510bd3ea668a4d14f7f1d95f7ab4ecaa66ed"; // BNB-xBlade Staking token
    const stakingDuration = 604800; // Minimum stake time to free tax ( 7 days)

    // Deploy BNB-xBlade staking
    await deployProxy(
      BNBLPStakingRewardsUpgradeable,
      [
        ownerAddress,
        rewardDistributorAddress,
        xBladeTokenAddress,
        bnbLPTokenAddress,
        stakingDuration,
      ],
      { deployer }
    );

    // Deploy xBlade stake for xBlade
    await deployProxy(
      BNBLPStakingRewardsUpgradeable,
      [
        ownerAddress,
        rewardDistributorAddress,
        xBladeTokenAddress,
        xBladeTokenAddress,
        stakingDuration,
      ],
      { deployer }
    );
  }
};
