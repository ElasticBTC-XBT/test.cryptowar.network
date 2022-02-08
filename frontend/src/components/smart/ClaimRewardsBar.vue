<template>
  <div class="body main-font">
    <div class="claim-reward-bar">
      <!-- <b-icon-exclamation-circle-fill class="rewards-claimable-icon" scale="1.2"
      variant="success" :hidden="!canClaimTokens && !canClaimXp" v-tooltip.bottom="'Rewards ready to claim!'"/> -->
      <b-modal id="claimRewardsSucessModal" hide-footer centered>
        <div class="claimRewardsSucessModal-head">CryptoWar Message</div>
        <div class="claimRewardsSucessModal-body">Claim Rewards sucess</div>
        <button
          class="mt-3 btn-buy btn-close-fight-results"
          block
          @click="$bvModal.hide('claimRewardsSucessModal')"
        >
          Close
        </button>
      </b-modal>
      <div :disabled="!canClaimTokens" @click="claimSkill(ClaimStage.Claim)">
        <b-button
          class="gtag-link-others btn-pink-bg btn-claim-reward"
          v-html="`Claim Rewards`"
          v-tooltip.bottom="
            'Tax is being reduced by 1% per day.' +
            getTaxTimerNextTick +
            '<br> Rewards: ' +
            formattedXBladeRewardNoTax +
            ' xBlade'
          "
        ></b-button>
      </div>

      <div @click="onClaimXp" :disabled="!canClaimXp">
        <b-button
          class="gtag-link-others btn-blue-bg btn-claim-xp"
          v-html="`Claim Heroes XP`"
          v-tooltip.bottom="formattedXpRewards"
        ></b-button>
      </div>
    </div>

    <b-modal
      class="centered-modal"
      ref="stake-suggestion-modal"
      title="Stake Skill"
      @ok="$router.push({ name: 'select-stake-type' })"
      ok-only
      ok-title="Go to Stake"
    >
      You can avoid paying the 15% tax by staking unclaimed skill rewards for 7
      days. If you stake your xBlade now, we'll give you a 50% bonus in-game
      only xBlade that you can use right away!
      <a href="#" @click="claimSkill(ClaimStage.Claim)">
        <br />No thanks, I'd rather
        {{
          this.rewardsClaimTaxAsFactorBN > 0
            ? 'pay ' + this.formattedTaxAmount + ' in taxes and '
            : ''
        }}forfeit my bonus
      </a>
    </b-modal>
    <b-modal
      class="centered-modal"
      ref="claim-confirmation-modal"
      title="Claim xBlade Rewards"
      size="lg"
      :ok-title="`OK, I'll claim`"
      @ok="onClaimTokens()"
    >
      <div>
        <div class="claim-xblade-reward-info">
          <div class="text-center" style="font-weight: bold">Hold Reminder</div>
          A percentage of your earning goes back to the community,
          <u>if you withdraw early</u>
          <div>
            Your early withdraw tax
            <span class="text-danger font-weight-bold"
              >{{ formattedRewardsClaimTax }}
            </span>
            . Reduces 1% per day. Reset to 15% after withdraw
          </div>
          <div>
            <div>
              Number of xBlade miss out:
              <span class="text-danger font-weight-bold">
                {{ formattedTaxAmount }}
              </span>
              xBlade tax
            </div>
            <div>
              Number of xBlade claim:
              <span class="text-danger font-weight-bold">
                {{ formattedXBladeRewardWithTax }}
              </span>
              xBlade
            </div>
          </div>
          <hr class="hr-divider" />
          <div class="claim-xblade-reward-reminder">
            {{
              this.rewardsClaimTaxAsFactorBN > 0
                ? 'You are about to pay ' +
                  formattedRewardsClaimTax +
                  ' tax for early withdrawal, costing you ' +
                  this.formattedTaxAmount +
                  ' xBlade'
                : ''
            }}
            <br />
            Are you sure you wish to continue?<br />
            <b>This action cannot be undone.</b>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script lang="ts">
