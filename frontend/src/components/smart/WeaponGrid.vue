<template>
  <div>
    <div class="filters row mt-2 pl-2" v-if="!newWeapon && checkBar" @change="saveFilters()">
      <div class="col-sm-6 col-md-6 mb-3" :class="showGivenWeaponIds && !isMarket? 'col-lg-6':'col-lg-2'">
        <strong>Stars {{checkBar}}</strong>
        <select class="form-control" v-model="starFilter" >
          <option v-for="x in ['', 1, 2, 3, 4, 5]" :value="x" :key="x">{{ x || 'Any' }}</option>
        </select>
      </div>

      <div class="col-sm-6 col-md-6 mb-3" :class="showGivenWeaponIds && !isMarket? 'col-lg-6':'col-lg-2'">
        <strong>Element</strong>
        <select class="form-control" v-model="elementFilter" >
          <option v-for="x in ['', 'Earth', 'Fire', 'Lightning', 'Water']" :value="x" :key="x">{{ x || 'Any' }}</option>
        </select>
      </div>

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

      <b-button
        v-if="!newWeapon"
        class="clear-filters-button mb-3 mt-3"
        @click="clearFilters"
      >
        <span>
          Clear Filters
        </span>
      </b-button>
    </div>

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
        </div>
        <div class="above-wrapper" v-if="$slots.above || $scopedSlots.above">
          <slot name="above" :weapon="weapon"></slot>
        </div>
        <slot name="sold" :weapon="weapon"></slot>
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
    checkBar:{
      type:Boolean,
      default: true
    }
  },

  data() {
    return {
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

.filters {
  justify-content: center;
  width: 100%;
  max-width: 900px;
  margin: 0 auto;
  align-content: center;
  border-bottom: 0.2px solid rgba(102, 80, 80, 0.1);
  margin-bottom: 20px;
}
.weapon-grid {
  /* display: flex; */
  padding: 0 39px;
}

.weapon {
  /* background: rgba(255, 255, 255, 0.05); */
  /* border-radius: 6px; */
  cursor: pointer;
  position: relative;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  padding: 50px 0 60px 0;
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

/* .weapon-market .weapon-icon-wrapper{
  height: 20em;
} */

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

@media (max-width: 576px) {
  .weapon-grid {
    justify-content: center;
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
}

/* Needed to adjust weapon list */
@media all and (max-width: 767.98px) {
  .weapon-grid {
    justify-content: center;
    padding: 0;
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
