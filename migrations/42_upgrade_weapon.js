const Weapons = artifacts.require("Weapons");
const { upgradeProxy } = require("@openzeppelin/truffle-upgrades");

module.exports = async function (deployer, network) {
  let proxyAddress = ""
  if(network === "bsctestnet"){
    proxyAddress = "0xfcf01fa5b11bf8506f4e674e747403c3d7fdc70b"
  }
  if(network === "bscmainnet") {
    proxyAddress = "0x52683412f6Ea2B6302ceA8406EfF928510466c2c"
  }

  await upgradeProxy(proxyAddress, Weapons, {
    deployer,
  });
};