import Vue from 'vue'
import { Accessors } from 'vue/types/options'
import { mapActions, mapGetters, mapState } from 'vuex'
import BigNumber from 'bignumber.js'
import { RequiredXp } from '../../interfaces'
import { ICharacter } from '@/interfaces'
import { toBN, fromWeiEther } from '../../utils/common'
import { secondsToDDHHMMSS } from '../../utils/date-time'
import { getCleanName } from '../../rename-censor'

interface StoreMappedState {
  skillRewards: string
  xpRewards: Record<string, string>
  ownedCharacterIds: string[]
  directStakeBonusPercent: number
}

interface StoreMappedGetters {
  ownCharacters: ICharacter[]
  currentCharacter: ICharacter | null
  maxRewardsClaimTaxAsFactorBN: BigNumber
  rewardsClaimTaxAsFactorBN: BigNumber
  getCharacterName(id: number): string
}

enum ClaimStage {
  WaxBridge = 0,
  Stake = 1,
  Claim = 2,
}

interface StoreMappedActions {
  claimTokenRewards(): Promise<void>
  claimXpRewards(): Promise<void>
}

export default Vue.extend({
  data() {
    return {
      ClaimStage,
    }
  },

  computed: {
    ...(mapState([
      'skillRewards',
      'xpRewards',
      'ownedCharacterIds',
      'directStakeBonusPercent',
    ]) as Accessors<StoreMappedState>),
    ...(mapGetters([
      'ownCharacters',
      'currentCharacter',
      'maxRewardsClaimTaxAsFactorBN',
      'rewardsClaimTaxAsFactorBN',
      'getCharacterName',
    ]) as Accessors<StoreMappedGetters>),

    formattedXBladeRewardNoTax(): string {
      const skillRewards = fromWeiEther(this.skillRewards)
      return `${toBN(skillRewards).toFixed(2)}`
    },

    formattedXBladeRewardWithTax(): string {
      const skillRewards = fromWeiEther(
        (
          parseFloat(this.skillRewards) -
          parseFloat(this.skillRewards) *
            parseFloat(String(this.rewardsClaimTaxAsFactorBN))
        ).toString()
      )
      return `${toBN(skillRewards).toFixed(2)}`
    },

    formattedTaxAmount(): string {
      const skillRewards = fromWeiEther(
        (
          parseFloat(this.skillRewards) *
          parseFloat(String(this.rewardsClaimTaxAsFactorBN))
        ).toString()
      )
      return `${toBN(skillRewards).toFixed(4)}`
    },

    formattedBonusLost(): string {
      const xBladeLost = fromWeiEther(
        (
          (parseFloat(this.skillRewards) * this.directStakeBonusPercent) /
          100
        ).toString()
      )
      return `${toBN(xBladeLost).toFixed(2)}`
    },

    formattedRewardsClaimTax(): string {
      const frac =
        this.skillRewards === '0'
          ? this.maxRewardsClaimTaxAsFactorBN
          : this.rewardsClaimTaxAsFactorBN

      return `${frac
        .multipliedBy(100)
        .decimalPlaces(0, BigNumber.ROUND_HALF_UP)}%`
    },

    getTaxTimerNextTick(): string {
      let frac: BigNumber

      // if has no skill rewards do not display timer next tick.
      if (this.skillRewards === '0') {
        return ''
      } else {
        frac = this.rewardsClaimTaxAsFactorBN
      }

      // get 2 decimal values
      const decVal = toBN(
        frac.multipliedBy(100).decimalPlaces(2).toString().split('.')[1]
      )
      // convert to seconds
      const toSec = decVal
        .dividedBy(100)
        .multipliedBy(24)
        .multipliedBy(60)
        .multipliedBy(60)
      // return message
      if (!toSec.toNumber()) {
        return ''
      }
      return ` Next -1% reduction happens in ${secondsToDDHHMMSS(
        toSec.toNumber()
      )}.`
    },

    xpRewardsForOwnedCharacters(): string[] {
      return this.ownedCharacterIds.map(
        (charaId) => this.xpRewards[charaId] || '0'
      )
    },

    formattedXpRewards(): string {
      return this.xpRewardsForOwnedCharacters
        .map((xp, i) => {
          const currentCharacter = this.currentCharacter || { id: null }
          if (!this.ownCharacters[i]) return `${xp}`
          return (
            `${
              ((this.ownCharacters[i].xp +
                this.xpRewards[this.ownCharacters[i].id]) as any) >
              RequiredXp(this.ownCharacters[i].level)
                ? ''
                : ''
            }` +
            `${this.getCleanCharacterName(this.ownCharacters[i].id)} ${xp}` +
            `${
              ((this.ownCharacters[i].xp +
                this.xpRewards[this.ownCharacters[i].id]) as any) >
              RequiredXp(this.ownCharacters[i].level)
                ? ''
                : ''
            }` +
            `${this.ownCharacters[i].id === currentCharacter.id ? '' : ''}`
          )
        })
        .join(', ')
    },

    canClaimTokens(): boolean {
      if (toBN(this.skillRewards).lte(0)) {
        return false
      }

      return true
    },

    canClaimXp(): boolean {
      const allXpsAreZeroOrLess = this.xpRewardsForOwnedCharacters.every((xp) =>
        toBN(xp).lte(0)
      )
      if (allXpsAreZeroOrLess) {
        return false
      }

      return true
    },
  },

  methods: {
    ...(mapActions([
      'addMoreSkill',
      'claimTokenRewards',
      'claimXpRewards',
    ]) as StoreMappedActions),

    async onClaimTokens() {
      if (this.canClaimTokens) {
        await this.claimTokenRewards()
        this.$bvModal.show('claimRewardsSucessModal')
      }
    },

    async onClaimXp() {
      if (this.canClaimXp) {
        await this.claimXpRewards()
      }
    },

    async claimSkill(stage: ClaimStage) {
      // if(stage === ClaimStage.Stake) {
      //   (this.$refs['stake-suggestion-modal'] as any).show();
      // }
      if (stage === ClaimStage.Claim) {
        ;(this.$refs['stake-suggestion-modal'] as any).hide()
        ;(this.$refs['claim-confirmation-modal'] as any).show()
      }
    },

    getCleanCharacterName(id: number): string {
      return getCleanName(this.getCharacterName(id))
    },
  },
})
</script>

