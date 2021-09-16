const { deployProxy, upgradeProxy } = require("@openzeppelin/truffle-upgrades");
const Weapons = artifacts.require("Weapons");


module.exports = async function (deployer, network, accounts) {
  // Deploy Weapons before deploying CryptoWars
  const weapons = await deployProxy(Weapons, [], { deployer });
};
