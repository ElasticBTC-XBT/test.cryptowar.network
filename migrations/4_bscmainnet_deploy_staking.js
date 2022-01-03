const SkillStakingRewards = artifacts.require("SkillStakingRewards");
const LPStakingRewards = artifacts.require("LPStakingRewards");

module.exports = async function (deployer, network) {
  // Dont use staking without upgradable
  // if (network === 'bscmainnet' || network === 'bscmainnet-fork') {
  //   const ownerAddress = '0xC2573A26297a0c952C92bb48Fdcb6929524F7F48';
  //   const rewardDistributorAddress = '0xC2573A26297a0c952C92bb48Fdcb6929524F7F48';

  //   const xBladeTokenAddress = '0x27a339d9B59b21390d7209b78a839868E319301B';
  //   const lpTokenAddress = '0xf0252108666A9a6B473aB4028781965064D78147';
  //   const minimumStakeTime = 7 * 24 * 60 * 60 // 7 days

  //   // 0.001 minimumStakeAmount
  //   await deployer.deploy(SkillStakingRewards, ownerAddress, rewardDistributorAddress, xBladeTokenAddress, xBladeTokenAddress, 1000000000000000, minimumStakeTime);

  //   // 0.001 minimumStakeAmount
  //   await deployer.deploy(LPStakingRewards, ownerAddress, rewardDistributorAddress, xBladeTokenAddress, lpTokenAddress, 1000000000000000, 0);
  // }
};
