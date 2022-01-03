<template>
  <div :class="showFilters && 'row'">
    <div
      class="filters pl-2"
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
        </div> -->

        <!-- <div class="start">
          <strong>STARS</strong>
          <div>
            <div v-for="x in ['1', '2', '3', '4', '5']"
            :style="starFilter>=x?'background: url('+require('../../assets/v2/market-star-click.svg')+'); background-repeat: no-repeat; background-size: contain; color: black':''"
            :key="x"
            @click="starFilter = x"
            >{{x}}</div>
          </div>
        </div>

        <div>
          <strong>LEVEL</strong>
          <select class="form-control" v-model="levelFilter">
            <option v-for="x in ['', 1, 11, 21, 31, 41, 51, 61, 71, 81, 91]" :value="x" :key="x">
              {{ x ? `${x} - ${x + 9}` : 'Any' }}
            </option>
          </select>
        </div>
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
        v-if="!isMarket"
      >
        <div class="character-item addnew" @click="onMintCharacter">
          <b-button
            class="recruit"
            v-tooltip="'Recruit new character'"
            tagname="recruit_character"
          >
            <i class="fas fa-plus"></i>
            <br>
            Recruit
            <br>
            <span
                  :class="`${referralAddress == '0x0000000000000000000000000000000000000000' ? 'price' : ''}`"
                   v-if="referralAddress == '0x0000000000000000000000000000000000000000'"
                  >({{ recruitCost }} xBlade)</span
                >
                <span v-if="referralAddress != '0x0000000000000000000000000000000000000000'" class="price">
                  {{ (recruitCost * 0.93).toFixed(2) }}xBlade)</span
                >
          </b-button>
          <div class="small-hero-left">
            Only
            <strong
              class="upper-text promotion-number"
              style="margin: 0 4px"
              >{{ heroAmount }}</strong
            >
            heroes left!
          </div>
        </div>
      </li>
    </ul>
  </div>
</template>

<script>
import BN from "bignumber.js";
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

  async created() {
    const recruitCost = await this.contracts.CWController.methods
      .getMintPriceByToken()
      .call({ from: this.defaultAccount });
    this.recruitCost = new BN(recruitCost).div(new BN(10).pow(18)).toFixed(2);
    this.loadConsumablesCount();
    setInterval(async () => {
      this.loadConsumablesCount();
    }, 3000);

    const heroAmount = await this.contracts.Characters.methods
      .availableAmount()
      .call({ from: this.defaultAccount });

    this.heroAmount = Number(heroAmount);
  },

  data() {
    return {
      recruitCost: "0",
      heroAmount: 0,
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
    ...mapState(['maxStamina', 'ownedCharacterIds',  'defaultAccount']),
    ...mapGetters(["contracts", 'getCharacterName', 'allStaminas', 'charactersWithIds']),


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
    },

    referralAddress() {
      // @ts-ignore
      const referralAddress = this.$route.query.r;
      if (referralAddress && referralAddress !== this.defaultAccount) {
        return referralAddress;
      }
      return '0x0000000000000000000000000000000000000000';
    },
  },

  watch: {
    async characterIdsToDisplay(characterIds) {
      await this.fetchCharacters(characterIds);
    }
  },

  methods: {
    ...mapActions(['fetchCharacters', 'mintCharacter']),

    getCharacterArt,

    async onMintCharacter() {
      // await this.mintCharacter(this.referralAddress ? this.referralAddress : '0x0000000000000000000000000000000000000000');
      try {
        await this.mintCharacter(this.referralAddress ? this. referralAddress : '0x0000000000000000000000000000000000000000');
      } catch (e) {
        this.$dialog.notify.error(
          "Could not mint character: insufficient funds or transaction denied."
        );
      }
    },

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

    async loadConsumablesCount() {
      this.haveRename = await this.fetchTotalRenameTags(); // the other type of call returned 0 on testnet but not on local
      this.haveChangeTraitFire =
        await this.fetchTotalCharacterFireTraitChanges();
      this.haveChangeTraitEarth =
        await this.fetchTotalCharacterEarthTraitChanges();
      this.haveChangeTraitWater =
        await this.fetchTotalCharacterWaterTraitChanges();
      this.haveChangeTraitLightning =
        await this.fetchTotalCharacterLightningTraitChanges();
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

.title{
  font-size: 20px;
  margin-top: 50px;
}

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
  border-radius: 0;
}

.price {
  font-size: 14px;
}

.small-hero-left {
  position: absolute;
  bottom: 10px;
}

.promotion-number {
  color: #f58b5b;
}


@media (min-width: 1248px) {
  .home .character-list {
    padding: 0 295px;
  }
}

@media (max-width: 576px) {
  .price {
    font-size: 10px;
  }
}

</style>
