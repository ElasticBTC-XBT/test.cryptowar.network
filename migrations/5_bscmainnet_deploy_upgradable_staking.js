const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const LPStakingRewardsUpgradeable = artifacts.require("LPStakingRewardsUpgradeable");

module.exports = async function (deployer, network, accounts) {
  if (network === 'bscmainnet' || network === 'bscmainnet-fork') {
    const ownerAddress = accounts[0];
    const rewardDistributorAddress = '0xC2573A26297a0c952C92bb48Fdcb6929524F7F48';

    const xBladeTokenAddress = '0x27a339d9B59b21390d7209b78a839868E319301B';
    const lpTokenAddress = '0xC19dfd34D3ba5816dF9CBDaa02D32A9F8dc6F6fC';
    const stakingDuration = 0;

    await deployProxy(LPStakingRewardsUpgradeable, [ownerAddress, rewardDistributorAddress, xBladeTokenAddress, lpTokenAddress, stakingDuration], { deployer });
  }
};

