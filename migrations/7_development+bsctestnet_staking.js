const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const xBlade = artifacts.require("xBlade");
const ExperimentToken = artifacts.require("ExperimentToken");
const ExperimentToken2 = artifacts.require("ExperimentToken2");
const xBladeStakingRewardsUpgradeable = artifacts.require("xBladeStakingRewardsUpgradeable");
const LPStakingRewardsUpgradeable = artifacts.require("LPStakingRewardsUpgradeable");
const LP2StakingRewardsUpgradeable = artifacts.require("LP2StakingRewardsUpgradeable");

module.exports = async function (deployer, network, accounts) {
  if (network === 'development' || network === 'development-fork' || network === 'bsctestnet' || network === 'bsctestnet-fork') {
    const token = await xBlade.at("0xEa3B879038b8f5d541F99647E2203cD27Dbc4D29");
    const expToken = await ExperimentToken.deployed();
    // const expToken2 = await ExperimentToken2.deployed();

    await deployProxy(xBladeStakingRewardsUpgradeable, [accounts[0], accounts[0], token.address, token.address, 60], { deployer });
    await deployProxy(LPStakingRewardsUpgradeable, [accounts[0], accounts[0], token.address, expToken.address, 0], { deployer });
  }
};
