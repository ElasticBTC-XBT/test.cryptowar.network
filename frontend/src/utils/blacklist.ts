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

export function calculateFightTax(
  baseTax: string,
  isBlackList: boolean
): string {
  // const isLucky = random() % 100 < 33
  // const weight = isBlackList && !isLucky ? '1.8' : '1.5'
  // return toBN(baseTax).multipliedBy(toBN(weight)).toString()
  const isLucky = random(0, 100) % 100 < 33
  const weight = isBlackList && !isLucky ? '1.9' : '1.7'
  const fightTax = parseInt((Number(baseTax) * 369 * 1.5).toString(), 10)
  return toBN(fightTax).multipliedBy(toBN(weight)).toFixed(0).toString()
}
export default isBlacklist
