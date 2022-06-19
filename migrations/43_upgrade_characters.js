const Characters = artifacts.require("Characters");
const { upgradeProxy } = require("@openzeppelin/truffle-upgrades");

module.exports = async function (deployer, network) {
  let proxyAddress;
  if (network === "bsctestnet") {
    proxyAddress = "0x89f874F2e809974e49220B077B0e256bFDdae4f7";
  }
  if (network === "bscmainnet") {
    proxyAddress = "0xC38470BFE1b08c3baFDaf699eBa2fCA1fd2B040B";
  }
  if (network === "thundercore") {
    proxyAddress = "0x4757B3E97da147cAfA7267e07eA8FAF1258Bafaa";
  }

  await upgradeProxy(proxyAddress, Characters, {
    deployer,
  });
};
