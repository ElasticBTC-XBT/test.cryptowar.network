<template>
  <div>
    <div v-if="isShop">
      <div class="centered-text-div" v-if="(!nftIdTypes || nftIdTypes.length === 0)">
        <span>Nothing to buy at this time</span>
      </div>
      <ul class="nft-grid nft-list row">
        <li class="col-lg-3" :disabled="nft.isSoldOut" v-b-modal.modal-buyitem @click="checkBuy = nft" v-for="nft in nftIdTypes" :key="`${nft.type}.${nft.id}`">
          <div class="character-item addnew nft-container">
            <nft-icon :nft="nft" :isShop="isShop" :isLoading="isLoading" :favorite="isFavorite(nft.typeId, nft.id)"
            v-tooltip.top="{ content: itemDescriptionHtml(nft) , trigger: (isMobile() ? 'click' : 'hover') }"
            @mouseover="hover = !isMobile() || true"
            @mouseleave="hover = !isMobile()" />
          </div>
          <div class="btn-open-wrap">
            <b-button
              :disabled="nft.isSoldOut"
              class="shop-button btn-blue-bg btn-open-box"
            >
              <span v-if="!nft.isSoldOut">
                Buy ({{ Math.round(nft.nftPrice) }} xBlade)
              </span>
              <span  v-if="nft.isSoldOut && !isLoading && nft.id !== 2">
                SOLD OUT
              </span>
              <span  v-if="isLoading && nft.id !== 2">
                LOADING
              </span>
              <span  v-if="nft.id === 2">
                COMING SOON
              </span>
            </b-button>
          </div>
        </li>
        <b-modal id="modal-buyitem">
          <div :class="checkBuy.image?checkBuy.image.split('.')[0]:''"></div>
          <div>
            <div>
              <b-button class="mt-3" block @click="$bvModal.hide('modal-buyitem')">LATER</b-button>
            </div>
            <div>
              <b-button class="mt-2" block @click="$bvModal.hide('modal-buyitem'); buyItem(checkBuy)">OPEN NOW</b-button>
            </div>
          </div>
        </b-modal>
        <!-- <b-modal id="modal-selectitem">
          <div class="items">
            <div class="item" @click="buyItem(checkBuy)" v-for="i in 10" :key="i">
              <div class="info">
                <div class="info-head">
                  <div class="property"></div>
                  <div class="info-head-right">
                    <span>#123456</span>
                    <div class="leve">Lv.1</div>
                  </div>
                </div>
                <div class="img-hero-around">
                  <div class="img-hero"></div>
                </div>
                <div class="info-footer">
                  <div class="hero-name">Amiria Angurvidel</div>
                </div>
              </div>
              <div class="btn-request-fight">
                <button @click="checkSelect = true, (changeMode = true), (careerMode = false), (requestChallenge = false),
                $bvModal.hide('selectHeroOrWeaponModal')  , addClass = 'background'">SELECT</button>
              </div>
            </div>
          </div>
        </b-modal> -->
      </ul>
    </div>

    <div v-if="!isShop">
      <div class="filters row mt-2">
        <div v-if="!isMarket" class="col-sm-6 col-md-4 dropdown-elem">
          <strong>Nft Type</strong>
          <select class="form-control" v-model="typeFilter" @change="saveFilters()">
            <option v-for="x in ['', 'Shield']" :value="x" :key="x">{{ x || 'Any' }}</option>
          </select>
        </div>

        <div class="col-sm-6 col-md-4 dropdown-elem">
          <strong>Stars</strong>
          <select class="form-control" v-model="starFilter" @change="saveFilters()">
            <option v-for="x in ['', 1, 2, 3, 4, 5]" :value="x" :key="x">{{ x || 'Any' }}</option>
          </select>
        </div>

        <div class="col-sm-6 col-md-4 dropdown-elem">
          <strong>Element</strong>
          <select class="form-control" v-model="elementFilter" @change="saveFilters()">
            <option v-for="x in ['', 'Earth', 'Fire', 'Lightning', 'Water']" :value="x" :key="x">{{ x || 'Any' }}</option>
          </select>
        </div>

        <div class="col-sm-6 col-md-4 dropdown-elem" v-if="isMarket">
          <strong>Sort</strong>
          <select class="form-control" v-model="priceSort" @change="saveFilters()">
            <option v-for="x in sorts" :value="x.dir" :key="x.dir">{{ x.name || 'Any' }}</option>
          </select>
        </div>

        <div v-if="showFavoriteToggle" class="show-favorite">
          <b-check class="show-favorite-checkbox" v-model="showFavoriteNfts" />
          <strong>Show Favorite</strong>
        </div>

        <b-button
          class="ml-3 clear-filters-button"
          @click="clearFilters"
        >
          <span>
            Clear Filters
          </span>
        </b-button>
      </div>
      <ul class="nft-grid">
        <li class="nft" v-for="nft in nonIgnoredNfts" :key="`${nft.type}.${nft.id}`"
          :class="{ selected: highlight !== null && `${nft.type}.${nft.id}` === highlight }"
          @click="onNftClick(nft.type, nft.id)"
          @contextmenu="canFavorite && toggleFavorite($event, nft.type, nft.id)"
        >
          <nft-icon :favorite="isFavorite(nft.type, nft.id)" :nft="nft" :isShop="isShop"/>
          <div class="above-wrapper" v-if="$slots.above || $scopedSlots.above">
            <slot name="above" :nft="nft"></slot>
          </div>
          <slot name="sold" :nft="nft"></slot>
        </li>
      </ul>
    </div>
  </div>
