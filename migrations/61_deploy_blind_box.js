const { deployProxy, upgradeProxy } = require("@openzeppelin/truffle-upgrades");

const BlindBox = artifacts.require("BlindBox");
const Characters = artifacts.require("Characters");
const Weapons = artifacts.require("Weapons");

module.exports = async function (deployer, network, accounts) {
  let weaponAddress, characterAddress, blindBox;
  if (network === "bsctestnet") {
    characterAddress = "0x89f874F2e809974e49220B077B0e256bFDdae4f7";
    weaponAddress = "0xFCf01FA5B11bf8506f4E674e747403c3D7fdC70B";
  }
  if (network === "bscmainnet") {
    characterAddress = "0xc38470bfe1b08c3bafdaf699eba2fca1fd2b040b";
    weaponAddress = "0x52683412f6ea2b6302cea8406eff928510466c2c";
  }
  blindBox = await deployProxy(BlindBox, [], {
    deployer,
  });

  await upgradeProxy(weaponAddress, Weapons, {
    deployer,
  });
  await upgradeProxy(characterAddress, Characters, {
    deployer,
  });
  const wep = await Weapons.at(weaponAddress);
  const char = await Characters.at(characterAddress);

  await wep.migrate_blindBox(blindBox.address);
  await char.migrate_blindBox(blindBox.address);
};
