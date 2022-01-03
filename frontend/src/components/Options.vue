<template>
  <div class="body main-font">
    <div class="option-container">
        <div class="option-container-head">
          <div @click="hideOption()" class="icon-close"><i class="fas fa-times"></i></div>
          <div class="title">MENU</div>
        </div>
        <div class="option-container-body">
          <view-links class="view-links"></view-links>
          <skill-balance-display class="skill-display-mobile" />
        </div>
        <div class="option-container-footer">
          <div>Links</div>
          <div class="link">
            <div>
              <a href="https://www.cryptowar.network/" target="_blank">HomePage</a>
              <a href="https://wiki.cryptowar.network/" target="_blank">Wiki</a>
              <div @click="$router.push('options'), hideOption()">Options</div>
              <!-- <a href="https://wiki.cryptowar.network/backers-and-partners" target="_blank">Partners</a> -->
            </div>
            <div>
              <a href="https://discord.gg/MQBWnE8t2G" target="_blank">Discord</a>
              <a href="https://t.me/elasticbitcoinxbt" target="_blank">Telegram</a>
              <a href="https://twitter.com/xbladecryptowar" target="_blank">Twitter</a>
            </div>
          </div>
        </div>
    </div>
    <b-navbar-nav class="navbar-nav">
      <b-nav-item-dropdown right>
        <template #button-content>
          <i class="fa fa-bars"></i>
        </template>

        <b-dropdown-group>

        <b-dropdown-header>Links</b-dropdown-header>



        <!-- <b-dropdown-item @click.native="$router.push('leaderboard')" class="gtag-link-others" tagname="leaderboard_screen">
        <i class="fa fa-trophy mr-2"></i>Leaderboard
        </b-dropdown-item> -->

        <b-dropdown-item href="https://www.cryptowar.network/" target="_blank"><i class="fa fa-book mr-2"></i>HomePage</b-dropdown-item>
        <b-dropdown-item href="https://wiki.cryptowar.network/" target="_blank"><i class="fa fa-book mr-2"></i>Wiki <b-icon scale="0.8" icon="question-circle"/></b-dropdown-item>
        <b-dropdown-item href="https://wiki.cryptowar.network/backers-and-partners" target="_blank"><i class="fa fa-book mr-2"></i>Partners</b-dropdown-item>
        <b-dropdown-item href="https://discord.gg/MQBWnE8t2G" target="_blank"><i class="fa fa-book mr-2"></i>Discord</b-dropdown-item>
        <b-dropdown-item href="https://t.me/elasticbitcoinxbt" target="_blank"><i class="fa fa-book mr-2"></i>Telegram</b-dropdown-item>
        <b-dropdown-item href="https://twitter.com/xbladecryptowar" target="_blank"><i class="fa fa-book mr-2"></i>Twitter</b-dropdown-item>

        </b-dropdown-group>
        <hr class="border-light">

        <b-dropdown-group class="mb-2">
          <b-dropdown-item  @click.native="$router.push('options')">
        <i class="fa fa-cog mr-2"></i>Options
        </b-dropdown-item>
        </b-dropdown-group>
      </b-nav-item-dropdown>
    </b-navbar-nav>

    <b-modal class="centered-modal" ref="stake-suggestion-modal" title="Stake Skill"
      @ok="$router.push({ name: 'select-stake-type' })" ok-only ok-title="Go to Stake" >
        You can avoid paying the 15% tax by staking unclaimed skill rewards for 7 days. If you stake your xBlade now, we'll give you a
        50% bonus in-game only xBlade that you can use right away!
      <a href="#" @click="claimSkill(ClaimStage.Claim)"> <br>No thanks, I'd rather {{ (this.rewardsClaimTaxAsFactorBN > 0)?"pay " +
        this.formattedTaxAmount + " in taxes and " : ""  }}forfeit my bonus </a>
    </b-modal>
    <b-modal class="centered-modal" ref="claim-confirmation-modal" title="Claim Skill" ok-title="I am sure"
      @ok="onClaimTokens()"> You are about to {{ (this.rewardsClaimTaxAsFactorBN > 0)?"pay " + formattedRewardsClaimTax +
      " tax for early withdrawal, costing you " + this.formattedTaxAmount + " xBlade. You will also " : "" }}
      miss out on {{formattedBonusLost}} bonus xBlade. Are you sure
      you wish to continue? <b>This action cannot be undone.</b>
    </b-modal>
  </div>
</template>

<script lang="ts">
import Events from '../events';
import { mapActions, mapGetters, mapState } from 'vuex';
import BigNumber from 'bignumber.js';
import { Accessors } from 'vue/types/options';
import Vue from 'vue';
import { toBN, fromWeiEther } from '../utils/common';
import ViewLinks from "./ViewLinks.vue";
import SkillBalanceDisplay from "./smart/SkillBalanceDisplay.vue";

interface StoreMappedState {
  skillRewards: string;
  directStakeBonusPercent: number;
}

interface StoreMappedActions {
  claimTokenRewards(): Promise<void>;
}
interface Data {
  showGraphics: boolean;
  hideRewards: boolean;
  hideWalletWarning: boolean;
}