</template>

<script lang="ts">
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import Events from '../../events';
import {Nft as nftItem} from '../../interfaces/Nft';
import { SkillShopListing } from '../../interfaces/SkillShopListing';
import NftIcon from '../NftIcon.vue';
import { Nft } from '@/interfaces/Nft';
import Vue from 'vue';
import { Accessors, PropType } from 'vue/types/options';
import { IState } from '@/interfaces';

const sorts = [
  { name: 'Any', dir: '' },
  { name: 'Price: Low -> High', dir: 1 },
  { name: 'Price: High -> Low', dir: -1 },
];

interface Data {
  typeFilter: string;
  starFilter: string;
  elementFilter: string;
  favorites: Record<string, Record<number, boolean>>;
  priceSort: string;
  showFavoriteNfts: boolean;
  checkBuy: string;
}

export interface NftIdType {
  id: number | string;
  type: string;
}

type StoreMappedState = Pick<IState, 'ownedShieldIds'>;

interface StoreMappedGetters {
  nftsWithIdType(nftIdType: NftIdType[]): Nft[];
  shieldsWithIds(ids: string[]): Nft[];
}

interface StoreMappedActions {
  purchaseShield(): Promise<void>;
  fetchShields(shieldIds: (string | number)[]): Promise<void>;
  purchaseRenameTag(): Promise<void>;
  purchaseRenameTagDeal(): Promise<void>;
  purchaseWeaponRenameTag(): Promise<void>;
  purchaseWeaponRenameTagDeal(): Promise<void>;
  purchaseCharacterFireTraitChange(): Promise<void>;
  purchaseCharacterEarthTraitChange(): Promise<void>;
  purchaseCharacterWaterTraitChange(): Promise<void>;
  purchaseCharacterLightningTraitChange(): Promise<void>;
  purchaseCommonSecretBox(): Promise<void>;
  purchaseRareSecretBox(): Promise<void>;
}

