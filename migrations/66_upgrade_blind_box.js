const { upgradeProxy } = require("@openzeppelin/truffle-upgrades");

const BlindBox = artifacts.require("BlindBox");

module.exports = async function (deployer, network, accounts) {
  let blindBoxAddress;
  if (network === "bsctestnet") {
    blindBoxAddress = "0xEfC8E6EDfeD04fFE7B32a3962BB821f7073e03b3";
  }
  if (network === "bscmainnet") {
    blindBoxAddress = "0x707Ea5fC3Fc92c3B802Ecb9E1428E6F4FF03282f";
  }
  blindBox = await upgradeProxy(blindBoxAddress, BlindBox, {
    deployer,
  });
  // blindBox = await BlindBox.at(blindBoxAddress);
  await blindBox.setBoxesPrice(7, "100000000000000000000");
};
