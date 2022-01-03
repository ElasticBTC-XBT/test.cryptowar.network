const { deployProxy, upgradeProxy } = require("@openzeppelin/truffle-upgrades");
const SecretBox = artifacts.require("SecretBox");
const CryptoWars = artifacts.require("CryptoWars");
const Weapons = artifacts.require("Weapons");
const Characters = artifacts.require("Characters");

module.exports = async function (deployer, network, accounts) {
  const xBladeAddress = "0x27a339d9B59b21390d7209b78a839868E319301B";
  const game = await CryptoWars.deployed();
  const weapons = await Weapons.deployed();
  const characters = await Characters.deployed();

  await upgradeProxy(weapons, Weapons, { deployer });
  const secretBox = await deployProxy(
    SecretBox,
    [xBladeAddress, game.address, characters.address, weapons.address],
    {
      deployer,
    }
  );

  const weapons_BOX_OPENER = await weapons.BOX_OPENER();
  await weapons.grantRole(weapons_BOX_OPENER, secretBox.address);
};
