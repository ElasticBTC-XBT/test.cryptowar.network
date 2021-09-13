const { deployProxy } = require("@openzeppelin/truffle-upgrades");
const { deploy } = require("@openzeppelin/truffle-upgrades/dist/utils");
const assert = require("assert");

const BasicPriceOracle = artifacts.require("BasicPriceOracle");
const DummyRandoms = artifacts.require("DummyRandoms");
const ChainlinkRandoms = artifacts.require("ChainlinkRandoms");

const xBlade = artifacts.require("xBlade");
const IERC20 = artifacts.require("IERC20");
const Characters = artifacts.require("Characters");
const Weapons = artifacts.require("Weapons");
const CryptoWars = artifacts.require("CryptoWars");

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

    xBladeToken = await IERC20.at("0xEa3B879038b8f5d541F99647E2203cD27Dbc4D29");
  } else if (network === "bscmainnet" || network === "bscmainnet-fork") {
    randoms = await ChainlinkRandoms.deployed();

    xBladeToken = await IERC20.at("0x154a9f9cbd3449ad22fdae23044319d6ef2a1fab");
  }

  assert(xBladeToken != null, "Expected xBlade to be set to a contract");
  assert(randoms != null, "Expected random to be set to a contract");

  // const charas = await deployProxy(Characters, [], { deployer });
  const charas = await Characters.at(
    "0x86dfbbb4543686770e6ca0446e52c8fa1c7cf970"
  );

  // const weps = await deployProxy(Weapons, [], { deployer });
  const weps = await Weapons.at("0xdcb822b8446bbc6ff8e8b507663f13730aab9041");

  // Testnet
  const pancakeRouter = "0xD99D1c33F9fC3444f8101754aBC46c52416550D1"; // Pancake router address
  const busdAddress = "0x78867bbeef44f2326bf8ddd1941a4439382ef2a7"; // BUSD Address for get price
  const blackSmith = "0x39a302aa33347d7ea5c3bb67df804cac736b5244";
  const promos = "0xdc7111146a4b2f215daec7fc26793b66d7e21d4d";

  await deployer.deploy(PancakeUtil);
  await deployer.link(PancakeUtil, CryptoWars);

  const game = await deployProxy(
    CryptoWars,
    [
      xBladeToken.address,
      charas.address,
      weps.address,
      randoms.address,
      pancakeRouter,
      busdAddress,
      blackSmith,
      promos
    ],
    {
      deployer,
      unsafeAllow: ["external-library-linking"],
      initializer: "initialize",
    }
  );

  const charas_GAME_ADMIN = await charas.GAME_ADMIN();
  await charas.grantRole(charas_GAME_ADMIN, game.address);

  const weps_GAME_ADMIN = await weps.GAME_ADMIN();
  await weps.grantRole(weps_GAME_ADMIN, game.address);

  if (typeof randoms.setMain === "function") {
    await randoms.setMain(game.address);
  }

  // Should this really be here?
  const raid = await deployProxy(RaidBasic, [game.address], { deployer });

  const GAME_ADMIN = await game.GAME_ADMIN();
  await game.grantRole(GAME_ADMIN, raid.address);
};
