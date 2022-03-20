const { upgradeProxy } = require("@openzeppelin/truffle-upgrades");

const xBlade = artifacts.require("xBlade");

module.exports = async function (deployer, network, accounts) {
  let xBladeTokenProxy;
  if (network === "bscmainnet") {
    xBladeTokenProxy = "0x27a339d9b59b21390d7209b78a839868e319301b";
  }
  if (network === "bsctestnet") {
    xBladeTokenProxy = "0x28ad774c41c229d48a441b280cbf7b5c5f1fed2b";
  }

  await upgradeProxy(xBladeTokenProxy, xBlade, {
    deployer,
  });
};
