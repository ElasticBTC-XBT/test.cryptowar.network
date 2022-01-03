const { deployProxy } = require('@openzeppelin/truffle-upgrades');

const xBlade = artifacts.require("xBlade");
const CryptoWars = artifacts.require("CryptoWars");
const NFTMarket = artifacts.require("NFTMarket");
const Characters = artifacts.require("Characters");
const Weapons = artifacts.require("Weapons");


module.exports = async function (deployer, network) {


  console.log(`Characters ${Characters.address}`)
  console.log(`Weapons ${Weapons.address}`)
  console.log(`CryptoWars ${CryptoWars.address}`)
  let xBladeAddress;
  if (network === 'bscmainnet' || network === 'bscmainnet-fork') {
    xBladeAddress = '0x27a339d9B59b21390d7209b78a839868E319301B';
  }
  else {
    xBladeAddress = "0x27a339d9B59b21390d7209b78a839868E319301B";
  }

  const market = await deployProxy(NFTMarket, [xBladeAddress, CryptoWars.address], { deployer });
  await market.migrateTo_a98a9ac(Characters.address, Weapons.address);
};
