import { random } from 'lodash'
import { toBN } from './common'

function isBlacklist(address: string): boolean {
  if (!address) {
    return false
  }
  const blacklist = [
    '0xd2bd7dba',
    '0x384223e5',
    '0x61c8b5b1',
    '0xd57d22c6',
    '0xeC0B72fF',
    '0xE3567add',
    '0x9fdaa80b',
    '0xb9063c17',
  ]
  return blacklist.includes(address.slice(0, 10))
}

export async function calculateFightTax(
  isBlackList: boolean,
  levelHero: number,
  taxByLevelHero: number
) {
  const resultApiBnbPrice: any = await fetch(
    'https://api.coingecko.com/api/v3/simple/price?ids=binancecoin&vs_currencies=usd'
  )
    .then((response) => response.json())
    .then((data) => {
      if (!data.binancecoin.usd) {
        return 0
      }
      return Number(data.binancecoin.usd).toFixed(0)
    })
  const isLucky = random(0, 100) % 100 < 33
  const weight = isBlackList && !isLucky ? random(17, 19) / 10 : '1.5'
  const baseBNBPrice = 369
  const fightGas = 0.0014
  const fightTaxBase = 0.00035

  function getTax(level, marketPrice) {
    const bnbTax = fightGas + fightTaxBase * (1 + (level * 3) / 100)
    const change = marketPrice / baseBNBPrice
    return bnbTax / change
  }

  function getTaxNeedToSend(level, marketPrice) {
    return (
      Number(
        toBN(getTax(level, marketPrice) * 10 ** 18).multipliedBy(toBN(weight))
      ) -
      fightGas * 10 ** 18
    )
  }
  const fightTaxNeedToSend = Math.max(
    Number(getTaxNeedToSend(levelHero, resultApiBnbPrice).toFixed(0)),
    taxByLevelHero
  )

  return fightTaxNeedToSend.toString()
}
export default isBlacklist
