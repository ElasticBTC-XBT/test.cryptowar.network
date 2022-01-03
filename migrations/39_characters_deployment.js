const { deployProxy,upgradeProxy } = require("@openzeppelin/truffle-upgrades");
const Characters = artifacts.require("Characters");


module.exports = async function (deployer, network, accounts) {
  // Deploy Characters before CryptoWars
  // const characters = await Characters.deployed();
  await deployProxy(Characters,[], { deployer });
};
