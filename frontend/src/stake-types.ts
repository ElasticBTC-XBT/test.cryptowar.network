import { allStakeTypes, isStakeType, StakeType } from './interfaces'
import { getAddressesAuto } from './addresses'

export interface StakingContractEntry {
  stakingRewardsAddress: string
  stakingTokenAddress: string
}

export const stakingContractsInfo = (async () => {
  const expectedNetwork = await getAddressesAuto()

  let availableStakingContracts = allStakeTypes

  if (expectedNetwork.VUE_APP_STAKE_TYPES_AVAILABLE) {
    availableStakingContracts =
      expectedNetwork.VUE_APP_STAKE_TYPES_AVAILABLE.split(',').filter(
        isStakeType
      )
  }

  const temp: Partial<Record<StakeType, Partial<StakingContractEntry>>> = {}

  if (availableStakingContracts.includes('lp')) {
    temp.lp = {
      stakingRewardsAddress:
        expectedNetwork.VUE_APP_LP_STAKING_REWARDS_CONTRACT_ADDRESS,
      stakingTokenAddress: expectedNetwork.VUE_APP_LP_TOKEN_CONTRACT_ADDRESS,
    }
  }

  if (availableStakingContracts.includes('lp2')) {
    temp.lp2 = {
      stakingRewardsAddress:
        expectedNetwork.VUE_APP_LP_2_STAKING_REWARDS_CONTRACT_ADDRESS,
      stakingTokenAddress: expectedNetwork.VUE_APP_LP_2_TOKEN_CONTRACT_ADDRESS,
    }
  }

  return temp
})()

interface HumanReadableDetailsForStakeType {
  stakeTokenName: string
  rewardTokenName: string
  stakeTitle: string
  deprecated?: boolean
}

const defaultHumanReadableDetailsForStakeTypes: Record<
  StakeType,
  HumanReadableDetailsForStakeType
> = {
  lp: {
    stakeTokenName: 'xBlade-WBNB',
    rewardTokenName: 'xBlade',
    stakeTitle: 'xBlade-WBNB for xBlade',
  },
  lp2: {
    stakeTokenName: 'xBlade-BNB',
    rewardTokenName: 'xBlade',
    stakeTitle: 'xBlade-BNB for xBlade V2',
  },
}

export const humanReadableDetailsForStakeTypes =
  defaultHumanReadableDetailsForStakeTypes

export const stakeTypeThatCanHaveUnclaimedRewardsStakedTo = (async () => {
  const expectedNetwork = await getAddressesAuto()
  const stakeTypeForUnclaimedRewards =
    expectedNetwork.VUE_APP_STAKE_TYPE_FOR_UNCLAIMED_REWARDS
  const temp: StakeType =
    stakeTypeForUnclaimedRewards && isStakeType(stakeTypeForUnclaimedRewards)
      ? stakeTypeForUnclaimedRewards
      : 'lp'
  return temp
})()
