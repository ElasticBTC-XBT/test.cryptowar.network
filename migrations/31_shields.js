const { deployProxy, upgradeProxy } = require('@openzeppelin/truffle-upgrades');

const CryptoWars = artifacts.require("CryptoWars");
const Blacksmith = artifacts.require("Blacksmith");
const Shields = artifacts.require("Shields");
const NFTMarket = artifacts.require("NFTMarket");
const Promos = artifacts.require("Promos");

module.exports = async function (deployer, network, accounts) {
  const game = await CryptoWars.deployed();
  const promos = await Promos.deployed();

  const shields = await deployProxy(Shields, [], { deployer });

  const blacksmith = await Blacksmith.deployed();
  await blacksmith.migrateTo_61c10da(shields.address, game.address);

  const shields_GAME_ADMIN = await shields.GAME_ADMIN();
  await shields.grantRole(shields_GAME_ADMIN, blacksmith.address);
  await shields.migrateTo_surprise(promos.address);

  const game_GAME_ADMIN = await game.GAME_ADMIN();
  await game.grantRole(game_GAME_ADMIN, blacksmith.address);

  const promos_GAME_ADMIN = await promos.GAME_ADMIN();
  await promos.grantRole(promos_GAME_ADMIN, blacksmith.address);

  const market = await NFTMarket.deployed();
  await market.allowToken(shields.address);
};
