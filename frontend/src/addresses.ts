const ADDITION_NETWORK = {
  VUE_APP_STAKING_ONLY:"0",
  VUE_APP_FEATURE_FLAG_RAID:"0",
  VUE_APP_FEATURE_FLAG_REFORGING:"1",
  VUE_APP_FEATURE_FLAG_MARKET:"1",
  VUE_APP_FEATURE_FLAG_MARKET_USE_BLOCKCHAIN:"0",
  VUE_APP_FEATURE_FLAG_PORTAL:"1",
};
const BSC_MAINNET = {
  ...ADDITION_NETWORK,

  VUE_APP_API_URL:"https://xblades.herokuapp.com/",
  VUE_APP_EXCHANGE_URL:"https://pancakeswap.finance/swap?outputCurrency=0x27a339d9B59b21390d7209b78a839868E319301B",
  VUE_APP_GAME_SECRET:"",

  VUE_APP_NETWORK_ID:"56",
  VUE_APP_EXPECTED_NETWORK_ID:"56",
  VUE_APP_EXPECTED_NETWORK_NAME:"Binance Smart Chain",

  VUE_APP_STAKE_TYPE_FOR_UNCLAIMED_REWARDS:"xBlade",
  VUE_APP_XBLADE_TOKEN_CONTRACT_ADDRESS:"0x27a339d9b59b21390d7209b78a839868e319301b",
  VUE_APP_SKILL2_TOKEN_CONTRACT_ADDRESS:"",
  VUE_APP_LP_TOKEN_CONTRACT_ADDRESS:"",
  VUE_APP_LP_2_TOKEN_CONTRACT_ADDRESS:"",
  VUE_APP_SKILL_STAKING_REWARDS_CONTRACT_ADDRESS:"",
  VUE_APP_SKILL2_STAKING_REWARDS_CONTRACT_ADDRESS:"",
  VUE_APP_LP_STAKING_REWARDS_CONTRACT_ADDRESS:"",
  VUE_APP_LP_2_STAKING_REWARDS_CONTRACT_ADDRESS:"",
  VUE_APP_STAKE_TYPES_AVAILABLE:"lp",
  VUE_APP_CRYPTOWARS_CONTRACT_ADDRESS:"0x8BA9f0841cFA75d7e2c7a316b048b04c98C95cA4",
  VUE_APP_RAID_CONTRACT_ADDRESS:"",
  VUE_APP_MARKET_CONTRACT_ADDRESS:"0x8ff772c006269262b6b38602E2882f7D0C6C3393",
  VUE_APP_WAX_BRIDGE_CONTRACT_ADDRESS:"",

  VUE_APP_SECRET_BOX_ADDRESS:"0xFc658Da47B952223Fbf2AB0a00dCc609d07a2E32",
  VUE_APP_CW_CONTROLLER_ADDRESS:"0xAadfa537ecA54d3d7655C4117bBFB83B9bF6035a",
  VUE_APP_CAREER_MODE_ADDRESS:"0x72E9A1be11609Ba5d03ae153f5e0d2F1064C169E",
  VUE_APP_BLIND_BOX:"0x707Ea5fC3Fc92c3B802Ecb9E1428E6F4FF03282f",
};
const BSC_TESTNET = {
  ...ADDITION_NETWORK,

  VUE_APP_API_URL:"https://xblades.herokuapp.com/",
  VUE_APP_EXCHANGE_URL:"https://pancake.kiemtienonline360.com/#/swap?outputCurrency=0x28ad774C41c229D48a441B280cBf7b5c5F1FED2B",
  VUE_APP_GAME_SECRET:"",

  VUE_APP_NETWORK_ID:"97",
  VUE_APP_EXPECTED_NETWORK_ID:"97",
  VUE_APP_EXPECTED_NETWORK_NAME:"Binance Smart Chain Testnet",

  VUE_APP_STAKE_TYPE_FOR_UNCLAIMED_REWARDS:"xBlade",
  VUE_APP_XBLADE_TOKEN_CONTRACT_ADDRESS:"0x28ad774C41c229D48a441B280cBf7b5c5F1FED2B",
  VUE_APP_SKILL2_TOKEN_CONTRACT_ADDRESS:"",
  VUE_APP_LP_TOKEN_CONTRACT_ADDRESS:"0x90a1d4073772488ac3a19079cafa3bb9ed5045fe",
  VUE_APP_LP_2_TOKEN_CONTRACT_ADDRESS:"",
  VUE_APP_SKILL_STAKING_REWARDS_CONTRACT_ADDRESS:"0xBfcbb9E67cF7bCc071F4a27F6bBc507cAb711716",
  VUE_APP_SKILL2_STAKING_REWARDS_CONTRACT_ADDRESS:"",
  VUE_APP_LP_STAKING_REWARDS_CONTRACT_ADDRESS:"0xE5A6d7458ef7A695e3Fe9dA32d3FC258264a3cE7",
  VUE_APP_LP_2_STAKING_REWARDS_CONTRACT_ADDRESS:"0xE1ec8e608238b0767997c3CbC0642580CA795460",
  VUE_APP_STAKE_TYPES_AVAILABLE:"lp",
  VUE_APP_CRYPTOWARS_CONTRACT_ADDRESS:"0xc3bA116D38cCAc8f9ccb18f20E24fCd3DE2F3eA0",
  VUE_APP_RAID_CONTRACT_ADDRESS:"0x18029D932b4A3B6618e8d770f7Fd678dEb12Eb3B",
  VUE_APP_MARKET_CONTRACT_ADDRESS:"0x313d75c74eE6003018CD106F59e9Ba903aA1fc46",
  VUE_APP_WAX_BRIDGE_CONTRACT_ADDRESS:"0xD55A04fF8d04c89e0078Dd42B076Ab23C09E096c",

  VUE_APP_SECRET_BOX_ADDRESS:"0x9A8313127eab2DC37d8dD58A5E8ff144215A2eFA",
  VUE_APP_CAREER_MODE_ADDRESS:"0x4CC5739daEfA1ecfe0F827166C628196057377c6",
  VUE_APP_CW_CONTROLLER_ADDRESS:"0x7c1413dBb716957f30BE02efebb8825F344bf0Be",
  VUE_APP_BLIND_BOX:"0x3c7CABcD507b45B9c447357F1e161F80e5e89056",
};

import Web3 from 'web3';
const web3 = new Web3(Web3.givenProvider || process.env.VUE_APP_WEB3_FALLBACK_PROVIDER);

export const getAddressesAuto = async () => {
  const currentID = await web3.eth.net.getId();
  if(currentID === parseInt(BSC_MAINNET.VUE_APP_NETWORK_ID, 10)) return BSC_MAINNET;
  if(currentID === parseInt(BSC_TESTNET.VUE_APP_NETWORK_ID, 10)) return BSC_TESTNET;
  return BSC_MAINNET;
};

export const getAddresses = (currentID: number) => {
  if(currentID === parseInt(BSC_MAINNET.VUE_APP_NETWORK_ID, 10)) return BSC_MAINNET;
  if(currentID === parseInt(BSC_TESTNET.VUE_APP_NETWORK_ID, 10)) return BSC_TESTNET;
  return BSC_MAINNET;
};