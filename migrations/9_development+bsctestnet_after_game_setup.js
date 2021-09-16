const xBlade = artifacts.require("xBlade");
const CryptoWars = artifacts.require("CryptoWars");
const BasicPriceOracle = artifacts.require("BasicPriceOracle");

module.exports = async function (deployer, network) {
  // if (network === 'development' || network === 'development-fork' || network === 'bsctestnet' || network === 'bsctestnet-fork') {
  //   const token = await xBlade.deployed();
  //   const game = await CryptoWars.deployed();
  //   await token.transferFrom(token.address, game.address, web3.utils.toWei('0.5', 'mether')); // megaether

  //   const priceOracle = await BasicPriceOracle.deployed();
  //   await priceOracle.setCurrentPrice(web3.utils.toWei('0.2', 'ether')); // 1/5 SKILL per USD, AKA 5 USD per SKILL
  //   // Testnet wallet to test
  //   await token.transferFrom(token.address, '0x0EaEA9558eFF1d4b76b347A39f54d8CDf01F990F', web3.utils.toWei('100', 'kether')); // Account 1
  //   await token.transferFrom(token.address, '0x33EDbEc831AD335f26fFC06EB07311cC99F50084', web3.utils.toWei('100', 'kether')); // Account 3
  // }
};
