const Reseller = artifacts.require("Reseller");

module.exports = async function (deployer, network, accounts) {
  const xBladeAddress = "0x28ad774C41c229D48a441B280cBf7b5c5F1FED2B";
  const foundationAddress = "0x2CC6D07871A1c0655d6A7c9b0Ad24bED8f940517";
  const pancakeRouterAddress = "0xd99d1c33f9fc3444f8101754abc46c52416550d1";

  await deployer.deploy(
    Reseller,
    xBladeAddress,
    pancakeRouterAddress,
    foundationAddress
  );
};