<style scoped>
.claim-reward-bar {
  display: flex;
  margin-top: 20px;
  align-items: center;
}

.navbar-expand {
  flex-wrap: wrap;
}

.nav-item a {
  padding: 0;
  font-size: 1rem;
}

.rewards-claimable-icon {
  margin-right: 5px;
  align-self: center;
}
.tax-timer {
  color: #fff;
}

.claim-reward-modal {
  max-width: 800px;
  background: khaki;
}
.claim-reward-text {
  color: #fff;
}

.btn-claim-xp,
.btn-claim-reward {
  font-size: 0.8rem;
}

.claim-xblade-reward-info {
  margin: 0 auto;
  width: 80%;
}

.claim-xblade-reward-reminder {
  text-align: center;
}

.claimRewardsSucessModal-head {
  font-size: 1.8em;
  font-weight: 600;
  color: #f58b5b;
  text-align: center;
}

.claimRewardsSucessModal-body {
  text-align: center;
  margin: 20px 0;
  font-size: 1.3em;
  color: #fff;
}

#claimRewardsSucessModal button {
  border-radius: 0;
  border: none;
  background-image: url(../../assets/v2/btn-fight.png);
  width: 130px;
  height: 42px;
  background-size: contain;
  background-repeat: no-repeat;
  background-color: transparent;
  margin: 0 auto;
  display: block;
  margin-bottom: 20px;
  position: relative;
  z-index: 3;
}

@media (max-width: 576px) {
  .claim-reward-bar {
    flex-direction: column;
    text-align: center;
    padding: 0 8px;
  }
  .navbar-expand {
    justify-content: center;
    text-align: center;
  }

  .btn-claim-xp,
  .btn-claim-reward {
    margin-top: 8px;
  }

  .btn-claim-reward {
    background-size: 210px 50px;
  }

  .claim-xblade-reward-info {
    width: 100%;
  }

  .claimRewardsSucessModal-head {
    font-size: 1.5em;
  }

  .claimRewardsSucessModal-body {
    font-size: 1.2em;
    margin: 5px 0;
  }
}
</style>
