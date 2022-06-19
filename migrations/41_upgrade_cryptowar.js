const { upgradeProxy } = require("@openzeppelin/truffle-upgrades");

const CryptoWars = artifacts.require("CryptoWars");

module.exports = async function (deployer, network, accounts) {
  let proxyAddress;
  if (network === "bsctestnet") {
    proxyAddress = "0xc3bA116D38cCAc8f9ccb18f20E24fCd3DE2F3eA0";
  }
  if (network === "bscmainnet") {
    proxyAddress = "0x8BA9f0841cFA75d7e2c7a316b048b04c98C95cA4";
  }

  if (network === "thundercore") {
    proxyAddress = "0x5AAB818289B8e18DFb5c1d03994Ec070d4977929";
  }

  await upgradeProxy(proxyAddress, CryptoWars, {
    deployer,
  });
};
