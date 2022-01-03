const { upgradeProxy } = require("@openzeppelin/truffle-upgrades");

const PancakeUtil = artifacts.require("PancakeUtil");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(PancakeUtil);
  
};
