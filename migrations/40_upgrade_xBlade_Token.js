const xBlade = artifacts.require("xBlade");
const { upgradeProxy } = require("@openzeppelin/truffle-upgrades");

module.exports = async function (deployer) {
  // const proxyAddress = "0x61Fc654aA0185bae02a9A3b110D28C3AE8412CEf"; // testnet;
  const proxyAddress = "0x27a339d9B59b21390d7209b78a839868E319301B"; //mainnet
  await upgradeProxy(proxyAddress, xBlade, {
    deployer,
  });

  const token = await xBlade.at(proxyAddress);
};
