const { deployProxy, upgradeProxy } = require("@openzeppelin/truffle-upgrades");
const BoostVolume = artifacts.require("BoostVolume");

module.exports = async function (deployer, network, accounts) {
  const xBladeAddress = "0x27a339d9B59b21390d7209b78a839868E319301B";
  const router = "0x10ed43c718714eb63d5aa57b78b54704e256024e";
  const bot = "";
  await deployProxy(BoostVolume, [xBladeAddress, router, bot], {
    deployer,
  });
};
