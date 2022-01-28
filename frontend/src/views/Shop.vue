<template>
  <div class="body main-font">
    <div class="shop-items">
      <nft-list :isShop="true" :nftIdTypes="itemRender" :isLoading="isLoading" />
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import Web3 from "web3";
import { mapGetters, mapState } from "vuex";
import { mapCacheActions } from 'vuex-cache';
import { Accessors } from "vue/types/options";
import { Contracts, IState } from "../interfaces";
import { SkillShopListing } from "../interfaces/SkillShopListing";
import BigNumber from "bignumber.js";
import { fromWeiEther, toBN } from "../utils/common";
import NftList from "@/components/smart/NftList.vue";
import Bignumber from 'bignumber.js';

type StoreMappedState = Pick<
IState,
| "defaultAccount"
| "weapons"
| "characters"
| "shields"
| "ownedCharacterIds"
| "ownedWeaponIds"
| "ownedShieldIds"
| "commonBoxPriceXgem"
| "rareBoxPriceXgem"
| "epicBoxPriceXgem"
| "myXgem"
| "blindBoxPriceXgem"
>;

interface StoreMappedGetters {
  contracts: Contracts;
  ownCharacters: any[];
  totalShieldSupply: 0;
  getCharacterName(id: string): string;
  getWeaponName(id: string, stars: number): string;
  getBoxPrice(): { common: string; rare: string, epic: string };
}

export interface Nft {
  id: string;
  type: string;
  stars?: number;
  element?: string;
  stat1?: string;
  stat2?: string;
  stat3?: string;
  stat1Value?: number;
  stat2Value?: number;
  stat3Value?: number;
  nftPrice?: number;
  isConsumable: boolean;
  name: string;
  description: string;
  image: string;
}

interface StoreMappedActions {
  fetchBoxPrice(): Promise<void>;
  fetchTotalCommonBoxSupply(): Promise<number>;
  fetchTotalRareBoxSupply(): Promise<number>;
  fetchTotalEpicBoxSupply(): Promise<number>;
}

