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

  const game = await CryptoWars.at("0x8BA9f0841cFA75d7e2c7a316b048b04c98C95cA4");
  await game.setSupportFeeRate(70)
};
