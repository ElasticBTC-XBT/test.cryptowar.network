const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');

const CryptoWars = artifacts.require("CryptoWars");
const Characters = artifacts.require("Characters");
const Promos = artifacts.require("Promos");
const Weapons = artifacts.require('Weapons');

module.exports = async function (deployer) {
  const promos = await Promos.deployed();

  // const game = await CryptoWars.deployed();
  const charas = await upgradeProxy(Characters.address, Characters, { deployer });
  // await game.migrateTo_ef994e2(promos.address);
  await charas.migrateTo_ef994e2(promos.address);

  const promos_GAME_ADMIN = await promos.GAME_ADMIN();
  await promos.grantRole(promos_GAME_ADMIN, charas.address);
  const weapons = await Weapons.deployed();
  await weapons.migrateTo_surprise(promos.address);
};
