const { deployProxy, upgradeProxy } = require("@openzeppelin/truffle-upgrades");

const BlindBox = artifacts.require("BlindBox");
const Characters = artifacts.require("Characters");
const Weapons = artifacts.require("Weapons");
const CryptoWars = artifacts.require("CryptoWars");

module.exports = async function (deployer, network, accounts) {
  let weaponAddress, characterAddress, blindBox, cwControllerAddress, xBlade, cryptoWarsAddress;
  if (network === "bsctestnet") {
    characterAddress = "0x89f874f2e809974e49220b077b0e256bfddae4f7";
    weaponAddress = "0xFCf01FA5B11bf8506f4E674e747403c3D7fdC70B";
    cwControllerAddress = "0x8560CFC9fdFdd9499be4EE8f9E4b36C48662de45";
    xBlade = "0x28ad774c41c229d48a441b280cbf7b5c5f1fed2b";
    cryptoWarsAddress= "0xc3ba116d38ccac8f9ccb18f20e24fcd3de2f3ea0"
  }
  if (network === "bscmainnet") {
    characterAddress = "0xc38470bfe1b08c3bafdaf699eba2fca1fd2b040b";
    weaponAddress = "0x52683412f6ea2b6302cea8406eff928510466c2c";
    cwControllerAddress = "0xAadfa537ecA54d3d7655C4117bBFB83B9bF6035a";
    xBlade = "0x27a339d9b59b21390d7209b78a839868e319301b";
    cryptoWarsAddress= "0x8BA9f0841cFA75d7e2c7a316b048b04c98C95cA4"
  }
  blindBox = await deployProxy(
    BlindBox,
    [weaponAddress, characterAddress, xBlade, cwControllerAddress],
    {
      deployer,
      initializer: "initialize",
    }
  );

  await upgradeProxy(weaponAddress, Weapons, {
    deployer,
  });
  await upgradeProxy(characterAddress, Characters, {
    deployer,
  });
  await upgradeProxy(characterAddress, Characters, {
    deployer,
  });

  const wep = await Weapons.at(weaponAddress);
  const char = await Characters.at(characterAddress);

  await wep.migrate_blindBox(blindBox.address);
  await char.migrate_blindBox(blindBox.address);

  const game =  await CryptoWars.at(cryptoWarsAddress);
  game.setBlindBox(blindBox);
  const GAME_ADMIN = await blindBox.GAME_ADMIN()
  blindBox.grantRole(GAME_ADMIN, cryptoWarsAddress)
};
