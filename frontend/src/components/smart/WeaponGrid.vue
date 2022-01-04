<template>
  <div class="row">
    <div
      class="filters market-active pl-2 col-12 "
      :class="isBlacksmith ? 'filters-blacksmith col-xl-4' : 'col-xl-3'"
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

    <ul
      class="weapon-grid row" :class="showFilters && 'col-12 col-xl-9'"
      v-if="!isBlacksmith && !isBurnWeapon"
    >
      <li
        class="col-12 col-sm-6 col-md-4 col-xl-3"
        v-for="weapon in nonIgnoredWeapons"
        :key="weapon.id"
        @click="(!checkForDurability || getWeaponDurability(weapon.id) > 0) && onWeaponClick(weapon.id)"
        @contextmenu="canFavorite && toggleFavorite($event, weapon.id)"
      >
        <div
          class="character-item weapon"
          :class="[{ selected: highlight !== null && weapon.id === highlight },isSell?'weapon-market':'']"
        >
          <div class="weapon-icon-wrapper">
            <weapon-icon class="weapon-icon" :weapon="weapon" :favorite="isFavorite(weapon.id)" :isSell="isSell" :sellClick="sellClick"/>
          </div>
          <div class="above-wrapper" v-if="$slots.above || $scopedSlots.above">
            <slot name="above" :weapon="weapon"></slot>
          </div>
          <slot name="sold" :weapon="weapon"></slot>
          </div>
      </li>
    </ul>

    <ul class="row col-12" v-if="isBurnWeapon">
      <li
        class="col-6 col-lg-6 d-flex justify-content-center"
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
          </div>
          <div class="above-wrapper" v-if="$slots.above || $scopedSlots.above">
            <slot name="above" :weapon="weapon"></slot>
          </div>
          <slot name="sold" :weapon="weapon"></slot>
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
    showFilters: {
      type: Boolean,
      default: false
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

.weapon-icon-wrapper {
  height: 100%;
}

.character-item.weapon {
  cursor: pointer;
  font-size: 18px;
  position: relative;
  display: flex;
  text-align: right;
  flex-direction: column;
  padding: 15px 15px;
  padding-right: 20px;
  margin: 0 auto 50px;
}

.weapon-market {
  margin-top: 50px !important;
}

.character-item.weapon:not(.no-corner) {
  max-width: 288px;
  min-width: 230px;
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

.character-item.weapon.no-corner {
  padding: 10px;
  margin: 0;
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

.filters.market-active.active{
  height: 970px;
}

@media (width: 1024px) {
  .character-item.weapon {
    padding: 18px;
  }

  .weapon-grid.blacksmith .weapon-list {
    height: 504px;
  }
}

@media (min-width: 1201px) {
  .filters.filters-blacksmith {
    max-height: 867px;
    height: 867px !important;
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

  .character-item.weapon.no-corner {
    margin-top: 20px !important;
  }
}

/* Needed to adjust weapon list */
@media all and (max-width: 767.98px) {
  .weapon-grid {
    padding-left: 2em;
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

@media (max-width: 1024px) {
  .weapon-grid.blacksmith .dust-wrap {
    padding-bottom: 10px;
  }
}

</style>
