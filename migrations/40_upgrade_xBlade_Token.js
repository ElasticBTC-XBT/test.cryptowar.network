const xBlade = artifacts.require("xBlade");
const { upgradeProxy } = require("@openzeppelin/truffle-upgrades");

module.exports = async function (deployer) {
  
  // const proxyAddress = "0x8781413C768f207699D51f42b909c5d6A9D9aD36"; testnet
  const proxyAddress = "0x27a339d9B59b21390d7209b78a839868E319301B"; //mainnet
  await upgradeProxy(proxyAddress, xBlade, {
    deployer,
    unsafeAllow: ["external-library-linking"],
  });
};
