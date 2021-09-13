const xBlade = artifacts.require("xBlade");
const { deployProxy } = require("@openzeppelin/truffle-upgrades");

module.exports = async function (deployer) {
  const owner = "0x2CC6D07871A1c0655d6A7c9b0Ad24bED8f940517";
  await deployProxy(xBlade, [owner], {
    deployer,
    unsafeAllow: ["external-library-linking"],
    initializer: "initialize",
  });
};