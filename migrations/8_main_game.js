const { deployProxy } = require("@openzeppelin/truffle-upgrades");
const assert = require("assert");

const DummyRandoms = artifacts.require("DummyRandoms");
const ChainlinkRandoms = artifacts.require("ChainlinkRandoms");

const xBlade = artifacts.require("xBlade");
const IERC20 = artifacts.require("IERC20");
const Characters = artifacts.require("Characters");
const Weapons = artifacts.require("Weapons");
const CryptoWars = artifacts.require("CryptoWars");
const Blacksmith = artifacts.require("Blacksmith");
const Promos = artifacts.require("Promos");
const RaidBasic = artifacts.require("RaidBasic");
const PancakeUtil = artifacts.require("PancakeUtil");

module.exports = async function (deployer, network) {
  let randoms, xBladeToken;
  if (network === "development" || network === "development-fork") {
    randoms = await deployProxy(DummyRandoms, [], { deployer });

    xBladeToken = await xBlade.deployed();
  } else if (network === "bsctestnet" || network === "bsctestnet-fork") {
    const linkToken = "0x84b9B910527Ad5C03A9Ca831909E21e236EA7b06";
    const vrfCoordinator = "0xa555fC018435bef5A13C6c6870a9d4C11DEC329C";
    const keyHash =
      "0xcaf3c3727e033261d383b315559476f48034c13b18f8cafed4d871abe5049186";
    const fee = web3.utils.toWei("0.1", "ether");

    await deployer.deploy(
      ChainlinkRandoms,
      vrfCoordinator,
      linkToken,
      keyHash,
      fee
    );
    randoms = await ChainlinkRandoms.deployed();

    xBladeToken = await IERC20.at("0x27a339d9B59b21390d7209b78a839868E319301B");
  } else if (network === "bscmainnet" || network === "bscmainnet-fork") {
    randoms = await ChainlinkRandoms.deployed();

    xBladeToken = await IERC20.at("0x27a339d9B59b21390d7209b78a839868E319301B");
  }


  console.info(`xBladeToken ${xBladeToken}`);

  assert(xBladeToken != null, "Expected xBlade to be set to a contract");
  assert(randoms != null, "Expected random to be set to a contract");

  const characters = await deployProxy(Characters, [], { deployer });
  const weapons = await deployProxy(Weapons, [], { deployer });
  const promos = await deployProxy(Promos, [], { deployer });
  // Deploy Blacksmith
  const blacksmith = await deployProxy(Blacksmith, [weapons.address, randoms.address], { deployer });

  // Testnet
  const pancakeRouter = "0x10ED43C718714eb63d5aA57B78B54704E256024E"; // Pancake router address
  const busdAddress = "0xe9e7CEA3DedcA5984780Bafc599bD69ADd087D56"; // BUSD Address for get price


  await deployer.deploy(PancakeUtil);
  await deployer.link(PancakeUtil, CryptoWars);

  const game = await deployProxy(
    CryptoWars,
    [
      xBladeToken.address,
      characters.address,
      weapons.address,
      randoms.address,
      pancakeRouter,
      busdAddress,
      blacksmith.address,
      promos.address
    ],
    {
      deployer,
      unsafeAllow: ["external-library-linking"],
      initializer: "initialize",
    }
  );


  const characters_GAME_ADMIN = await characters.GAME_ADMIN();
  await characters.grantRole(characters_GAME_ADMIN, game.address);

  const weapons_GAME_ADMIN = await weapons.GAME_ADMIN();
  await weapons.grantRole(weapons_GAME_ADMIN, game.address);


  if (typeof randoms.setMain === "function") {
    await randoms.setMain(game.address);
  }

  // Should this really be here?
  const raid = await deployProxy(RaidBasic, [game.address], { deployer });

  const GAME_ADMIN = await game.GAME_ADMIN();
  await game.grantRole(GAME_ADMIN, raid.address);



  const GAME = await blacksmith.GAME();

  await blacksmith.grantRole(GAME, game.address);

};
