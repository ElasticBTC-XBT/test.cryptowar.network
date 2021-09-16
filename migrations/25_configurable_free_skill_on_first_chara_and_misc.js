const { upgradeProxy } = require('@openzeppelin/truffle-upgrades');

// const CryptoWars = artifacts.require("CryptoWars");
// const Weapons = artifacts.require("Weapons");
const Promos = artifacts.require("Promos");

module.exports = async function (deployer, network, accounts) {
  const promos = await Promos.deployed();

  await promos.migrateTo_f73df27();

};
