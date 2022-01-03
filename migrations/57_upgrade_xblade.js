const { upgradeProxy } = require("@openzeppelin/truffle-upgrades");

const xBlade = artifacts.require("xBlade");

module.exports = async function (deployer, network, accounts) {
  if (network === "bscmainnet") {
    const xBladeTokenProxy = "0x27a339d9b59b21390d7209b78a839868e319301b";
    // await upgradeProxy(xBladeTokenProxy, xBlade, {
    //   deployer,
    // });
    const xBladeToken = await xBlade.at(xBladeTokenProxy);
    await xBladeToken.setAirdropEnabled(false);
  }
};
