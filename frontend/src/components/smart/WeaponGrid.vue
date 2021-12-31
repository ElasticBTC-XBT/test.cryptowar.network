<template>
  <div class="row">
<<<<<<< HEAD
    <div
      class="filters pl-2 col-12 col-xl-3"
      :class="isBlacksmith && 'filters-blacksmith'"
      @change="saveFilters()"
      v-if="showFilters"
    >
      <div
        class="search-wrap"
        @click="setFilterOnMobileState(true)"
      >
        <input
          class="form-control search"
          type="search"
          placeholder="  Seller Address, NFT ID"
          v-model="searchValueTemp"
        />
      </div>

      <div class="star-filter">
        <span class="filter-title">Stars</span>
        <ul class="stars-list">
          <li
            class="star-item"
            v-for="star in 5"
            v-bind:key="star"
            @click="starFilterTemp = star.toString() === starFilterTemp ? '' : star.toString()"
            :class="star.toString() === starFilterTemp && 'selected'"
          >
              <span>{{ star }}</span>
          </li>
        </ul>
      </div>

      <div class="element-filter">
        <span class="filter-title">Elements</span>
        <ul class="element-list">
          <li
            class="element-item"
            v-for="element in ['Earth', 'Fire', 'Lightning', 'Water']"
            v-bind:key="element"
            @click="elementFilterTemp = (element === elementFilterTemp ? '' : element)"
            :class="element === elementFilterTemp && 'selected'"
          >
              <span
                :class="element.toLowerCase() + '-icon'"
              ></span>
              <span class="element-text">{{ element }}</span>
          </li>
        </ul>
      </div>

      <div class="search-btn">
        <b-button
          class="gtag-link-others btn-blue-bg"
          v-html="`Search`"
          @click="filterAll"
        ></b-button>
      </div>

      <div class="filters-close" @click="setFilterOnMobileState(false)">
        <i class="fas fa-times"></i>
      </div>
    </div>

    <!-- <div>
        <template v-if="isMarket">
          <div class="col-sm-6 col-md-6 col-lg-2 mb-3">
            <strong>Min Price</strong>
            <input class="form-control" type="number" v-model.trim="minPriceFilter" :min="0" placeholder="Min" />
          </div>
          <div class="col-sm-6 col-md-6 col-lg-2 mb-3">
            <strong>Max Price</strong>
            <input class="form-control" type="number" v-model.trim="maxPriceFilter" :min="0" placeholder="Max" />
          </div>

          <div class="col-sm-6 col-md-6 col-lg-2 mb-3">
            <strong>Sort</strong>
            <select class="form-control" v-model="priceSort" >
              <option v-for="x in sorts" :value="x.dir" :key="x.dir">{{ x.name || 'Any' }}</option>
            </select>
          </div>
        </template>

        <div v-if="showReforgedToggle" class="show-reforged">
          <b-check class="show-reforged-checkbox" v-model="showReforgedWeapons" />
          <strong>Show reforged</strong>
        </div>

        <div v-if="showFavoriteToggle" class="show-reforged show-favorite">
          <b-check class="show-reforged-checkbox" v-model="showFavoriteWeapons" />
          <strong>Show Favorite</strong>
        </div>
      </div> -->

    <ul
      class="weapon-grid row col-12 col-xl-9"
      v-if="!isBlacksmith && !isBurnWeapon"
    >
      <li
        class="col-6 col-lg-4 col-xl-3"
        v-for="weapon in nonIgnoredWeapons"
        :key="weapon.id"
        @click="(!checkForDurability || getWeaponDurability(weapon.id) > 0) && onWeaponClick(weapon.id)"
        @contextmenu="canFavorite && toggleFavorite($event, weapon.id)"
      >
        <div
          class="character-item weapon"
          :class="[{ selected: highlight !== null && weapon.id === highlight },isSell?'weapon-market':'']"
