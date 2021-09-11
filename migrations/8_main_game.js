const { deployProxy } = require('@openzeppelin/truffle-upgrades');
const assert = require('assert');

const BasicPriceOracle = artifacts.require("BasicPriceOracle");
const DummyRandoms = artifacts.require("DummyRandoms");
const ChainlinkRandoms = artifacts.require("ChainlinkRandoms");

const xBlade = artifacts.require("xBlade");
const IERC20 = artifacts.require("IERC20");
const Characters = artifacts.require("Characters");
const Weapons = artifacts.require("Weapons");
const CryptoWars = artifacts.require("CryptoWars");

const RaidBasic = artifacts.require("RaidBasic");

module.exports = async function (deployer, network) {
  let randoms, xBladeToken;
  if (network === 'development' || network === 'development-fork') {
    randoms = await deployProxy(DummyRandoms, [], { deployer });

    xBladeToken = await xBlade.deployed();
  }
  else if (network === 'bsctestnet' || network === 'bsctestnet-fork') {
    const linkToken = '0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06';
    const vrfCoordinator = '0xa555fC018435bef5A13C6c6870a9d4C11DEC329C';
    const keyHash = '0xcaf3c3727e033261d383b315559476f48034c13b18f8cafed4d871abe5049186';
    const fee = web3.utils.toWei('0.1', 'ether');

    await deployer.deploy(ChainlinkRandoms, vrfCoordinator, linkToken, keyHash, fee);
    randoms = await ChainlinkRandoms.deployed();

    xBladeToken = await xBlade.deployed();
  }
  else if (network === 'bscmainnet' || network === 'bscmainnet-fork') {
    randoms = await ChainlinkRandoms.deployed();

    xBladeToken = await IERC20.at('0x154a9f9cbd3449ad22fdae23044319d6ef2a1fab');
  }

  assert(xBladeToken != null, 'Expected xBlade to be set to a contract');
  assert(randoms != null, 'Expected random to be set to a contract');

  const priceOracle = await deployProxy(BasicPriceOracle, [], { deployer });

  const charas = await deployProxy(Characters, [], { deployer });

  const weps = await deployProxy(Weapons, [], { deployer });

  // Testnet
  const pancakeRouter = "0xD99D1c33F9fC3444f8101754aBC46c52416550D1";// Pancake router address
  const busdAddress = "0x78867bbeef44f2326bf8ddd1941a4439382ef2a7"; // BUSD Address for get price

  const game = await deployProxy(CryptoWars, [xBladeToken.address, charas.address, weps.address, priceOracle.address, randoms.address, pancakeRouter, busdAddress], { deployer });

  const charas_GAME_ADMIN = await charas.GAME_ADMIN();
  await charas.grantRole(charas_GAME_ADMIN, game.address);

  const weps_GAME_ADMIN = await weps.GAME_ADMIN();
  await weps.grantRole(weps_GAME_ADMIN, game.address);

  if(typeof randoms.setMain === 'function') {
    await randoms.setMain(game.address);
  }

  // Should this really be here?
  const raid = await deployProxy(RaidBasic, [game.address], { deployer });

  const GAME_ADMIN = await game.GAME_ADMIN();
  await game.grantRole(GAME_ADMIN, raid.address);

};