export default Vue.extend({
  model: {
    prop: 'highlight',
    event: 'choose-nft',
  },
  props: {
    highlight: {
      // this forces Typescript to consider a prop a certain type
      // without us specifying a "type" property;
      // Vue's "type" property is not as flexible as we need it here
      validator(x: string | number | null) {
        void x;
        return true;
      },
      default: null,
    },
    showGivenNftIdTypes: {
      type: Boolean,
      default: false,
    },
    nftIdTypes: {
      type: Array as PropType<NftIdType[]>,
      default() {
        return [];
      },
    },
    isShop: {
      type: Boolean,
      default: false,
    },
    isLoading: {
      type: Boolean,
      default: false,
    },
    isMarket: {
      type: Boolean,
      default: false,
    },
    ignore: {
      // this forces Typescript to consider a prop a certain type
      // without us specifying a "type" property;
      // Vue's "type" property is not as flexible as we need it here
      validator(x: string | number | null) {
        void x;
        return true;
      },
      default: null,
    },
    showLimit: {
      type: Number,
      default: 0,
    },
    showFavoriteToggle: {
      type: Boolean,
      default: true,
    },
    showFavoriteWeaponsDefVal: {
      type: Boolean,
      default: true,
    },
    canFavorite: {
      type: Boolean,
      default: true,
    },
  },

  data() {
    return {
      typeFilter: '',
      starFilter: '',
      elementFilter: '',
      favorites: {},
      priceSort: '',
      sorts,
      showFavoriteNfts: true,
      checkBuy: "",
    } as Data;
  },

  components: {
    NftIcon
  },

  computed: {
    ...(mapState(['ownedShieldIds']) as Accessors<StoreMappedState>),
    ...(mapGetters(['shieldsWithIds','nftsWithIdType']) as Accessors<StoreMappedGetters>),

    nftsToDisplay(): NftIdType[] {
      if (this.showGivenNftIdTypes) {
        return this.nftIdTypes;
      }

      const nfts: NftIdType[] = [];
      // push different kinds of nfts to nfts array here
      this.ownedShieldIds?.forEach(id => { nfts.push({ id, type: 'shield' }); });

      return nfts;
    },

    displayNfts(): Nft[] {
      if(this.isMarket && this.showGivenNftIdTypes) {
        const type = this.nftIdTypes && this.nftIdTypes[0]?.type;
        switch(type) {
        case('shield'):
          return this.shieldsWithIds(this.nftsToDisplay.map(x => x.id.toString())).filter(Boolean);
        default:
          return [];
        }
      }

      return this.nftsWithIdType(this.nftsToDisplay).filter(Boolean);
    },

    nonIgnoredNfts(): Nft[] {
      let items: Nft[] = [];
      this.displayNfts.forEach((x) => items.push(x));

      const allIgnore: NftIdType[] = [];
      if (!this.showFavoriteNfts) {
        for (const type in Object.keys(this.favorites)) {
          for(const id in Object.keys(this.favorites[type])) {
            allIgnore.push({ type, id });
          }
        }
      }
      items = items.filter((x) => allIgnore.findIndex((y) => y.id === x.id && y.type === x.type) < 0);

      if(this.typeFilter) {
        items = items.filter((x) => x.type?.localeCompare(this.typeFilter, undefined, { sensitivity: 'base' } ) === 0);
      }

      if (this.starFilter) {
        items = items.filter((x) => x.stars === +this.starFilter - 1);
      }

      if (this.elementFilter) {
        items = items.filter((x) => x.element?.includes(this.elementFilter));
      }

      if (this.showLimit > 0 && items.length > this.showLimit) {
        items = items.slice(0, this.showLimit);
      }

      const favoriteNfts: Nft[] = [];
      for (const key in this.favorites) {
        const i = items.findIndex((y) => y?.id === +key);
        if (i !== -1) {
          favoriteNfts.push(items[i]);
          items.splice(i, 1);
        }
      }

      return favoriteNfts.concat(items);
    }
  },

  watch: {
    async nftsToDisplay(newNftsToDisplay: NftIdType[]) {
      const shieldIds: string[] = [];
      newNftsToDisplay.forEach(nft => {
        switch(nft.type) {
        case('shield'):
          shieldIds.push(nft.id.toString());
        }
      });

      if(shieldIds.length > 0) {
        await this.fetchShields(shieldIds);
      }
    },
  },

  methods: {
    ...(mapActions(['purchaseShield', 'fetchShields', 'purchaseRenameTag', 'purchaseWeaponRenameTag',
      'purchaseRenameTagDeal', 'purchaseWeaponRenameTagDeal',
      'purchaseCharacterFireTraitChange', 'purchaseCharacterEarthTraitChange',
      'purchaseCharacterWaterTraitChange', 'purchaseCharacterLightningTraitChange',
      'purchaseCommonSecretBox', 'purchaseRareSecretBox'
    ]) as StoreMappedActions),
    ...mapMutations(['setCurrentNft']),

    async onShieldBuy() {
      await this.purchaseShield();
    },

    saveFilters() {
      if(this.isMarket) {
        sessionStorage.setItem('market-nft-typefilter', this.typeFilter);
        sessionStorage.setItem('market-nft-starfilter', this.starFilter);
        sessionStorage.setItem('market-nft-elementfilter', this.elementFilter);
        sessionStorage.setItem('market-nft-price-order', this.priceSort);
      } else {
        sessionStorage.setItem('nft-typefilter', this.typeFilter);
        sessionStorage.setItem('nft-starfilter', this.starFilter);
        sessionStorage.setItem('nft-elementfilter', this.elementFilter);
      }
      this.$emit('nft-filters-changed');
    },

    clearFilters() {
      if(this.isMarket) {
        sessionStorage.removeItem('market-nft-typefilter');
        sessionStorage.removeItem('market-nft-starfilter');
        sessionStorage.removeItem('market-nft-elementfilter');
        sessionStorage.removeItem('market-nft-price-order');
      } else {
        sessionStorage.removeItem('nft-typefilter');
        sessionStorage.removeItem('nft-starfilter');
        sessionStorage.removeItem('nft-elementfilter');
      }

      this.typeFilter = '';
      this.starFilter = '';
      this.elementFilter = '';
      this.priceSort = '';

      this.$emit('nft-filters-changed');
    },

    toggleFavorite(e: Event, type: string, id: number) {
      e.preventDefault();
      if (this.favorites[type] && this.favorites[type][id]) {
        this.$delete(this.favorites[type], id);
      } else {
        if(!this.favorites[type]) {
          this.$set(this.favorites, type, {});
        }
        this.$set(this.favorites[type], id, true);
      }

      localStorage.setItem('favorite-nfts', this.getFavoritesString(this.favorites));

      Events.$emit('nft:newFavorite', { type, id });
    },

    onNftClick(type: string, id: number) {
      this.setCurrentNft({ type, id });
      this.$emit('choose-nft', `${type}.${id}`);
    },

    getFavoritesString(favorites: Record<string, Record<number, boolean>>): string {
      return JSON.stringify(favorites);
    },

    checkStorageFavorite() {
      const favoritesFromStorage = localStorage.getItem('favorite-nfts');
      if (favoritesFromStorage) {
        this.favorites = JSON.parse(favoritesFromStorage);
      }
    },

    isFavorite(type: string, id: number): boolean {
      return this.favorites && this.favorites[type] && this.favorites[type][id];
    },

    async buyItem(item: nftItem) {
      if(item.type === 'shield'){
        console.log('buying shield');
        await this.purchaseShield();
      }

      if (item.type === 'SecretBox') {
        console.log('Buying secret box');
        if (item.id === 0) { //Common Box
          await this.purchaseCommonSecretBox();
        }
        if (item.id === 1) { // Rare Box
          await this.purchaseRareSecretBox();
        }
      }

      if(item.type === 'CharacterRenameTag'){
        await this.purchaseRenameTag();
      }
      if(item.type === 'CharacterRenameTagDeal'){
        await this.purchaseRenameTagDeal();
      }

      if(item.type === 'WeaponRenameTag'){
        await this.purchaseWeaponRenameTag();
      }
      if(item.type === 'WeaponRenameTagDeal'){
        await this.purchaseWeaponRenameTagDeal();
      }

      if(item.type === 'CharacterFireTraitChange'){
        await this.purchaseCharacterFireTraitChange();
      }
      if(item.type === 'CharacterEarthTraitChange'){
        await this.purchaseCharacterEarthTraitChange();
      }
      if(item.type === 'CharacterWaterTraitChange'){
        await this.purchaseCharacterWaterTraitChange();
      }
      if(item.type === 'CharacterLightningTraitChange'){
        await this.purchaseCharacterLightningTraitChange();
      }
    },
    itemDescriptionHtml(item: SkillShopListing): string {
      return item.name + '<br>' + item.description;
    }
  },

  mounted() {
    this.checkStorageFavorite();

    if(!this.showGivenNftIdTypes) {
      this.fetchShields(this.ownedShieldIds);
    }

    Events.$on('nft:newFavorite', () => this.checkStorageFavorite());

    if(this.isMarket) {
      this.typeFilter = sessionStorage.getItem('market-nft-typefilter') || '';
      this.starFilter = sessionStorage.getItem('market-nft-starfilter') || '';
      this.elementFilter = sessionStorage.getItem('market-nft-elementfilter') || '';
      this.priceSort = sessionStorage.getItem('market-nft-price-order') || '';
    } else {
      this.typeFilter = sessionStorage.getItem('nft-typefilter') || '';
      this.starFilter = sessionStorage.getItem('nft-starfilter') || '';
      this.elementFilter = sessionStorage.getItem('nft-elementfilter') || '';
    }
  }
});
</script>