interface StoreMappedGetters {
  rewardsClaimTaxAsFactorBN: BigNumber;
  maxRewardsClaimTaxAsFactorBN: BigNumber;
}

enum ClaimStage {
  WaxBridge = 0,
  Stake = 1,
  Claim = 2
}

export default Vue.extend({
  components: {
    ViewLinks,
    SkillBalanceDisplay,
  },
  created() {
    this.showGraphics = localStorage.getItem('useGraphics') === 'true';
    this.hideRewards = localStorage.getItem('hideRewards') === 'true';
    this.hideWalletWarning = localStorage.getItem('hideWalletWarning') === 'true';
  },

  data() {
    return {
      showGraphics: false,
      hideRewards: false,
      hideWalletWarning: false,
      ClaimStage
    } as Data;
  },

  computed: {
    ...(mapState(['skillRewards', 'directStakeBonusPercent']) as Accessors<StoreMappedState>),
    ...(mapGetters(['rewardsClaimTaxAsFactorBN', 'maxRewardsClaimTaxAsFactorBN']) as Accessors<StoreMappedGetters>),

    formattedSkillReward(): string {
      const skillRewards = fromWeiEther(this.skillRewards);
      return `${toBN(skillRewards).toFixed(4)}`;
    },
    formattedTaxAmount(): string {
      const skillRewards = fromWeiEther(parseFloat(String(parseFloat(this.skillRewards)*parseFloat(String(this.rewardsClaimTaxAsFactorBN)))) + '');
      return `${toBN(skillRewards).toFixed(4)}`;
    },
    formattedRewardsClaimTax(): string {
      const frac =
        this.skillRewards === '0'
          ? this.maxRewardsClaimTaxAsFactorBN
          : this.rewardsClaimTaxAsFactorBN;

      return `${frac.multipliedBy(100).decimalPlaces(0, BigNumber.ROUND_HALF_UP)}%`;
    },
    formattedBonusLost(): string {
      const skillLost = fromWeiEther(parseFloat(String(parseFloat(this.skillRewards)*this.directStakeBonusPercent/100)).toString());
      return `${toBN(skillLost).toFixed(4)}`;
    },
    canClaimTokens(): boolean {
      if(toBN(this.skillRewards).lte(0)) {
        return false;
      }
      return true;
    },
  },

  methods: {
    ...(mapActions(['claimTokenRewards']) as StoreMappedActions),
    toggleGraphics() {
      this.showGraphics = !this.showGraphics;
      if (this.showGraphics) localStorage.setItem('useGraphics', 'true');
      else localStorage.setItem('useGraphics', 'false');

      Events.$emit('setting:useGraphics', { value: this.showGraphics });
    },

    toggleRewards() {
      this.hideRewards = !this.hideRewards;
      if (this.hideRewards) localStorage.setItem('hideRewards', 'true');
      else localStorage.setItem('hideRewards', 'false');

      Events.$emit('setting:hideRewards', { value: this.hideRewards });
    },

    async onClaimTokens() {
      if(this.canClaimTokens) {
        await this.claimTokenRewards();
      }
    },
    async claimSkill(stage: ClaimStage) {
      if(stage === ClaimStage.Stake) {
        (this.$refs['stake-suggestion-modal'] as any).show();
      }
      if(stage === ClaimStage.Claim) {
        (this.$refs['stake-suggestion-modal'] as any).hide();
        (this.$refs['claim-confirmation-modal'] as any).show();
      }
    },

    toggleHideWalletWarning() {
      this.hideWalletWarning = !this.hideWalletWarning;
      if (this.hideWalletWarning) localStorage.setItem('hideWalletWarning', 'true');
      else localStorage.setItem('hideWalletWarning', 'false');

      Events.$emit('setting:hideWalletWarning', { value: this.hideWalletWarning });
    },
    hideOption(){
      Events.$emit('hide-option', false);
    },
  }
});
</script>

<style scoped>
.option-container{
  display: none;
}

@media (max-width: 767.98px){
    .navbar-nav{
        display: none;
    }

    .option-container{
      display: block;
    }

    .option-container-head{
      display: flex;
      align-items: center;
      padding: 15px 0;
      border-bottom: 1px solid #707070;
    }

    .option-container-head .title{
      margin-left: 40px;
      font-size: 1.7em;
      color: #CD894C;
    }

    .icon-close{
      font-size: 1.8em;
      margin: 0 20px;
      color: #CD894C;
    }

    .view-links{
      display: block;
    }

    .view-links .nav-line{
      height: 0;
    }

    .skill-display-mobile{
      margin: 0 1rem;
    }

    .option-container-body{
      width: 255px;
      margin: 0 auto;
      border-bottom: 1px solid #707070;
      padding: 10px 0;
    }

    .option-container-footer{
      margin-top: 15px;
    }

    .option-container-footer > div:first-child{
      font-size: 1em;
      margin: 0 45px;
      margin-bottom: 20px;
    }

    .link{
      display: flex;
      justify-content: center;
    }

    .link div{
      display: flex;
      flex-direction: column;
    }

    .link > div:last-child{
      margin-left: 40px;
    }

    .link div{
      font-size: 1.1em;
    }
}
</style>