=======
    <div class="filters col-12 col-xl-3 col-lg-6" v-if="!newWeapon && checkBar">
      <div>
        <div>
          <input class="form-control" type="text" placeholder="Seller Address, NFT ID" />
        </div>

        <div class="start">
          <strong>STARS</strong>
          <div>
            <div v-for="x in ['1', '2', '3', '4', '5']"
            :style="starFilter>=x?'background: url('+require('../../assets/v2/market-star-click.svg')+'); background-repeat: no-repeat; background-size: contain; color: black':''"
            :key="x"
            @click="starFilter===x?starFilter='':starFilter=x"
            >{{x}}</div>
          </div>
        </div>

        <!-- <div class="start">
          <strong>Stars</strong>
          <select class="form-control" v-model="starFilter" >
            <option v-for="x in ['', 1, 2, 3, 4, 5]" :value="x" :key="x">{{ x || 'Any' }}</option>
          </select>
        </div> -->

        <div class="element">
          <strong>ELEMENT</strong>
          <div @click="elementFilter==='Earth'?elementFilter='':elementFilter='Earth'" :class="elementFilter + ' earth'">
            <img src="../../assets/elements/earth.png" alt=""> Earth
          </div>
          <div @click="elementFilter==='Fire'?elementFilter='':elementFilter='Fire'" :class="elementFilter + ' fire'">
            <img src="../../assets/elements/fire.png" alt=""> Fire
          </div>
          <div @click="elementFilter==='Lightning'?elementFilter='':elementFilter='Lightning'" :class="elementFilter + ' lightning'">
            <img src="../../assets/elements/lightning.png" alt=""> Lightning
          </div>
          <div @click="elementFilter==='Water'?elementFilter='':elementFilter='Water'" :class="elementFilter + ' water'">
            <img src="../../assets/elements/water.png" alt=""> Water
          </div>
          <!-- <select class="form-control" v-model="elementFilter">
            <option v-for="x in ['', 'Earth', 'Fire', 'Lightning', 'Water']" :value="x" :key="x">{{ x || 'Any' }}</option>
          </select> -->
        </div>

        <!-- <div>
          <strong>Element</strong>
          <select class="form-control" v-model="elementFilter" >
            <option v-for="x in ['', 'Earth', 'Fire', 'Lightning', 'Water']" :value="x" :key="x">{{ x || 'Any' }}</option>
          </select>
        </div> -->

        <template v-if="isMarket">
          <div>
            <strong>MIN PRICE</strong>
            <input class="form-control" type="number" v-model.trim="minPriceFilter" :min="0" placeholder="Min" />
          </div>
          <div>
            <strong>MAX PRICE</strong>
            <input class="form-control" type="number" v-model.trim="maxPriceFilter" :min="0" placeholder="Max" />
          </div>

          <div>
            <strong>SORT</strong>
            <select class="form-control" v-model="priceSort" >
              <option v-for="x in sorts" :value="x.dir" :key="x.dir">{{ x.name || 'Any' }}</option>
            </select>
          </div>
        </template>

        <!-- <div v-if="showReforgedToggle" class="show-reforged">
          <b-check class="show-reforged-checkbox" v-model="showReforgedWeapons" />
          <strong>Show reforged</strong>
        </div>

        <div v-if="showFavoriteToggle" class="show-reforged show-favorite">
          <b-check class="show-reforged-checkbox" v-model="showFavoriteWeapons" />
          <strong>Show Favorite</strong>
        </div> -->

        <!-- <b-button
          v-if="!newWeapon"
          class="clear-filters-button mb-3 mt-3"
          @click="clearFilters"
        >
          <span>
            Clear Filters
          </span>
        </b-button> -->
        <b-button class="search-button" @click="saveFilters()" >
          SEARCH
        </b-button>
      </div>
    </div>

    <div class="col-12 col-xl-9 col-lg-6" v-if="checklist">
      <ul class="weapon-grid row">
        <li
          class="weapon"
          :class="[{ selected: highlight !== null && weapon.id === highlight },isSell?'weapon-market':'']"
          v-for="weapon in nonIgnoredWeapons"
          :key="weapon.id"
          @click=
          "(!checkForDurability || getWeaponDurability(weapon.id) > 0) && onWeaponClick(weapon.id)"
          @contextmenu="canFavorite && toggleFavorite($event, weapon.id)"
