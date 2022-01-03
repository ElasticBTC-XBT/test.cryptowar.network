const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const xBlade = artifacts.require("xBlade");
const ExperimentToken = artifacts.require("ExperimentToken");
const ExperimentToken2 = artifacts.require("ExperimentToken2");
const xBladeStakingRewardsUpgradeable = artifacts.require("xBladeStakingRewardsUpgradeable");
const LPStakingRewardsUpgradeable = artifacts.require("LPStakingRewardsUpgradeable");
const LP2StakingRewardsUpgradeable = artifacts.require("LP2StakingRewardsUpgradeable");

module.exports = async function (deployer, network, accounts) {
  // if (network === 'development' || network === 'development-fork' || network === 'bsctestnet' || network === 'bsctestnet-fork') {
  //   const token = await xBlade.at("0x27a339d9B59b21390d7209b78a839868E319301B");
  //   const expToken = await ExperimentToken.deployed();
  //   // const expToken2 = await ExperimentToken2.deployed();

  //   await deployProxy(xBladeStakingRewardsUpgradeable, [accounts[0], accounts[0], token.address, token.address, 60], { deployer });
  //   await deployProxy(LPStakingRewardsUpgradeable, [accounts[0], accounts[0], token.address, expToken.address, 0], { deployer });
  // }
  if (network === 'development' || network === 'development-fork' || network === 'bsctestnet' || network === 'bsctestnet-fork') {
    const ownerAddress = accounts[0];
    const rewardDistributorAddress = '0x2CC6D07871A1c0655d6A7c9b0Ad24bED8f940517';

    const xBladeTokenAddress = '0x27a339d9B59b21390d7209b78a839868E319301B';
    const lpTokenAddress = '0x90a1d4073772488ac3a19079cafa3bb9ed5045fe';

    await deployProxy(LPStakingRewardsUpgradeable, [ownerAddress, rewardDistributorAddress, xBladeTokenAddress, lpTokenAddress, 8000], { deployer });
  }
};
