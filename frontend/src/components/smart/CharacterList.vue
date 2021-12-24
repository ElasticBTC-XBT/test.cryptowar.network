<template>
  <div :class="showFilters && 'row'">
    <div
      class="filters mt-1 pl-2"
      :class="showFilters && 'col-12 col-xl-3'"
      v-if="showFilters"
      @change="saveFilters()"
    >
      <div
        class="search-wrap"
        @click="setFilterOnMobileState(true)"
      >
        <input
          class="form-control search"
          type="search"
          placeholder="  Seller Address, NFT ID"
        />
      </div>

      <div class="star-filter">
        <span class="filter-title">Stars</span>
        <ul class="stars-list">
          <li
            class="star-item"
            v-for="star in 5"
            v-bind:key="star"
            @click="starFilterTemp = star === starFilterTemp ? 0 : star"
            :class="star === starFilterTemp && 'selected'"
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

      <!-- <div class="col-sm-6 col-md-6 col-lg-2 mb-3">
        <strong>Level</strong>
        <select class="form-control" v-model="levelFilter">
          <option v-for="x in ['', 1, 11, 21, 31, 41, 51, 61, 71, 81, 91]" :value="x" :key="x">
            {{ x ? `${x} - ${x + 9}` : 'Any' }}
          </option>
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
          <select class="form-control" v-model="priceSort">
            <option v-for="x in sorts" :value="x.dir" :key="x.dir">{{ x.name || 'Any' }}</option>
          </select>
        </div>
      </template> -->
    </div>

    <ul class="character-list row" :class="showFilters && 'col-12 col-xl-9'">
      <li
        class="col-6 col-lg-4 col-xl-3"
        v-for="c in filteredCharacters"
        :key="c.id"
        @click="$emit('input', c.id)"
      >
        <div
          class="character-item"
          :class="[{ selected: value === c.id }, {isMarket: isSell}]"
        >
          <div class="above-wrapper" v-if="$slots.above || $scopedSlots.above">
            <slot name="above" :character="c"></slot>
          </div>
          <slot name="sold" :character="c"></slot>
          <div class="art">
            <CharacterArt :character="c" :isMarket="isMarket"/>
          </div>
          <div class="sell-box" v-if="isSell">
            <b-button @click="sellClick()">
              Sell
            </b-button>
          </div>
        </div>
      </li>

      <li
        class="col-6 col-lg-4 col-xl-3"
      >
        <div class="character-item addnew ">
          <b-button
            class="recruit"
            @click="onMintCharacter"
            v-tooltip="'Recruit new character'"
            tagname="recruit_character"
          >
            <i class="fas fa-plus"></i>
            <br>
            Recruit
          </b-button>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import { mapActions, mapGetters, mapState } from 'vuex';
import { getCharacterArt } from '../../character-arts-placeholder';
// import BackgroundItem from '../BackgroundItem.vue';
import CharacterArt from '../CharacterArt.vue';

const sorts = [
  { name: 'Any', dir: '' },
  { name: 'Price: Low -> High', dir: 1 },
  { name: 'Price: High -> Low', dir: -1 },
];

export default {
  props: {
    value: {},
    sellClick:{
      type: Function,
      default: null
    },
    isSell: {
      type: Boolean,
      default: false
    },
    showGivenCharacterIds: {
      type: Boolean,
      default: false
    },
    showFilters: {
      type: Boolean,
      default: false
    },
    characterIds: {
      type: Array,
      default() { return []; }
    },
    showLimit: {
      type: Number,
      default: 0
    },
    isMarket: {
      type: Boolean,
      default: false
    }
  },

  data() {
    return {
      starFilterTemp: 0,
      elementFilterTemp: '',
      searchValue: '',
      starFilter: 0,
      levelFilter: '',
      elementFilter: '',
      minPriceFilter:'',
      maxPriceFilter:'',
      priceSort: '',
      sorts,
    };
  },

  computed: {
    ...mapState(['maxStamina', 'ownedCharacterIds']),
    ...mapGetters(['getCharacterName', 'allStaminas', 'charactersWithIds']),

    characterIdsToDisplay() {
      if(this.showGivenCharacterIds) {
        return this.characterIds;
      }

      return this.ownedCharacterIds;
    },

    displayCharacters() {
      return this.charactersWithIds(this.characterIdsToDisplay).filter(Boolean);
    },

    filteredCharacters() {
      let items = this.displayCharacters;

      if(this.showFilters) {
        if(this.searchValue !== '') {
          items = items.filter(x => x.id === parseInt(this.searchValue, 10));
        }

        if(this.elementFilter) {
          items = items.filter(x => x.traitName.includes(this.elementFilter));
        }

        if(this.levelFilter) {
          items = items.filter(x => x.level >= this.levelFilter - 1 && x.level <= this.levelFilter + 8);
        }

        if(this.showLimit > 0 && items.length > this.showLimit) {
          items = items.slice(0, this.showLimit);
        }
      }

      return items;
    }
  },

  watch: {
    async characterIdsToDisplay(characterIds) {
      await this.fetchCharacters(characterIds);
    }
  },

  methods: {
    ...mapActions(['fetchCharacters']),

    getCharacterArt,

    setFilterOnMobileState(filterState) {
      document.querySelector('.filters').classList.toggle('active', filterState);
    },

    filterAll() {
      this.searchValue = this.$el.querySelector(".search").value;
      this.elementFilter = this.elementFilterTemp;
      this.starFilter = this.starFilterTemp;
    },

    saveFilters() {
      sessionStorage.setItem('character-levelfilter', this.levelFilter);
      sessionStorage.setItem('character-elementfilter', this.elementFilter);

      if(this.isMarket) {
        sessionStorage.setItem('character-price-order', this.priceSort);
        sessionStorage.setItem('character-price-minfilter', this.minPriceFilter);
        sessionStorage.setItem('character-price-maxfilter', this.maxPriceFilter);
      }
      this.$emit('character-filters-changed');
    },

    clearFilters() {
      sessionStorage.removeItem('character-levelfilter');
      sessionStorage.removeItem('character-elementfilter');
      if(this.isMarket) {
        sessionStorage.removeItem('character-price-order');
        sessionStorage.removeItem('character-price-minfilter');
        sessionStorage.removeItem('character-price-maxfilter');
      }

      this.elementFilter = '';
      this.levelFilter = '';
      this.priceSort = '';
      this.minPriceFilter = '';
      this.maxPriceFilter = '';

      this.$emit('character-filters-changed');
    },

  },

  components: {
    CharacterArt,
    // BackgroundItem,
  },

  mounted() {
    this.levelFilter = localStorage.getItem('character-levelfilter') || '';
    this.elementFilter = localStorage.getItem('character-elementfilter') || '';
    if(this.isMarket) {
      this.priceSort = sessionStorage.getItem('character-price-order') || '';
      this.minPriceFilter = sessionStorage.getItem('character-price-minfilter') || '';
      this.maxPriceFilter = sessionStorage.getItem('character-price-maxfilter') || '';
    }
  }
};
</script>

<style scoped>
@media (min-width: 1248px) {
  .home .character-list {
    padding: 0 295px;
  }
}

</style>
