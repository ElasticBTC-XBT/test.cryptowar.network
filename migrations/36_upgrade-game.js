const { upgradeProxy } = require("@openzeppelin/truffle-upgrades");
const CryptoWars = artifacts.require("CryptoWars");
const PancakeUtil = artifacts.require("PancakeUtil");

module.exports = async function (deployer, network, accounts) {
  await deployer.deploy(PancakeUtil);
  await deployer.link(PancakeUtil, CryptoWars);

  const game = await CryptoWars.deployed();
  await upgradeProxy(game.address, CryptoWars, {
    deployer,
    unsafeAllow: ["external-library-linking"],
  });
};
