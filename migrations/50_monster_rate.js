const CWController = artifacts.require("CWController");
const { upgradeProxy } = require("@openzeppelin/truffle-upgrades");

module.exports = async function (deployer, network) {
  let proxyAddress = "";
  if (network === "bsctestnet") {
    proxyAddress = "0x169e12572b318984f0e6ba89230ad2060f7dbb24";
  }
  if (network === "bscmainnet") {
    proxyAddress = "0xC38470BFE1b08c3baFDaf699eBa2fCA1fd2B040B"; //mainnet
  }

  await upgradeProxy(proxyAddress, CWController, {
    deployer,
  });
  const cwController = await CWController.at(proxyAddress);
  cwController.setMaxFactor(4000); // Power 4000
};