<style>
.nft-grid {
  list-style-type: none;
  justify-content: center;
  margin: 0;
  display: grid;
  margin-top: 100px;
  grid-template-columns: repeat(auto-fit, 16em);
  gap: 2em;
}

.nft-list {
  justify-content: center;
}

.character-item.addnew.nft-container {
  margin: 0 70px;
  padding: 30px 0;
}

.centered-text-div {
  text-align: center;
}

.dropdown-elem {
  margin-bottom: 20px;
  max-width: 300px;
  width: 100%;
}

.show-favorite {
  margin-left: 15px;
  display: flex;
  flex-direction: row;
  align-self: center;
}

.show-favorite-checkbox {
  margin-left: 5px;
}

.clear-filters-button {
  align-self: flex-end;
  height: fit-content;
}

.clear-filters-button {
  display: flex;
  flex-direction: row;
  align-self: center;
}

.above-wrapper {
  padding: 0.1rem;
}

.nft.selected {
  outline: solid currentcolor 2px;
}

.btn-open-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
}

.btn-open-box {
  height: 48px !important;
  background-image: url("../../assets/v2/btn-pink-bg.svg") !important;
  background-size: cover;
  margin-right: 0 !important;
  display: flex;
  align-items: center;
}

#modal-buyitem{
  margin: auto;
}
#modal-buyitem .modal-content{
  background: url("../../assets/v2/shop_background_box_confirm.svg");
  background-repeat: no-repeat;
  background-size: contain !important;
  height: 484px;
  width: 100%;
}
#modal-buyitem .modal-dialog.modal-md{
  margin-top: 200px;
}
#modal-buyitem .modal-header .close{
  background: url("../../assets/v2/shop-icon-close-box-confirm.svg");
  background-repeat: no-repeat;
  background-size: contain;
  font-size: 0 !important;
  margin-right: 20px;
  margin-top: 30px;
  padding: 40px;
  z-index: 1;
}

