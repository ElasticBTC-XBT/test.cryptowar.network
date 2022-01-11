const { deployProxy } = require("@openzeppelin/truffle-upgrades");

const CareerMode = artifacts.require("CareerMode");
const Weapons = artifacts.require("Weapons");
const Characters = artifacts.require("Characters");

module.exports = async function (deployer, network, accounts) {
  let weaponAddress, characterAddress, randomAddress, xBladeAddress;

  if (network === "bsctestnet") {
    weaponAddress = "0xfcf01fa5b11bf8506f4e674e747403c3d7fdc70b";
    characterAddress = "0x89f874f2e809974e49220b077b0e256bfddae4f7";
    randomAddress = "0xc4311c213ae05765e167118a7ee0ab1bff1da2e1";
    xBladeAddress = "0x28ad774c41c229d48a441b280cbf7b5c5f1fed2b";
  }

  if (network === "bscmainnet") {
    weaponAddress = "0x52683412f6ea2b6302cea8406eff928510466c2c";
    characterAddress = "0xc38470bfe1b08c3bafdaf699eba2fca1fd2b040b";
    randomAddress = "0x0fc17db390c955e0258871e3e7c46cec3c552a9a";
    xBladeAddress = "0x27a339d9b59b21390d7209b78a839868e319301b";
  }
  const careerMode = await deployProxy(
    CareerMode,
    [xBladeAddress, characterAddress, weaponAddress, randomAddress],
    {
      deployer,
    }
  );

  const weapons = await Weapons.at(weaponAddress);
  const weapons_GAME_ADMIN = await weapons.GAME_ADMIN();
  weapons.grantRole(weapons_GAME_ADMIN, careerMode.address);

  const characters = await Characters.at(characterAddress);
  const characters_GAME_ADMIN = await characters.GAME_ADMIN();
  const characters_NO_OWNED_LIMIT = await characters.NO_OWNED_LIMIT();
  characters.grantRole(characters_GAME_ADMIN, careerMode.address);
  characters.grantRole(characters_NO_OWNED_LIMIT, careerMode.address);
};
