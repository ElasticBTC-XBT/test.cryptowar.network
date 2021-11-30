const { deployProxy, upgradeProxy } = require("@openzeppelin/truffle-upgrades");

const BlindBox = artifacts.require("BlindBox");
const Characters = artifacts.require("Characters");
const Weapons = artifacts.require("Weapons");

module.exports = async function (deployer, network, accounts) {
  let weaponAddress, characterAddress, blindBox;
  if (network === "bsctestnet") {
    characterAddress = "0x169e12572b318984f0e6ba89230ad2060f7dbb24";
    weaponAddress = "0x2cb15b0a2bd10beaad6105e0b7219d6edc8288a1";
    blindBox = await deployProxy(BlindBox, [], {
      deployer,
    });
  }
  if (network === "bscmainnet") {
    const proxyAddress = "0xFc658Da47B952223Fbf2AB0a00dCc609d07a2E32";
    await deployProxy(proxyAddress, SecretBox, {
      deployer,
    });
  }

  await upgradeProxy(characterAddress, Characters, {
    deployer,
  });
  await upgradeProxy(weaponAddress, Weapons, {
    deployer,
  });

  const wep = await Weapons.at(weaponAddress);
  const char = await Characters.at(characterAddress);
  await wep.migrate_blindBox(blindBox.address);
  await char.migrate_blindBox(blindBox.address);
};
