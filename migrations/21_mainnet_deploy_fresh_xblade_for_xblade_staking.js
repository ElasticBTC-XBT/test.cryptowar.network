const { deployProxy } = require("@openzeppelin/truffle-upgrades");

const xBladeStakingRewardsUpgradeable = artifacts.require(
  "xBladeStakingRewardsUpgradeable"
);

const CryptoWars = artifacts.require("CryptoWars");

module.exports = async function (deployer, network, accounts) {
  if (network === "bscmainnet" || network === "bscmainnet-fork") {
    const xBladeAddress = "0x27a339d9B59b21390d7209b78a839868E319301B";
    const ownerAddress = accounts[0];
    const rewardDistributorAddress = accounts[0];

    const minimumStakingDays = 7 * 24 * 60 * 60;
    const xBladeStakingRewards = await deployProxy(
      xBladeStakingRewardsUpgradeable,
      [
        ownerAddress,
        rewardDistributorAddress,
        xBladeAddress,
        xBladeAddress,
        minimumStakingDays,
      ],
      { deployer }
    );

    // 1 minimumStakeAmount
    await xBladeStakingRewards.migrateTo_8cb6e70("1000000000000000000");

    const game = await CryptoWars.deployed();
    await game.migrateTo_23b3a8b(xBladeStakingRewards.address);
    await xBladeStakingRewards.migrateTo_23b3a8b(game.address);
  }
};
