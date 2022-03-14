const { upgradeProxy } = require("@openzeppelin/truffle-upgrades");

const xBlade = artifacts.require("xBlade");

module.exports = async function (deployer, network, accounts) {
  let xBladeTokenProxy;
  if (network === "bscmainnet") {
    xBladeTokenProxy = "0x27a339d9b59b21390d7209b78a839868e319301b";
  }
  await upgradeProxy(xBladeTokenProxy, xBlade, {
    deployer,
  });
};
