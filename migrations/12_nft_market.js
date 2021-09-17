const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const xBlade = artifacts.require("xBlade");
const CryptoWars = artifacts.require("CryptoWars");
const NFTMarket = artifacts.require("NFTMarket");
const Characters = artifacts.require("Characters");
const Weapons = artifacts.require("Weapons");

module.exports = async function (deployer, network) {
  let xBladeAddress;
  if (network === 'bscmainnet' || network === 'bscmainnet-fork') {
    xBladeAddress = '0x154a9f9cbd3449ad22fdae23044319d6ef2a1fab';
  }
  else {
    xBladeAddress = "0x28ad774C41c229D48a441B280cBf7b5c5F1FED2B";
  }

  const market = await deployProxy(NFTMarket, [xBladeAddress, CryptoWars.address], { deployer });
  await market.migrateTo_a98a9ac(Characters.address, Weapons.address);
};
