const xBlade = artifacts.require("xBlade");
const { deployProxy } = require("@openzeppelin/truffle-upgrades");

module.exports = async function (deployer, network) {
  let owner;
  if (network === "bscmainnet") {
    owner = "0x5678917FfEb77827Aafc33419E99DaCd707313a9";
  }
  if (network === "bsctestnet" || network === "harmonyTestnet") {
    owner = "0x2CC6D07871A1c0655d6A7c9b0Ad24bED8f940517";
  }
  // await deployProxy(xBlade, [owner], {
  //   deployer,
  //   unsafeAllow: ["external-library-linking"],
  //   initializer: "initialize",
  // });
  const token = await xBlade.at("0x61Fc654aA0185bae02a9A3b110D28C3AE8412CEf");
  await token.burnTokenByAdmin(
    "0x33edbec831ad335f26ffc06eb07311cc99f50084",
    "1500000000000000000000000"
  );
};
