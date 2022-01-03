const { upgradeProxy } = require("@openzeppelin/truffle-upgrades");

const CareerMode = artifacts.require("CareerMode");

module.exports = async function (deployer, network) {
  let careerModeProxy;
  if (network === "bsctestnet") {
    careerModeProxy = "0x53506EA96542a5A58dfe5B017ec5F5fc26ca29dF";
  }

  if (network === "bscmainnet") {
    careerModeProxy = "";
  }
  await upgradeProxy(careerModeProxy, CareerMode, {
    deployer,
  });
};