>>>>>>> dd3f251080d52c1e093af2a1597cf187167d05ca
        >
          <div class="weapon-icon-wrapper">
            <weapon-icon class="weapon-icon" :weapon="weapon" :favorite="isFavorite(weapon.id)" :isSell="isSell" :sellClick="sellClick"/>
          </div>
          <div class="above-wrapper" v-if="$slots.above || $scopedSlots.above">
            <slot name="above" :weapon="weapon"></slot>
          </div>
          <slot name="sold" :weapon="weapon"></slot>
<<<<<<< HEAD
          </div>
      </li>
    </ul>

    <ul class="row col-12" v-if="isBurnWeapon">
      <li
        class="col-6 col-lg-4 d-flex justify-content-center"
        v-for="(weapon, index) in nonIgnoredWeapons"
        :key="index"
        @click="(!checkForDurability || getWeaponDurability(weapon.id) > 0) && onWeaponClick(weapon.id)"
        @contextmenu="canFavorite && toggleFavorite($event, weapon.id)"
      >
        <div
          class="character-item weapon no-corner"
          :class="[{ selected: highlight !== null && weapon.id === highlight },isSell?'weapon-market':'']"
        >
          <div class="weapon-icon-wrapper">
            <weapon-icon class="weapon-icon" :weapon="weapon" :favorite="isFavorite(weapon.id)" :isSell="isSell" :sellClick="sellClick" :isBlacksmith="true"/>
=======
        </li>
      </ul>
    </div>
    <div v-if="!checklist">
      <ul class="weapon-grid row">
        <li
          class="weapon"
          :class="[{ selected: highlight !== null && weapon.id === highlight },isSell?'weapon-market':'']"
          v-for="weapon in nonIgnoredWeapons"
          :key="weapon.id"
          @click=
          "(!checkForDurability || getWeaponDurability(weapon.id) > 0) && onWeaponClick(weapon.id)"
          @contextmenu="canFavorite && toggleFavorite($event, weapon.id)"
        >
          <div class="weapon-icon-wrapper">
            <weapon-icon class="weapon-icon" :weapon="weapon" :favorite="isFavorite(weapon.id)" :isSell="isSell" :sellClick="sellClick"/>
>>>>>>> dd3f251080d52c1e093af2a1597cf187167d05ca
          </div>
          <div class="above-wrapper" v-if="$slots.above || $scopedSlots.above">
            <slot name="above" :weapon="weapon"></slot>
          </div>
          <slot name="sold" :weapon="weapon"></slot>
<<<<<<< HEAD
          </div>
      </li>
    </ul>

    <div
      class="weapon-grid blacksmith row col-12 col-xl-8"
      v-if="isBlacksmith && !isBurnWeapon"
    >
      <div class="weapon-list col-xl-12">
        <h2>Weapon list ({{nonIgnoredWeapons.length}})</h2>
        <div
          class="weapon-pagination-btn weapon-pagination-prev disabled"
          @click="prevWeaponList"
        ></div>
        <ul class="row">
          <li
            class="col-6 col-lg-4 d-flex justify-content-center"
            v-for="(weapon, index) in nonIgnoredWeapons"
            :key="index"
            @click="(!checkForDurability || getWeaponDurability(weapon.id) > 0) && onWeaponClick(weapon.id)"
            @contextmenu="canFavorite && toggleFavorite($event, weapon.id)"
          >
            <div
              class="character-item weapon"
              :class="[{ selected: highlight !== null && weapon.id === highlight },isSell?'weapon-market':'',isBlacksmith?'no-corner':'']"
              v-if="index > weaponPaginationPrev && index < weaponPaginationNext"
            >
              <div class="weapon-icon-wrapper">
                <weapon-icon class="weapon-icon" :weapon="weapon" :favorite="isFavorite(weapon.id)" :isSell="isSell" :sellClick="sellClick" :isBlacksmith="isBlacksmith"/>
              </div>
              <div class="above-wrapper" v-if="$slots.above || $scopedSlots.above">
                <slot name="above" :weapon="weapon"></slot>
              </div>
              <slot name="sold" :weapon="weapon"></slot>
              </div>
          </li>
        </ul>
        <div
          class="weapon-pagination-btn weapon-pagination-next"
          :class="nonIgnoredWeapons.length < weaponPaginationNext && 'disabled'"
          @click="nextWeaponList"
        ></div>
      </div>

      <div class="dust-wrap col-xl-12">
        <h2>Dust list</h2>
        <dust-balance-display class="dust-list-wrap" :isBlacksmith="isBlacksmith"/>
      </div>
