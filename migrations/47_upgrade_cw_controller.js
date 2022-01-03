const { upgradeProxy } = require("@openzeppelin/truffle-upgrades");

const CWController = artifacts.require("CWController");

module.exports = async function (deployer, network, accounts) {
  const proxyAddress = "0xAadfa537ecA54d3d7655C4117bBFB83B9bF6035a"
  await upgradeProxy(
    proxyAddress,
    CWController,
    {
      deployer,
    }
  );
};
