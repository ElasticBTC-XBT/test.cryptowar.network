const { upgradeProxy } = require("@openzeppelin/truffle-upgrades");

const CWController = artifacts.require("CWController");
const CryptoWars = artifacts.require("CryptoWars");

module.exports = async function (deployer, network, accounts) {
  if (network === "bscmainnet") {
    const cwProxyAddress = "0xAadfa537ecA54d3d7655C4117bBFB83B9bF6035a";
    await upgradeProxy(cwProxyAddress, CWController, {
      deployer,
    });
    const controller = await CWController.at(cwProxyAddress);
    controller.setPowerWeight(500);
    const gameProxyAddress = "0x8BA9f0841cFA75d7e2c7a316b048b04c98C95cA4"; //mainnet
    await upgradeProxy(gameProxyAddress, CryptoWars, {
      deployer,
      unsafeAllow: ["external-library-linking"],
    });
  }
};
