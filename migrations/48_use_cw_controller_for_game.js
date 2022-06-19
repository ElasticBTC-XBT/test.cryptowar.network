const { upgradeProxy } = require("@openzeppelin/truffle-upgrades");

const CryptoWars = artifacts.require("CryptoWars");
const CWController = artifacts.require("CWController");

module.exports = async function (deployer, network, accounts) {
  let gameProxyAddress,
    cwControllerAddress,
    busdReverseAddress,
    xBladeAddress,
    routerAddress,
    busdAddress;
  if (network === "thundercore") {
    gameProxyAddress = "0x5AAB818289B8e18DFb5c1d03994Ec070d4977929";
    cwControllerAddress = "0x73979a145092a47B1437d3e8b1De89ec5c4F7F5B";
    busdReverseAddress = "0x0ac4452a84571bc3167a36b285c2e1db29ce6291";
    xBladeAddress = "0xC7e87456d0a3ACCe76237677cE9aAfDf8B0caA70";
    routerAddress = "0xfa9fe703a882d883c635a949da91405ce011e526";
    busdAddress = "0xbeb0131d95ac3f03fd15894d0ade5dbf7451d171";
  }
  if (network === "bscmainnet") {
    gameProxyAddress = "0x8BA9f0841cFA75d7e2c7a316b048b04c98C95cA4"; //mainnet
    cwControllerAddress = "0xAadfa537ecA54d3d7655C4117bBFB83B9bF6035a"; // controller address
  }

  const controller = await CWController.at(cwControllerAddress);
  await controller.migrate_v2(routerAddress, xBladeAddress, busdAddress);
  await controller.setGame(gameProxyAddress);

  const game = await CryptoWars.at(gameProxyAddress);
  await game.setCWController(cwControllerAddress);
};
