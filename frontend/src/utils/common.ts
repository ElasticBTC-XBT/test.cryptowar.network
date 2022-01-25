import axios from 'axios';
import BigNumber from 'bignumber.js';
import Web3 from 'web3';
import { getAddressesAuto } from "../addresses";

BigNumber.config({ ROUNDING_MODE: BigNumber.ROUND_DOWN });
BigNumber.config({ EXPONENTIAL_AT: 100 });

export const apiUrl = async (url: string) => {
  const expectedNetwork = await getAddressesAuto();
  return `${expectedNetwork.VUE_APP_API_URL || 'https://xblades.herokuapp.com/'}/${url}`;
};
export const defaultOptions = (async () => {
  const expectedNetwork = await getAddressesAuto();
  return {
    headers :{
      authorization: `Secret ${expectedNetwork.VUE_APP_GAME_SECRET}`
    }
  };
})();
export const getCurrentGasPrices = async () => {
  const response = await axios.get('https://www.gasnow.org/api/v3/gas/price');
  return {
    low: response.data.data.slow / 1e9,
    medium: response.data.data.standard / 1e9,
    high: response.data.data.fast / 1e9
  };
};

export const toBN = (value: string|number): BigNumber => {
  const valueString = typeof value === 'string' ? value : String(value);

  return new BigNumber(valueString);
};

export const bnMinimum = (...values: string[]): BigNumber => {
  return BigNumber.minimum(...values);
};

export const fromWeiEther = (value: string|BigNumber): string => {
  return new BigNumber(value).div('1000000000000000000').toFixed();
};

export const gasUsedToBnb = (gasUsed: number, gasPrice: string): string => {
  const gasCost = gasUsed * Number(gasPrice);

  const bnbGasCost =  Web3.utils.fromWei(gasCost.toString()).toString();

  return  bnbGasCost;
};
