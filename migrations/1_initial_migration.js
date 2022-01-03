const xBlade = artifacts.require("xBlade");
const { deployProxy } = require("@openzeppelin/truffle-upgrades");

module.exports = async function (deployer) {
  const owner = "0x5678917FfEb77827Aafc33419E99DaCd707313a9";
  await deployProxy(xBlade, [owner], {
    deployer,
    unsafeAllow: ["external-library-linking"],
    initializer: "initialize",
  });
};