#modal-buyitem .modal-body{
  margin-top: -100px;
}

#modal-buyitem .modal-body .rare-box{
  background: url("../../assets/rare-box.png");
}

#modal-buyitem .modal-body .common-box{
  background: url("../../assets/common-box.png");
}

#modal-buyitem .modal-body .epic-box{
  background: url("../../assets/epic-box.png");
}

#modal-buyitem .modal-body .rare-box,
#modal-buyitem .modal-body .common-box,
#modal-buyitem .modal-body .epic-box{
  background-repeat: no-repeat;
  background-size: contain;
  background-position: center;
  display: block;
  width: 40%;
  height: 320px;
  margin: auto;
}

#modal-buyitem .modal-body > div{
  display: flex;
  justify-content: space-evenly;
  width: 100%;
}

#modal-buyitem .modal-body div button{
  height: 50px;
  width: 170px;
  border: none;
  margin: 0 !important;
  font-weight: bold;
  border-radius: 0;
}

#modal-buyitem .modal-body > div div:first-child button{
  background: url("../../assets/v2/shop_button_later.svg");
  background-repeat: no-repeat, no-repeat;
  background-size: contain, contain;
}

#modal-buyitem .modal-body > div div:last-child button{
  background: url("../../assets/v2/shop_button_open.svg");
  background-repeat: no-repeat, no-repeat;
  background-size: contain, contain;
}