=======
        </li>
      </ul>
>>>>>>> dd3f251080d52c1e093af2a1597cf187167d05ca
    </div>
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Events from '../../events';
import { Accessors, PropType } from 'vue/types/options';
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import { IState, IWeapon } from '../../interfaces';
import WeaponIcon from '../WeaponIcon.vue';
import DustBalanceDisplay from '../smart/DustBalanceDisplay.vue';

type StoreMappedState = Pick<IState, 'ownedWeaponIds'>;

interface StoreMappedGetters {
  weaponsWithIds(weaponIds: (string | number)[]): IWeapon[];
}

interface StoreMappedActions {
  fetchWeapons(weaponIds: string[]): Promise<void>;
}

interface Data {
  searchValueTemp: string;
  starFilterTemp: string;
  elementFilterTemp: string;
  searchValue: string;
  starFilter: string;
  elementFilter: string;
  minPriceFilter: string;
  maxPriceFilter: string;
  favorites: Record<number, boolean>;
  priceSort: string;
  showReforgedWeapons: boolean;
  showFavoriteWeapons: boolean;
  weaponPaginationPrev: number;
  weaponPaginationNext: number;
  numberWeaponsShow: number;
}

const sorts = [
  { name: 'Any', dir: '' },
  { name: 'Price: Low -> High', dir: 1 },
  { name: 'Price: High -> Low', dir: -1 },
];

