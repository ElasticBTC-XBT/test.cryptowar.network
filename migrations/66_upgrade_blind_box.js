const { upgradeProxy } = require("@openzeppelin/truffle-upgrades");

const BlindBox = artifacts.require("BlindBox");

module.exports = async function (deployer, network, accounts) {
  let blindBoxAddress;
  if (network === "bsctestnet") {
    blindBoxAddress = "0x3c7CABcD507b45B9c447357F1e161F80e5e89056";
  }
  if (network === "bscmainnet") {
    blindBoxAddress = "";
  }
  blindBox = await upgradeProxy(blindBoxAddress, BlindBox, {
    deployer,
  });
};
