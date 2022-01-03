const { deployProxy } = require("@openzeppelin/truffle-upgrades");

const CWController = artifacts.require("CWController");

module.exports = async function (deployer, network, accounts) {
  await deployProxy(
    CWController,
    [],
    {
      deployer,
    }
  );
};
