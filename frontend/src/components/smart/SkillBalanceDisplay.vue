<template>
  <div class="skill-balance-display">
    <div class="balance-container">
      <div class="xbladeContainer">
      <div
      size="sm"
      class="my-2 my-sm-0"
      variant="primary"
      v-tooltip="'Buy xBlade'"
      @click="onBuySkill"
    >
      <div class="btn-buy gtag-link-others" tagname="buy_skill">+</div>
    </div>
      <span
        class="balance"
        v-tooltip="{
          content: totalSkillTooltipHtml,
          trigger: isMobile() ? 'click' : 'hover',
        }"
        @mouseover="hover = !isMobile() || true"
        @mouseleave="hover = !isMobile()"
        >{{ formattedTotalSkillBalance }} <span class="xblade">xBlade</span>
      </span>
      </div>
      <span
        class="balance"
        v-tooltip="{
          content: totalSkillTooltipHtml,
          trigger: isMobile() ? 'click' : 'hover',
        }"
        @mouseover="hover = !isMobile() || true"
        @mouseleave="hover = !isMobile()"
        >{{ myXgem }} <span class="xblade">💎</span>
      </span>
    </div>

    <div class="bnb-withdraw-container mx-3" v-if="hasBnbAvailableToWithdraw">
      <b-icon-diamond-half
        scale="1.2"
        :class="canWithdrawBnb ? 'pointer' : null"
        :variant="canWithdrawBnb ? 'success' : 'warning'"
        @click="onWithdrawBNB"
        v-tooltip.bottom="bnbClaimTooltip"
      />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Bignumber from "bignumber.js";
import { Accessors } from "vue/types/options";
import { mapActions, mapState, mapGetters } from "vuex";
import { toBN, fromWeiEther } from "../../utils/common";
import { IState } from "@/interfaces";
import { formatDurationFromSeconds } from "@/utils/date-time";

type StoreMappedState = Pick<IState,
| "skillRewards"
| "skillBalance"
| "inGameOnlyFunds"
| "waxBridgeWithdrawableBnb"
| "waxBridgeTimeUntilLimitExpires">;

interface StoreMappedGetters {
  getExchangeUrl: string;
  availableBNB: string;
}

interface StoreMappedActions {
  addMoreSkill(skillToAdd: string): Promise<void>;
  withdrawBnbFromWaxBridge(): Promise<void>;
}

export default Vue.extend({
  computed: {
    ...(mapState([
      "skillRewards",
      "skillBalance",
      "inGameOnlyFunds",
      "waxBridgeWithdrawableBnb",
      "waxBridgeTimeUntilLimitExpires",
      "myXgem"
    ]) as Accessors<StoreMappedState>),
    ...(mapGetters({
      availableBNB: "waxBridgeAmountOfBnbThatCanBeWithdrawnDuringPeriod",
      getExchangeUrl: "getExchangeUrl",
    }) as Accessors<StoreMappedGetters>),

    formattedTotalSkillBalance() {
      const xBladeBalance = fromWeiEther(
        Bignumber.sum(
          toBN(this.skillBalance),
          toBN(this.inGameOnlyFunds),
          toBN(this.skillRewards)
        )
      );
      const { format } = new Intl.NumberFormat("en-EN");
      return `${format(
        toBN(xBladeBalance).toNumber()
      )}`;
    },

    formattedSkillBalance(): string {
      const skillBalance = fromWeiEther(this.skillBalance);
      return `${toBN(skillBalance).toFixed(4)} xBlade`;
    },

    hasBnbAvailableToWithdraw(): boolean {
      return toBN(this.waxBridgeWithdrawableBnb).gt(0);
    },

    canWithdrawBnb(): boolean {
      return toBN(this.availableBNB).gt(0);
    },

    formattedBnbThatCanBeWithdrawn(): string {
      return this.formatBnb(this.availableBNB);
    },

    formattedTotalAvailableBnb(): string {
      return this.formatBnb(this.waxBridgeWithdrawableBnb);
    },

    durationUntilLimitPeriodOver(): string {
      return formatDurationFromSeconds(this.waxBridgeTimeUntilLimitExpires);
    },

    bnbClaimTooltip(): string {
      if (!this.canWithdrawBnb) {
        return `
          You have reached your limit for withdrawing BNB from the portal for this period,
          please wait about ${this.durationUntilLimitPeriodOver}
          (${this.formattedTotalAvailableBnb} left)
        `;
      }

      return `${this.formattedBnbThatCanBeWithdrawn} of ${this.formattedTotalAvailableBnb} withdrawable from the portal`;
    },
    formattedInGameOnlyFunds(): string {
      const skillBalance = fromWeiEther(this.inGameOnlyFunds);
      return `${toBN(skillBalance).toFixed(4)} xBlade`;
    },
    totalSkillTooltipHtml() {
      const inGameOnlyFundsBalance = fromWeiEther(this.inGameOnlyFunds);
      const skillRewards = fromWeiEther(this.skillRewards);
      const skillBalance = fromWeiEther(this.skillBalance);

      let html = toBN(skillBalance).toFixed(4) + "xBlade";

      if (parseFloat(skillRewards) !== 0) {
        html +=
          "<br>+ WITHDRAWABLE " + toBN(skillRewards).toFixed(4) + "xBlade";
      }

      if (parseFloat(inGameOnlyFundsBalance) !== 0) {
        html +=
          "<br>+ IN GAME ONLY " +
          toBN(inGameOnlyFundsBalance).toFixed(4) +
          "xBlade";
      }

      return html;
    },
    hasInGameSkill(): boolean {
      const inGameOnlyFundsBalance = fromWeiEther(this.inGameOnlyFunds);
      return parseFloat(inGameOnlyFundsBalance) !== 0;
    },
  },

  methods: {
    ...(mapActions([
      "addMoreSkill",
      "withdrawBnbFromWaxBridge",
    ]) as StoreMappedActions),

    formatBnb(bnb: string): string {
      const amount = fromWeiEther(bnb);
      return `${toBN(amount).toFixed(4)} BNB`;
    },

    onBuySkill() {
      window.open(this.getExchangeUrl, "_blank");
    },

    async onWithdrawBNB() {
      if (!this.canWithdrawBnb) return;

      await this.withdrawBnbFromWaxBridge();
    },
  },

  components: {},
});
</script>

<style lang="scss">
.skill-balance-display {
  display: flex;
  align-items: center;
  font-size: 1.1rem;
}

.balance-container {
  margin-right: 5px;
  color: #fff;
  font-size: 1.25rem;
  font-weight: bold;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.xbladeContainer {
  display: flex;
}

.balance-text {
  color: #c755f8;
  font-size: 12px;
}
.btn-buy.gtag-link-others{
  background: linear-gradient(to bottom, #F58B5B, #F58B5B);
}
.navbar-light .navbar-nav .nav-link{
  color: #fff;
}

@media (max-width: 767.98px){
.balance-container{
  margin: 0 1.3rem;
}

.balance-container span{
  font-size: 1.2em;
}

.btn-buy.gtag-link-others{
  margin-right: 0;
  margin-left: 5px;
  width: 45px;
  height: 45px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2em;
}
}
</style>
