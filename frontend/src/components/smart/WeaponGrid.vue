<template>
  <div class="row">
    <div
      class="filters mt-1 pl-2 col-12 col-xl-3"
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
          class="gtag-link-others btn-claim-xp"
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

    <ul class="weapon-grid row col-12 col-xl-9">
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
  </div>
</template>

<script lang="ts">
import Vue from 'vue';
import Events from '../../events';
import { Accessors, PropType } from 'vue/types/options';
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex';
import { IState, IWeapon } from '../../interfaces';
import WeaponIcon from '../WeaponIcon.vue';

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
    } as Data;
  },

  components: {
    WeaponIcon
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
    }
  },

  mounted() {

    this.checkStorageFavorite();

    Events.$on('weapon:newFavorite', () => this.checkStorageFavorite());

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
/* .weapon-grid {
  list-style-type: none;
  justify-content: center;
  margin: 0;
  padding: 0;
  display: grid;
  padding: 0.5em;
  grid-template-columns: repeat(auto-fit, 14em);
  gap: 2em;
} */

.character-item.weapon {
  cursor: pointer;
  position: relative;
  display: flex;
  flex-direction: column;
  padding: 25px 15px;
}

.weapon-icon-wrapper {
  height: 100%;
}

.weapon-market .weapon-icon-wrapper{
  height: 20em;
}

.above-wrapper {
  padding: 0.1rem 0.1rem 1rem;
}

.above-wrapper .fix-h24 {
  margin: 0.5rem 0;
}

.toggle-button {
  align-self: stretch;
}

.show-reforged {
  display: flex;
  flex-direction: row;
  align-self: center;
}

.show-favorite {
    margin-left: 15px;
  }

.show-reforged-checkbox {
  margin-left: 5px;
}

.clear-filters-button {
  height: fit-content;
  display: flex;
  flex-direction: row;
  align-self: flex-end;
  margin:0 15px;
}

.weapon-container .clear-filters-button{
  margin-bottom: 0rem !important;
}

@media (width: 1024px) {
  .character-item.weapon {
    padding: 18px;
  }
}

@media (max-width: 576px) {
  .weapon-grid {
    margin-top: 10px;
  }

  .show-reforged {
    width: 100%;
    justify-content: start;
    margin-bottom: 15px;
    padding-left: 1rem;
  }
  .show-favorite{
    margin-left: 0;
  }
  .clear-filters-button {
    width: 100%;
    text-align: center;
    justify-content: center;
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


</style>
