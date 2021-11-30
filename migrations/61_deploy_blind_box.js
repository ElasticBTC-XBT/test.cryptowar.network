const { deployProxy, upgradeProxy } = require("@openzeppelin/truffle-upgrades");

const BlindBox = artifacts.require("BlindBox");
const Characters = artifacts.require("Characters");
const Weapons = artifacts.require("Weapons");

module.exports = async function (deployer, network, accounts) {
  let weaponAddress, characterAddress, blindBox;
  if (network === "bsctestnet") {
    characterAddress = "0x169e12572b318984f0e6ba89230ad2060f7dbb24";
    weaponAddress = "0x2cb15b0a2bd10beaad6105e0b7219d6edc8288a1";
  }
  if (network === "bscmainnet") {
    characterAddress = "0x169e12572b318984f0e6ba89230ad2060f7dbb24";
    weaponAddress = "0x2cb15b0a2bd10beaad6105e0b7219d6edc8288a1";
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
