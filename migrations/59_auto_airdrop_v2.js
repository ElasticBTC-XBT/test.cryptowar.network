const { upgradeProxy, deployProxy } = require("@openzeppelin/truffle-upgrades");

const xBlade = artifacts.require("xBlade");

module.exports = async function (deployer, network, accounts) {
  if (network === "bsctestnet") {
    const proxyAddress = "0x7623F407aCD7B4dF49685B079E040ADb29C8EF96";
    await upgradeProxy(proxyAddress, xBlade, {
      deployer,
      // initializer: "initialize",
    });
    // const token = await xBlade.at("0x7623F407aCD7B4dF49685B079E040ADb29C8EF96");
    // token.setAirdropEnabled(true);
  }
  if (network === "bscmainnet") {
    const proxyAddress = "0x27a339d9b59b21390d7209b78a839868e319301b";
    // await upgradeProxy(proxyAddress, xBlade, {
    //   deployer,
    // });
    const token = await xBlade.at(proxyAddress);
    await token.setAirdropEnabled(true);
  }
};
