<template>
<<<<<<< HEAD
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
          class="gtag-link-others btn-blue-bg"
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
=======
  <div class="row">
    <div class="filters col-12 col-xl-3 col-lg-6" v-if="showFilters && checklist">
      <div>
        <div>
          <input class="form-control" type="text" placeholder="Seller Address, NFT ID" />
>>>>>>> dd3f251080d52c1e093af2a1597cf187167d05ca
        </div>

        <!-- <div class="start">
          <strong>STARS</strong>
          <div>
            <div v-for="x in ['1', '2', '3', '4', '5']"
            :style="starFilter>=x?'background: url('+require('../../assets/v2/market-star-click.svg')+'); background-repeat: no-repeat; background-size: contain; color: black':''"
            :key="x"
            @click="starFilter = x"
            >{{x}}</div>
          </div>
        </div> -->

        <div>
          <strong>LEVEL</strong>
          <select class="form-control" v-model="levelFilter">
            <option v-for="x in ['', 1, 11, 21, 31, 41, 51, 61, 71, 81, 91]" :value="x" :key="x">
              {{ x ? `${x} - ${x + 9}` : 'Any' }}
            </option>
          </select>
        </div>
<<<<<<< HEAD
      </template> -->
    </div>

    <ul class="character-list row" :class="showFilters && 'col-12 col-xl-9'">
      <li
        class="col-6 col-lg-4 col-xl-3"
        v-for="c in filteredCharacters"
        :key="c.id"
      >
        <div
          class="character-item"
          @click="$emit('input', c.id)"
          :class="[{ selected: value === c.id }, {isMarket: isSell}]"
=======

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
            <select class="form-control" v-model="priceSort">
              <option v-for="x in sorts" :value="x.dir" :key="x.dir">{{ x.name || 'Any' }}</option>
            </select>
          </div>
        </template>
        <!-- <b-button class="clear-filters-button" @click="clearFilters" >
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
      <ul class="character-list row">
        <li class="character-item"
          :class="[{ selected: value === c.id }, {isMarket: isSell}]"
          v-for="c in filteredCharacters"
          :key="c.id"
          @click="$emit('input', c.id)"
>>>>>>> dd3f251080d52c1e093af2a1597cf187167d05ca
        >
          <div class="above-wrapper" v-if="$slots.above || $scopedSlots.above">
            <slot name="above" :character="c"></slot>
          </div>
          <slot name="sold" :character="c"></slot>
          <div class="art">
            <CharacterArt :character="c" :isMarket="isMarket"/>
          </div>
<<<<<<< HEAD
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
=======


          <div class="sell-box" v-if="isSell">
            <button @click="sellClick()">
              SELL
            </button>
          </div>
        </li>

        <!-- <li class="character-item addnew">
>>>>>>> dd3f251080d52c1e093af2a1597cf187167d05ca
          <b-button
            class="recruit"
            @click="onMintCharacter"
            v-tooltip="'Recruit new character'"
            tagname="recruit_character"
<<<<<<< HEAD
          >
            <i class="fas fa-plus"></i>
            <br>
=======
          > <i class="fas fa-plus"></i><br>
>>>>>>> dd3f251080d52c1e093af2a1597cf187167d05ca
            Recruit
          </b-button>
        </div>
      </li>

      <li
        class="character-item addnew"
      >
        <b-button
                class="recruit"
                @click="onMintCharacter"
                v-tooltip="'Recruit new character'"
                tagname="recruit_character"
              >
              <i class="fas fa-plus"></i><br>
                Recruit
              </b-button>
      </li>
    </ul>
        </li> -->
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
    },
    checklist: {
      type: Boolean,
      default: true
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
      starFilter: '',
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
<<<<<<< HEAD
        if(this.searchValue !== '') {
          items = items.filter(x => x.id === parseInt(this.searchValue, 10));
        }
=======
        // if(this.starFilter) {
        //   items = items.filter(x => x.traitName.includes(this.elementFilter));
        // }
>>>>>>> dd3f251080d52c1e093af2a1597cf187167d05ca

        if(this.elementFilter) {
          console.log(items);
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
<<<<<<< HEAD
@media (min-width: 1248px) {
  .home .character-list {
    padding: 0 295px;
  }
}

=======

.character{
  margin: 10px 0;
}

.filters {
   justify-content: center;
   width: 100%;
   max-width: 900px;
   margin: 0 auto;
   align-content: center;
   border-bottom: 0.2px solid rgba(102, 80, 80, 0.1);
   margin-bottom: 20px;
}

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

/* .start > div{
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
} */

.clear-filters-button{
  align-self: center;
}

input::-webkit-outer-spin-button,
input::-webkit-inner-spin-button {
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

.character-item{
  margin-bottom: 80px;
}

.sell-box{
  margin-top: 20px;
}

.sell-box button{
  background: url("../../assets/v2/shop_nft_btn.svg");
  background-repeat: no-repeat;
  background-size: contain;
  width: 170px;
  height: 40px;
  border: none;
  color: white;
  font-weight: bold;
  font-size: 18px;
}

@media all and (max-width: 767.98px) {
  .search-button{
    height: 44px;
  }
  .character-item{
    margin: 50px 0;
  }
}

@media (min-width: 767.98px) and (max-width: 992px){
  .search-button{
    height: 38px;
    width: 220px;
  }
}

@media (min-width: 992px) and (max-width: 1200px){
  .search-button{
    height: 62px;
  }
}
>>>>>>> dd3f251080d52c1e093af2a1597cf187167d05ca
</style>