#modal-buyitem .modal-footer{
  display: none;
}

::-webkit-scrollbar-thumb {
  background: #fff;
  border-radius: 10px;
  height: 40%;
}

#modal-selectitem .modal-header .close{
  background: url("../../assets/v2/shop-icon-close-box-confirm.svg");
  background-repeat: no-repeat;
  background-size: contain;
  font-size: 0;
  margin-right: 10px;
  margin-top: 10px;
  padding: 30px;
  z-index: 1;
}

#modal-selectitem .modal-body{
  height: 100%;
  overflow: auto;
  margin: 20px 0;
  margin-top: -40px;
  overflow-y: scroll;
  margin-right: 55px;;
}

#modal-selectitem .modal-content{
  background: url("../../assets/v2/shop-select-item.svg");
  background-repeat: no-repeat;
  background-size: contain;
  border-radius: 0;
  width: 100%;
  height: 660px;
  position: relative;
}

#modal-selectitem ::-webkit-scrollbar-button {
  height: 12px;
}

#modal-selectitem ::-webkit-scrollbar{
  display: block;
  width: 10px;
}

#modal-selectitem ::-webkit-scrollbar-track {
  margin-top: 40px;
  background: #707070;
  border-radius: 10px;
}

@media (max-width: 576px) {
  #modal-selectitem .modal-header{
    padding: 0;
  }
  #modal-buyitem .modal-body .rare-box,
  #modal-buyitem .modal-body .common-box,
  #modal-buyitem .modal-body .epic-box{
    width: 40%;
    height: 130px;
  }

  #modal-buyitem .modal-header .close{
    margin: 0;
    padding: 30px;
  }

  #modal-buyitem .modal-body div button{
    height: 40px;
    width: 135px;
    font-size: 80%;
  }

  #modal-buyitem .modal-body{
    position: relative;
    top: -40%;
  }

  .weapon-grid {
    justify-content: center;
    margin-top: 10px;
  }

  .show-favorite {
    width: 100%;
    justify-content: center;
    margin-bottom: 15px;
  }

  .clear-filters-button {
    width: 100%;
    display: flex;
    flex-direction: row;
    align-self: center;
    text-align: center;
    justify-content: center;
    margin: 0 auto;
  }

  .ml-3 {
    margin-left: 0 !important;
  }
}

@media (min-width: 577px) and (max-width: 767.98px){
  #modal-buyitem .modal-body .rare-box,
  #modal-buyitem .modal-body .common-box,
  #modal-buyitem .modal-body .epic-box{
    width: 40%;
    height: 260px;
  }

  #modal-buyitem .modal-body{
    position: relative;
    top: -15%;
  }
}

/* Needed to adjust weapon list */
@media all and (max-width: 767.98px) {
  .weapon-grid {
    padding-left: 2em;
    justify-content: center;
  }

  .stars-elem {
    margin-bottom: 20px;
    max-width: 500px;
    width: 100%;
  }
  li.weapon {
    display: inline-block;
    margin: auto;
  }

  .nft-grid{
    justify-content: center;
  }
}

@media (min-width: 576px){
  #modal-selectitem .modal-dialog{
    max-width: 1000px;
  }
}

.sold {
  height: 40px;
  width: 230px;
  background-color: rgb(187, 33, 0);
  transform: rotate(15deg);
  left: -20px;
  position: absolute;
  top: 110px;
  z-index: 100;
}

.sold span {
  text-align: center;
  width: auto;
  color: white;
  display: block;
  font-size: 30px;
  font-weight: bold;
  line-height: 40px;
  text-shadow: 0 0 5px #333, 0 0 10px #333, 0 0 15px #333, 0 0 10px #333;
  text-transform: uppercase;
}

.fix-h24 {
  height: 24px;
}

@media (max-width: 1024px) {
  .character-item.addnew.nft-container {
    margin: 50px auto 0;
    height: 324px;
    width: 225px;
  }
}
</style>
