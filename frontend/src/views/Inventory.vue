<template>
    <div class="body main-font inventory">
      <b-tabs class="heading">
        <b-tab title="Hero">
          <div class="tab-content">
            <charater-list showFilters />
          </div>
        </b-tab>
        <b-tab title="Weapon">
          <div class="tab-content">
            <weapon-grid showFilters/>
          </div>
        </b-tab>
        <b-tab title="Dust">
          <div class="tab-content">
            <dust-balance-display />
          </div>
        </b-tab>
        <b-tab title="Box">
          <div class="tab-content">
            <box-balance-display />
          </div>
        </b-tab>
        <b-tab title="Fragment">
          <div class="tab-content">
            <FragmentBox />
          </div>
        </b-tab>
      </b-tabs>
    </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import CharaterList from '../components/smart/CharacterList.vue';
import WeaponGrid from '../components/smart/WeaponGrid.vue';
import DustBalanceDisplay from '../components/smart/DustBalanceDisplay.vue';
import BoxBalanceDisplay from '../components/smart/BoxBalanceDisplay.vue';
import Web3 from "web3";
import { mapActions, mapGetters, mapState } from "vuex";
import { Accessors } from "vue/types/options";
import { Contracts, IState } from "../interfaces";
import { SkillShopListing } from "../interfaces/SkillShopListing";
import BigNumber from "bignumber.js";
import { fromWeiEther, toBN } from "../utils/common";
import FragmentBox from '../components/smart/FragmentBox.vue';

type StoreMappedState = Pick<
IState,
| "defaultAccount"
| "weapons"
| "characters"
| "shields"
| "ownedCharacterIds"
| "ownedWeaponIds"
| "ownedShieldIds"
>;

interface StoreMappedGetters {
  contracts: Contracts;
  ownCharacters: any[];
  totalShieldSupply: 0;
  getCharacterName(id: string): string;
  getWeaponName(id: string, stars: number): string;
  getBoxPrice(): { common: string; rare: string };
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
}

export default Vue.extend({
  components: {
    CharaterList,
    WeaponGrid,
    DustBalanceDisplay,
    BoxBalanceDisplay,
    FragmentBox,
  },
  data() {
    return {
      fetchBoxPriceInterval: 0,
      fetchCommonBoxSupplyInterval: 0,
      fetchRareBoxSupplyInterval: 0,
      commonBoxSupply: 0,
      rareBoxSupply: 0,
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
      const { common, rare } = this.getBoxPrice();

      const nftList = [
        {
          id: 0,
          type: "SecretBox",
          nftPrice: toBN(fromWeiEther(common)).toNumber(),
          name: "Common Box",
          description: "Get common weapon, 1% chance to get 5-stars weapon",
          image: "common-box.png",
          isSoldOut: Number(this.commonBoxSupply) === 0,
          supply: this.commonBoxSupply
        },
        {
          id: 1,
          type: "SecretBox",
          nftPrice: toBN(fromWeiEther(rare)).toNumber(),
          name: "Rare Box",
          description: "Get rare weapon, 4% chance to get 5-stars weapon",
          image: "rare-box.png",
          isSoldOut: Number(this.rareBoxSupply) === 0,
          supply: this.rareBoxSupply
        },
        {
          id: 2,
          type: "SecretBox",
          nftPrice: 0,
          name: "Epic Box",
          description: "Get epic weapon, 6% chance to get 5-stars weapon",
          image: "epic-box.png",
          isSoldOut: true,
          supply: 0
        },
      ] as SkillShopListing[];

      return nftList;
    },

    itemRender(): SkillShopListing[] {
      return this.shopOffersNftList;
    },
  },

  methods: {
    ...(mapActions(["fetchBoxPrice", 'fetchTotalRareBoxSupply','fetchTotalCommonBoxSupply']) as StoreMappedActions),
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
    document.querySelector(".app.app-v2")?.classList.remove("bg2");
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
    setTimeout(() => {
      this.isLoading = false;
    }, 3000);
  },
  beforeDestroy() {
    clearInterval(this.fetchBoxPriceInterval);
    clearInterval(this.fetchCommonBoxSupplyInterval);
    clearInterval(this.fetchRareBoxSupplyInterval);
  },
});
</script>

<style>
@media (min-width: 1700px) {
  .inventory {
    margin-left: 95px;
    margin-right: 78px;
  }
}

@media (min-width: 1200px) {
  .inventory .tab-content {
    margin-top: 60px;
  }
}
</style>
