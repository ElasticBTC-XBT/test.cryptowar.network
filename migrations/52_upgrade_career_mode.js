const { upgradeProxy } = require("@openzeppelin/truffle-upgrades");

const CareerMode = artifacts.require("CareerMode");

module.exports = async function (deployer, network, accounts) {
  let weaponAddress, characterAddress, randomAddress, xBladeAddress;
  if (network === "bsctestnet") {
    weaponAddress = "0x2cb15b0a2bd10beaad6105e0b7219d6edc8288a1";
    characterAddress = "0x169e12572b318984f0e6ba89230ad2060f7dbb24";
    randomAddress = "0xc4311c213ae05765e167118a7ee0ab1bff1da2e1";
    xBladeAddress = "0x28ad774c41c229d48a441b280cbf7b5c5f1fed2b";
  }

  if (network === "bscmainnet") {
    weaponAddress = "";
    characterAddress = "";
    randomAddress = "";
    xBladeAddress = "";
  }
  await upgradeProxy(
    // "0x2cc0edf838aA1Ff151eC0423eA0d2D7D1B4ad688",
    CareerMode,
    [xBladeAddress, characterAddress, weaponAddress, randomAddress],
    {
      deployer,
    }
  );
};