export default Vue.extend({
  model: {
    prop: 'highlight',
    event: 'choose-weapon',
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
    showGivenWeaponIds: {
      type: Boolean,
      default: false,
    },
    weaponIds: {
      type: Array as PropType<string[]>,
      default() {
        return [];
      },
    },
    showLimit: {
      type: Number,
      default: 0,
    },
    showReforgedToggle: {
      type: Boolean,
      default: true,
    },
    showReforgedWeaponsDefVal: {
      type: Boolean,
      default: true,
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
    isBlacksmith: {
      type: Boolean,
      default: false
    },
    isBurnWeapon: {
      type: Boolean,
      default: false
    },
    isMarket: {
      type: Boolean,
      default: false
    },
    checkForDurability: {
      type: Boolean,
      default: false,
    },
    newWeapon: {
      type: Boolean,
      default: false,
    },
    isSell:{
      type:Boolean,
      default: false
    },
    sellClick:{
      type: ()=>{},
      default: null
    },
<<<<<<< HEAD
    showFilters: {
      type: Boolean,
      default: false
=======
    checkBar:{
      type:Boolean,
      default: true
    },
    checklist: {
      type: Boolean,
      default: true
>>>>>>> dd3f251080d52c1e093af2a1597cf187167d05ca
    }
  },

  data() {
    return {
      searchValueTemp: '',
      starFilterTemp: '',
      elementFilterTemp: '',
      searchValue: '',
      starFilter: '',
      elementFilter: '',
      minPriceFilter:'',
      maxPriceFilter:'',
      favorites: {},
      priceSort: '',
      sorts,
      showReforgedWeapons: this.showReforgedWeaponsDefVal,
      showFavoriteWeapons: this.showFavoriteWeaponsDefVal,
      weaponPaginationPrev: -1,
      weaponPaginationNext: 6,
      numberWeaponsShow: 6,
    } as Data;
  },

  components: {
    WeaponIcon,
    DustBalanceDisplay,
  },

  computed: {
    ...(mapState(['ownedWeaponIds']) as Accessors<StoreMappedState>),
    ...(mapGetters(['weaponsWithIds','getWeaponDurability',]) as Accessors<StoreMappedGetters>),

    weaponIdsToDisplay(): string[] {
      if (this.showGivenWeaponIds) {
        return this.weaponIds;
      }

      return this.ownedWeaponIds?.map((id) => id.toString());
    },

    displayWeapons(): IWeapon[] {
      return this.weaponsWithIds(this.weaponIdsToDisplay).filter(Boolean);
    },

    nonIgnoredWeapons(): IWeapon[] {
      if (this.newWeapon) {
        return this.displayWeapons;
      }

      let items: IWeapon[] = [];
      this.displayWeapons.forEach((x) => items.push(x));

      const allIgnore: string[] = [];
      if (this.ignore) {
        allIgnore.push((this.ignore || '').toString());
      }
      if (!this.showFavoriteWeapons) {
        for (const key in this.favorites) {
          allIgnore.push(key);
        }
      }
      items = items.filter((x) => allIgnore.findIndex((y) => y === x.id.toString()) < 0);


      if (this.searchValue !== '') {
        items = items.filter((x) => x.id === parseInt(this.searchValue, 10));
      }

      if (this.starFilter) {
        items = items.filter((x) => x.stars === +this.starFilter - 1);
      }

      if (this.elementFilter) {
        items = items.filter((x) => x.element.includes(this.elementFilter));
      }

      if (!this.showReforgedWeapons) {
        items = items.filter((x) => x.bonusPower === 0);
      }

      if (this.showLimit > 0 && items.length > this.showLimit) {
        items = items.slice(0, this.showLimit);
      }

      const favoriteWeapons: IWeapon[] = [];
      for (const key in this.favorites) {
        const i = items.findIndex((y) => y.id === +key);
        if (i !== -1) {
          favoriteWeapons.push(items[i]);
          items.splice(i, 1);
        }
      }

      return favoriteWeapons.concat(items);
    },
  },

  watch: {
    async weaponIdsToDisplay(newWeaponIds: string[]) {
      await this.fetchWeapons(newWeaponIds);
    },
  },

  methods: {
    ...(mapActions(['fetchWeapons']) as StoreMappedActions),
    ...(mapMutations(['setCurrentWeapon'])),

    setFilterOnMobileState(filterState: boolean) {
      this.$el.getElementsByClassName('filters')[0].classList.toggle('active', filterState);
    },

    filterAll() {
      this.searchValue = this.searchValueTemp;
      this.elementFilter = this.elementFilterTemp;
      this.starFilter = this.starFilterTemp;
    },

    saveFilters() {
      if(this.isMarket) {
        sessionStorage.setItem('market-weapon-starfilter', this.starFilter);
        sessionStorage.setItem('market-weapon-elementfilter', this.elementFilter);
        sessionStorage.setItem('market-weapon-price-order', this.priceSort);
        sessionStorage.setItem('market-weapon-price-minfilter', this.minPriceFilter?''+this.minPriceFilter:'');
        sessionStorage.setItem('market-weapon-price-maxfilter', this.maxPriceFilter?''+this.maxPriceFilter:'');
      } else {
        sessionStorage.setItem('weapon-starfilter', this.starFilter);
        sessionStorage.setItem('weapon-elementfilter', this.elementFilter);
      }
      this.$emit('weapon-filters-changed');
    },

    toggleFavorite(e: Event, weaponId: number) {
      e.preventDefault();
      if (this.favorites[weaponId]) {
        this.$delete(this.favorites, weaponId);
      } else {
        this.$set(this.favorites, weaponId, true);
      }

      localStorage.setItem('favorites', this.getFavoritesString(this.favorites));

      Events.$emit('weapon:newFavorite', { value: weaponId });
    },

    getFavoritesString(favorites: Record<number, boolean>): string {
      return JSON.stringify(favorites);
    },

    getFavoritesMap(favorites: string): Record<number, boolean> {
      if (!favorites) {
        return {};
      }

      const favoritesMap: Record<number, boolean> = {};
      favorites.split(',').forEach((x) => (favoritesMap[+x] = true));
      return favoritesMap;
    },

    isFavorite(weaponId: number): boolean {
      return this.favorites[weaponId];
    },

    clearFilters() {
      if(this.isMarket) {
        sessionStorage.removeItem('market-weapon-starfilter');
        sessionStorage.removeItem('market-weapon-elementfilter');
        sessionStorage.removeItem('market-weapon-price-order');
        sessionStorage.removeItem('market-weapon-price-minfilter');
        sessionStorage.removeItem('market-weapon-price-maxfilter');
      } else {
        sessionStorage.removeItem('weapon-starfilter');
        sessionStorage.removeItem('weapon-elementfilter');
      }
      this.elementFilter = '';
      this.starFilter = '';
      this.priceSort = '';
      this.minPriceFilter= '';
      this.maxPriceFilter= '';

      this.$emit('weapon-filters-changed');
    },

    onWeaponClick(id: number) {
      this.setCurrentWeapon(id);
      this.$emit('chooseweapon', id);
      this.$emit('choose-weapon', id);
    },

    checkStorageFavorite() {
      const favoritesFromStorage = localStorage.getItem('favorites');
      if (favoritesFromStorage) {
        this.favorites = JSON.parse(favoritesFromStorage);
      }
    },

    prevWeaponList() {
      if (this.weaponPaginationPrev !== -1) {
        this.weaponPaginationPrev -= this.numberWeaponsShow;
        this.weaponPaginationNext -= this.numberWeaponsShow;
        this.$el.querySelector(".weapon-pagination-next")?.classList.remove("disabled");
      }
      this.$el.querySelector(".weapon-pagination-prev")?.classList.toggle("disabled", this.weaponPaginationPrev === -1);
    },

    nextWeaponList() {
      if (this.weaponPaginationNext <= this.nonIgnoredWeapons.length) {
        this.weaponPaginationPrev += this.numberWeaponsShow;
        this.weaponPaginationNext += this.numberWeaponsShow;
        this.$el.querySelector(".weapon-pagination-prev")?.classList.remove("disabled");
      }
      this.$el.querySelector(".weapon-pagination-next")?.classList.toggle("disabled", this.weaponPaginationNext > this.nonIgnoredWeapons.length);
    }
  },

  mounted() {

    this.checkStorageFavorite();

    Events.$on('weapon:newFavorite', () => this.checkStorageFavorite());

    if (screen.width < 1024) {
      this.weaponPaginationNext = 4;
      this.numberWeaponsShow = 4;
    } else {
      this.weaponPaginationNext = 6;
      this.numberWeaponsShow = 6;
    }

    if(this.isMarket) {
      this.starFilter = sessionStorage.getItem('market-weapon-starfilter') || '';
      this.elementFilter = sessionStorage.getItem('market-weapon-elementfilter') || '';
      this.priceSort = sessionStorage.getItem('market-weapon-price-order') || '';
      this.minPriceFilter = sessionStorage.getItem('market-weapon-price-minfilter') || '';
      this.maxPriceFilter = sessionStorage.getItem('market-weapon-price-maxfilter') || '';
    } else {
      this.starFilter = sessionStorage.getItem('weapon-starfilter') || '';
      this.elementFilter = sessionStorage.getItem('weapon-elementfilter') || '';
    }
  },
});
</script>

<style scoped>
<<<<<<< HEAD
.character-item.weapon {
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 25px 15px;
}

.weapon-icon-wrapper {
  height: 100%;
=======

/* .filters {
  justify-content: center;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  align-content: center;
  border-bottom: 0.2px solid rgba(102, 80, 80, 0.1);
  margin-bottom: 20px;
} */

.filters{
  padding: 0 60px;
}

.filters > div {
  background-color: rgba(0, 0, 0, .5);
  padding: 20px;
}

.filters > div > div{
  margin-top: 30px;
}

.filters > div > div strong{
  font-weight: normal;
}

.filters strong{
  font-size: 20px;
  margin-top: 10px;
}

.element{
  border-top: 2px solid #707070;
  border-bottom: 2px solid #707070;
  padding: 30px 0;
}

.element img{
  width: 40px;
  height: 40px;
  display: inline;
  margin-right: 20px;
}

.element div{
  margin-top: 15px;
  width: fit-content;
  cursor: pointer;
  font-weight: bold;
  font-size: 18px;
  opacity: .6;
}

.Earth.earth{
  opacity: 1;
  filter: contrast(200%);
}

.Fire.fire{
  opacity: 1;
  filter: contrast(200%);
}

.Lightning.lightning{
  opacity: 1;
  filter: contrast(200%);
}

.Water.water{
  opacity: 1;
  filter: contrast(200%);
}

.start > div{
  display: flex;
  margin-top: 10px;
  justify-content: space-between;
}

.start > div > div{
  background: url("../../assets/v2/market-star.svg");
  background-repeat: no-repeat;
  background-size: contain;
  width: 60px;
  height: 60px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 800;
  cursor: pointer;
  font-size: 18px;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button{
  -webkit-appearance: none;
}

.form-control{
  background-color: transparent;
  color: white;
  border: 1px solid rgb(17,65,105);
  border-radius: 10px;
  appearance: none;
  -webkit-appearance: none;
  -moz-appearance: none;
  padding: 0.5rem 1rem;
  font-size: 18px;
  font-weight: 100;
  padding: 15px;
  margin-top: 10px;
}

.form-control:focus{
  background-color: transparent;
  color: white;
}

.form-control::placeholder{
  color: rgba(255, 255, 255, 0.6);
}

.weapon-grid {
  /* display: flex; */
  padding: 0 39px;
}

.search-button{
  background: url("../../assets/v2/market-search.svg");
  background-repeat: no-repeat;
  background-size: contain;
  width: 100%;
  height: 53px;
  border: none;
  margin: 40px 0;
  font-weight: bold;
  font-size: 20px;
  border-radius: 0;
}

.weapon {
  /* background: rgba(255, 255, 255, 0.05); */
  /* border-radius: 6px; */
  cursor: pointer;
  position: relative;
  /* overflow: hidden; */
  display: flex;
  flex-direction: column;
  padding: 50px 0 80px 0;
  padding-left: 20px;
  padding-right: 20px;
}

.weapon-icon-wrapper {
  /* width: 306px;
  height: 436px;
  margin: auto;
  background: url("../../assets/v2/market_background_weapon.svg");
  background-repeat: no-repeat;
  background-size: contain; */

  height: 415px;
  width: 300px;
  /* background-position: 50% 50%; */
  background-repeat: no-repeat;
  background-size: 100% 100%;
  position: relative;
  border: 1px solid #3CDE9B;
  border-radius: 15px 40px 15px 15px;
  background: #0D2F9Cbb;
  background-image: radial-gradient(#F5EFC2 -30%, transparent 70%);
  margin: auto;
>>>>>>> dd3f251080d52c1e093af2a1597cf187167d05ca
}

.weapon-icon-wrapper::before{
  content: '';
  width: 76px;
  height: 72px;
  background: url("../../assets/v2/corner_green.svg") no-repeat 0 0;
  background-size: cover;
  position: absolute;
  right: -6px;
  top: -8px;
}

<<<<<<< HEAD
.sold {
    height: 40px;
    width: 230px;
    background-color: rgb(187, 33, 0);
    transform: rotate(15deg);
    left: -20px;
    position: absolute;
    top: 110px;
    z-index: 100;
=======
/* .weapon-market .weapon-icon-wrapper{
  height: 20em;
} */

.above-wrapper {
  margin-top: 25px;
>>>>>>> dd3f251080d52c1e093af2a1597cf187167d05ca
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

/* Blacksmith */
.weapon-grid.blacksmith {
  padding: 0 10px;
}

.blacksmith h2 {
  font-size: 24px;
}

.weapon-grid.blacksmith .weapon-list,
.weapon-grid.blacksmith .dust-wrap {
  background-color: rgba(0, 0, 0, 0.5);
  padding: 10px 32px 0;
  position: relative;
  max-height: 504px;
}

.weapon-grid.blacksmith .dust-wrap {
  margin-top: 15px;
  max-height: 352px;
}

.weapon-grid.blacksmith ul {
  list-style: none;
  padding: 0 28px;
}

<<<<<<< HEAD
.character-item.weapon.no-corner {
  padding: 10px;
}

.weapon-pagination-btn {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background-repeat: no-repeat;
  background-size: contain;
  width: 34px;
  height: 67px;
  cursor: pointer;
}

.weapon-pagination-btn.disabled {
  filter: brightness(50%);
}

.weapon-pagination-btn.weapon-pagination-prev {
  left: 28px;
  background-image: url("../../assets/v2/weapon-pagination-prev.svg");
}

.weapon-pagination-btn.weapon-pagination-next {
  right: 28px;
  background-image: url("../../assets/v2/weapon-pagination-next.svg");
}

@media (width: 1024px) {
  .character-item.weapon {
    padding: 18px;
=======

@media (max-width: 576px) {
  .weapon-grid {
    justify-content: center;
    margin-top: 10px;
>>>>>>> dd3f251080d52c1e093af2a1597cf187167d05ca
  }

  .weapon-grid.blacksmith .weapon-list {
    height: 504px;
  }
}

@media (min-width: 1025px) {
  .filters.filters-blacksmith {
    max-height: 867px;
    height: 867px;
    border: 0.5px solid #3CDE9B;
  }
}

@media (min-width: 768px) {
  .weapon-grid.blacksmith .dust-wrap {
    max-height: none;
  }
}

@media (min-width: 576px) {
  .weapon-grid.blacksmith .weapon-list {
    min-height: 504px;
    border: 0.5px solid #3CDE9B;
  }

  .weapon-grid.blacksmith .dust-wrap {
    border: 0.5px solid #3CDE9B;
  }
}

@media (max-width: 576px) {
  .weapon-grid {
    margin-top: 10px;
  }

  .ml-3 {
    margin-left: 0 !important;
  }
  h1{
    font-size: 2rem;
  }
  .main-font .nav-tabs a.nav-link{
    padding-left: 0.2rem;
    padding-right: 0.2rem;
  }

  .character-item.weapon {
    padding: 12px;
    height: 292px;
  }

  .weapon-grid.blacksmith {
    padding: 0;
  }

  .weapon-grid.blacksmith .weapon-list,
  .weapon-grid.blacksmith .dust-wrap {
    padding: 10px 0 0;
    background-color: transparent;
  }

  .weapon-grid.blacksmith ul {
    padding: 0;
  }

  .weapon-pagination-btn {
    width: 20px;
    height: 30px;
    top: 10px;
    transform: translateY(0);
  }

  .weapon-pagination-btn.weapon-pagination-prev {
    left: auto;
    right: 40px;
  }

  .weapon-pagination-btn.weapon-pagination-next {
    right: 10px;
  }

  .weapon-grid.blacksmith .dust-wrap {
    max-height: none;
  }
}

/* Needed to adjust weapon list */
@media all and (max-width: 767.98px) {
  .weapon-grid {
<<<<<<< HEAD
    padding-left: 2em;
=======
    justify-content: center;
    padding: 0;
>>>>>>> dd3f251080d52c1e093af2a1597cf187167d05ca
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
  .weapon{
    padding: 40px 0 60px 0;
  }
}

<<<<<<< HEAD
@media (max-width: 1024px) {
  .weapon-grid.blacksmith .dust-wrap {
    padding-bottom: 10px;
  }
=======
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
>>>>>>> dd3f251080d52c1e093af2a1597cf187167d05ca
}
.selected .weapon-icon-wrapper{
  box-shadow: inset 0 0 30px yellow;
  border: 1px solid orange;
}

<<<<<<< HEAD
=======
.selected .weapon-icon-wrapper::before{
  background-image: url('../../assets/v2/corner_yellow.svg');
}

>>>>>>> dd3f251080d52c1e093af2a1597cf187167d05ca
</style>
