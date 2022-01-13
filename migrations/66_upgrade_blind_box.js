const { upgradeProxy } = require("@openzeppelin/truffle-upgrades");

const BlindBox = artifacts.require("BlindBox");

module.exports = async function (deployer, network, accounts) {
  let blindBoxAddress;
  if (network === "bsctestnet") {
    blindBoxAddress = "0xEfC8E6EDfeD04fFE7B32a3962BB821f7073e03b3";
  }
  if (network === "bscmainnet") {
    blindBoxAddress = "";
  }
  blindBox = await upgradeProxy(blindBoxAddress, BlindBox, {
    deployer,
  });
};
