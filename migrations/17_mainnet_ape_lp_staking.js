const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const LPStakingRewardsUpgradeable = artifacts.require("LPStakingRewardsUpgradeable");

module.exports = async function (deployer, network, accounts) {
  // Ignore for not staking in APE Swap
  // if (network === 'bscmainnet' || network === 'bscmainnet-fork') {
  //   const rewardDistributorAddress = '0xC2573A26297a0c952C92bb48Fdcb6929524F7F48';

  //   const skillTokenAddress = '0x27a339d9B59b21390d7209b78a839868E319301B';
  //   const lpTokenAddress = '0x0dEB588c1EC6f1D9f348126D401f05c4c7B7a80c';

  //   await deployProxy(LPStakingRewardsUpgradeable, [accounts[0], rewardDistributorAddress, skillTokenAddress, lpTokenAddress, 0], { deployer });
  // }
};