export default Vue.extend({
  components: { NftList },
  data() {
    return {
      fetchBoxPriceInterval: 0,
      fetchCommonBoxSupplyInterval: 0,
      fetchRareBoxSupplyInterval: 0,
      fetchEpicBoxSupplyInterval: 0,
      commonBoxSupply: 0,
      rareBoxSupply: 0,
      epicBoxSupply: 0,
      isLoading: false,
    };
  },
  computed: {
    ...(mapState([
      "defaultAccount",
      "weapons",
      "characters",
      "shields",
      "ownedCharacterIds",
      "ownedWeaponIds",
      "ownedShieldIds",
      "commonBoxPriceXgem",
      "rareBoxPriceXgem",
      "epicBoxPriceXgem",
      'skillBalance',
      'inGameOnlyFunds',
      'skillRewards',
      'myXgem',
      'blindBoxPriceXgem'
    ]) as Accessors<StoreMappedState>),
    ...(mapGetters([
      "contracts",
      "ownCharacters",
      "totalShieldSupply",
      "getCharacterName",
      "getWeaponName",
      "getBoxPrice",
    ]) as Accessors<StoreMappedGetters>),
    ...mapGetters(["transferCooldownOfCharacterId"]),

    specialOffersNftList(): SkillShopListing[] {
      const nftList = [
        {
          id: "placeholder",
          type: "shield",
          nftPrice: 3,
          name: "Shield",
          description: "A Legendary Defender Shield",
          image: "",
        },
      ] as SkillShopListing[];

      return nftList;
    },

    shopOffersNftList(): SkillShopListing[] {
      const { common, rare, epic } = this.getBoxPrice();

      const xBladeBalance = fromWeiEther(
        Bignumber.sum(
          //@ts-ignore
          toBN(this.skillBalance),
          //@ts-ignore
          toBN(this.inGameOnlyFunds),
          //@ts-ignore
          toBN(this.skillRewards)
          //commit
        )
      );

      const nftList = [
        {
          id: 0,
          type: "SecretBox",
          nftPrice: toBN(fromWeiEther(common)).toNumber(),
          name: "Common Box",
          description:
       "0.4% chance to get 5-stars weapon, 1% chance to get 4-stars weapon, 2% chance to get 3-stars weapon, 8.5% chance to get 2-stars weapon, 88.1% chance to get 1-stars weapon",
          image: "common-box.png",
          isSoldOut: Number(this.commonBoxSupply) === 0,
          supply: this.commonBoxSupply,
          isDisable: Number(xBladeBalance) < toBN(fromWeiEther(common)).toNumber() ,
          nftPriceXgem: this.commonBoxPriceXgem,
          isDisableXgem: Number(this.myXgem) < this.commonBoxPriceXgem
        },
        {
          id: 1,
          type: "SecretBox",
          nftPrice: toBN(fromWeiEther(rare)).toNumber(),
          name: "Rare Box",
          description:
      "2.5% chance to get 5-stars weapon, 5% chance to get 4-stars weapon, 10% chance to get 3-stars weapon, 56% chance to get 2-stars weapon, 26.5% chance to get 1-stars weapon",
          image: "rare-box.png",
          isSoldOut: Number(this.rareBoxSupply) === 0,
          supply: this.rareBoxSupply,
          isDisable:  Number(xBladeBalance) < toBN(fromWeiEther(rare)).toNumber(),
          nftPriceXgem: this.rareBoxPriceXgem,
          isDisableXgem: Number(this.myXgem) < this.rareBoxPriceXgem
        },
        {
          id: 2,
          type: "SecretBox",
          nftPrice: toBN(fromWeiEther(epic)).toNumber(),
          name: "Epic Box",
          description:
       `0.6% chance to get 5-stars weapon, 
       1.5% chance to get 4-stars weapon, 2.5% chance to get 3-stars weapon, 10% chance to get 2-stars weapon, 
       84.4% chance to get 1-stars weapon and 1% chance to get hero`,
          image: "epic-box.png",
          isSoldOut: Number(this.epicBoxSupply) === 0,
          supply: this.epicBoxSupply,
          isDisable:  Number(xBladeBalance) < toBN(fromWeiEther(epic)).toNumber(),
          nftPriceXgem: this.epicBoxPriceXgem,
          isDisableXgem: Number(this.myXgem) < this.epicBoxPriceXgem
        },
        {
          id: 3,
          type: "SecretBox",
          nftPrice: this.blindBoxPriceXgem,
          onlyUseXgem: true,
          name: "Blind Box",
          description:`89% chance to get common box, 6% chance to get rare box and 5% chance to get epic box`,
          image: "blind-box.png",
          isSoldOut: false,
          supply: 999,
          isDisable: Number(this.myXgem) < this.blindBoxPriceXgem,
          nftPriceXgem: this.blindBoxPriceXgem,
          isDisableXgem: Number(this.myXgem) < this.blindBoxPriceXgem
        },
      ] as SkillShopListing[];

      return nftList;
    },

    itemRender(): SkillShopListing[] {
      return this.shopOffersNftList;
    },
  },

  methods: {
    //@ts-ignore
    ...(mapCacheActions(["fetchBoxPrice", 'fetchTotalRareBoxSupply','fetchTotalCommonBoxSupply', 'fetchTotalEpicBoxSupply']) as StoreMappedActions),
    convertWeiToSkill(wei: string) {
      return fromWeiEther(wei);
    },
    convertSkillToWei(skill: string) {
      return Web3.utils.toWei(skill);
    },
  },

  filters: {
    maxDecimals(val: string, maxDecimals: number) {
      return new BigNumber(val).toFixed(maxDecimals);
    },
    dynamicDecimals(val: string, minDecimals: number, maxDecimals: number) {
      const parsedVal = new BigNumber(val);

      if (parsedVal < new BigNumber(Math.pow(10, -maxDecimals))) {
        return "< " + Math.pow(10, -maxDecimals).toFixed(maxDecimals);
      }

      for (let i = maxDecimals - 1; i >= minDecimals; i--) {
        if (parsedVal < new BigNumber(Math.pow(10, -i))) {
          return new BigNumber(val).toFixed(i + 1);
        }
      }

      return new BigNumber(val).toFixed(minDecimals);
    },
  },

  beforeMount() {
    this.isLoading = true;
  },

  async mounted() {
    // @ts-ignore
    this.fetchBoxPriceInterval = setInterval(() => {
      this.fetchBoxPrice();
    }, 3000);
    // @ts-ignore
    this.fetchCommonBoxSupplyInterval = setInterval(async () => {
      this.commonBoxSupply = await this.fetchTotalCommonBoxSupply();
    }, 3000);
    // @ts-ignore
    this.fetchRareBoxSupplyInterval = setInterval(async () => {
      this.rareBoxSupply = await this.fetchTotalRareBoxSupply();
    }, 3000);
    // @ts-ignore
    this.fetchEpicBoxSupplyInterval = setInterval(async () => {
      this.epicBoxSupply = await this.fetchTotalEpicBoxSupply();
    }, 3000);
    setTimeout(() => {
      this.isLoading = false;
    }, 3000);
  },
  beforeDestroy() {
    clearInterval(this.fetchBoxPriceInterval);
    clearInterval(this.fetchCommonBoxSupplyInterval);
    clearInterval(this.fetchRareBoxSupplyInterval);
    clearInterval(this.fetchEpicBoxSupplyInterval);
  },
});
</script>

<style scoped>
.body {
  margin-top: 10px;
}

.button + .button {
  margin-left: 10px;
}

.search {
  width: 100%;
}

.search-buttons,
.self-buttons {
  margin-top: 10px;
  display: flex;
  justify-content: space-around;
}

.result-weaponHistory {
  max-width: 12em;
}

.result-selected {
  outline: solid currentcolor 2px;
}

.sell-grid {
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.outcome {
  margin: auto;
  text-align: center;
  font-size: 1em;
}

.modal-input {
  margin-bottom: 5px;
  margin-top: 5px;
}

.disabled-button {
  opacity: 0.65;
}

.transaction-history-text {
  color: #9e8a57 !important;
}

.transaction-history-header-text {
  color: #9e8a57;
  font-size: 34px;
}
.m-top-negative-5 {
  margin-top: -5px;
}

.m-top-negative-50 {
  margin-top: -50px;
}

.centered-text {
  text-align: center;
  padding: 10px;
}

.shop-horizontal-divider-top {
  margin-top: -10px;
  height: fit-content;
  width: 100%;
}

.shop-horizontal-divider {
  width: 100%;
}

.special-offer-items {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.shop-items {
  height: 100%;
  width: 100%;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.special-offer-bg {
  margin-top: -5px;
}
.button-row {
  align-items: center;
  justify-content: center;
}
.buttons-row {
  text-align: center;
  justify-content: center;
}
</style>
