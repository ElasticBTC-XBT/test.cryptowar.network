<template>
  <div v-bind:class="isDefault ? 'default-icon-wrapper' : 'nft-icon-wrapper'">
    <div
      v-if="!isDefault"
      class="nft-icon"
      v-tooltip="
        !isShop && {
          content: tooltipHtml,
          trigger: isMobile() ? 'click' : 'hover',
        }
      "
      @mouseover="hover = !isMobile() || true"
      @mouseleave="hover = !isMobile()"
    >
      <!-- show nft with id: nftId of type: nftfType (contract address?)
        either load properties here or wherever the list of nfts is created and pass in nft object-->
      <div
        v-if="nft.type === 'shield'"
        class="nft-details glow-container"
        ref="el"
        :class="['glow-' + (nft.stars || 0)]"
      >
        <img
          class="placeholder-shield"
          src="../assets/shield1.png"
          v-if="!isShop && nft.id < 10000"
        />
        <img
          class="placeholder-shield"
          src="../assets/shield2.png"
          v-if="!isShop && nft.id >= 10000 && nft.id < 25000"
        />
        <img
          class="placeholder-shield"
          src="../assets/shield2.png"
          v-if="isShop"
        />

        <div v-if="!isShop" class="trait">
          <span :class="nft.element.toLowerCase() + '-icon'"></span>
          <b-icon
            v-if="favorite"
            class="favorite-star"
            icon="star-fill"
            variant="warning"
          />
        </div>

        <span v-if="isShop" class="nft-supply"
          >Quantity: <span>{{ totalShieldSupply }}</span></span
        >
        <div v-if="!isShop" class="id">ID {{ nft.id }}</div>

        <div v-if="!isShop" class="stats">
          <div v-if="nft.stat1Value">
            <span
              :class="nft.stat1.toLowerCase() + '-icon'"
              class="mr-1 icon"
            ></span>
            <span :class="nft.stat1.toLowerCase()"
              >{{ nft.stat1 }} +{{ nft.stat1Value }}</span
            >
          </div>
          <div v-if="nft.stat2Value">
            <span
              :class="nft.stat2.toLowerCase() + '-icon'"
              class="mr-1 icon"
            ></span>
            <span :class="nft.stat2.toLowerCase()"
              >{{ nft.stat2 }} +{{ nft.stat2Value }}</span
            >
          </div>
          <div v-if="nft.stat3Value">
            <span
              :class="nft.stat3.toLowerCase() + '-icon'"
              class="mr-1 icon"
            ></span>
            <span :class="nft.stat3.toLowerCase()"
              >{{ nft.stat3 }} +{{ nft.stat3Value }}</span
            >
          </div>
        </div>
      </div>

      <div
        v-if="nft.type === 'SecretBox'"
        class="nft-details glow-container"
        ref="el"
        :class="['glow-' + (nft.stars || 0)]"
      >
        <img class="placeholder-box" :src="getBoxArt(nft.id)" v-if="isShop" />
        <h2 v-if="isShop" class="nft-name">{{ nft.name }}</h2>
        <div class="box-quantity-wrap">
          <div v-if="!isBlindBox" class="box-quantity">
            Supply left:
            <span v-if="isShop" class="nft-supply">{{
              isLoading ? 'Loading' : nft.supply
            }}</span>
          </div>
        </div>
      </div>

      <div
        v-if="nft.type !== 'shield' && nft.type !== 'SecretBox'"
        class="nft-details"
      >
        <img
          class="placeholder-consumable"
          :src="nft.image.startsWith('http') ? nft.image : imgPath(nft.image)"
        />
        <span v-if="isShop" class="nft-supply"
          >Owned: {{ this.quantityOwned }}</span
        >
      </div>
    </div>
  </div>
</template>

<script>
import { mapCacheActions } from 'vuex-cache'
import { getBoxArt } from '../box-art'
import { getEnemyArt } from '../enemy-art'
// Comment
export default {
  props: ['nft', 'isDefault', 'isShop', 'isLoading', 'favorite', 'isBlindBox'],
  computed: {
    tooltipHtml() {
      if (!this.nft) return ''

      const wrapInSpan = (spanClass, text) => {
        return `<span class="${spanClass.toLowerCase()}">${text}</span><span class="${
          spanClass.toLowerCase() + '-icon'
        }"></span>`
      }

      let ttHtml = `
        ID: ${this.nft.id}
        <br>
        ${Array(this.nft.stars + 1)
          .fill('★')
          .join('')}
      `
      if (this.nft.level > 0) {
        ttHtml += `<br>Level ${this.nft.level + 1}`
      }

      if (this.nft.element) {
        ttHtml += `<br>Element: ${wrapInSpan(
          this.nft.element,
          this.nft.element
        )}`
      }
      return ttHtml
    },
  },

  data() {
    return {
      totalShieldSupply: 0,
      fetchSupplyInterval: 0,
      fetchCommonBoxSupplyInterval: 0,
      fetchRareBoxSupplyInterval: 0,
      commonBoxSupply: 0,
      rareBoxSupply: 0,
      quantityOwned: 0,
      images: import.meta.glob('../assets/*.png'),
    }
  },

  methods: {
    ...mapCacheActions([
      'fetchTotalShieldSupply',
      'fetchTotalRenameTags',
      'fetchTotalWeaponRenameTags',
      'fetchTotalCharacterFireTraitChanges',
      'fetchTotalCharacterEarthTraitChanges',
      'fetchTotalCharacterWaterTraitChanges',
      'fetchTotalCharacterLightningTraitChanges',
      'fetchTotalRareBoxSupply',
      'fetchTotalCommonBoxSupply',
    ]),
    imgPath(img) {
      return this.images('./' + img)
    },
    getBoxArt,
  },

  async mounted() {
    if (this.nft.type === 'shield') {
      this.totalShieldSupply = 25000 - (await this.fetchTotalShieldSupply())
      this.fetchSupplyInterval = setInterval(async () => {
        this.totalShieldSupply = 25000 - (await this.fetchTotalShieldSupply())
      }, 3000)
    } else if (
      this.nft.type === 'CharacterRenameTag' ||
      this.nft.type === 'CharacterRenameTagDeal'
    ) {
      this.quantityOwned = await this.fetchTotalRenameTags()
      this.fetchSupplyInterval = setInterval(async () => {
        this.quantityOwned = await this.fetchTotalRenameTags()
      }, 3000)
    } else if (
      this.nft.type === 'WeaponRenameTag' ||
      this.nft.type === 'WeaponRenameTagDeal'
    ) {
      this.quantityOwned = await this.fetchTotalWeaponRenameTags()
      this.fetchSupplyInterval = setInterval(async () => {
        this.quantityOwned = await this.fetchTotalWeaponRenameTags()
      }, 3000)
    } else if (this.nft.type === 'CharacterFireTraitChange') {
      this.quantityOwned = await this.fetchTotalCharacterFireTraitChanges()
      this.fetchSupplyInterval = setInterval(async () => {
        this.quantityOwned = await this.fetchTotalCharacterFireTraitChanges()
      }, 3000)
    } else if (this.nft.type === 'CharacterEarthTraitChange') {
      this.quantityOwned = await this.fetchTotalCharacterEarthTraitChanges()
      this.fetchSupplyInterval = setInterval(async () => {
        this.quantityOwned = await this.fetchTotalCharacterEarthTraitChanges()
      }, 3000)
    } else if (this.nft.type === 'CharacterWaterTraitChange') {
      this.quantityOwned = await this.fetchTotalCharacterWaterTraitChanges()
      this.fetchSupplyInterval = setInterval(async () => {
        this.quantityOwned = await this.fetchTotalCharacterWaterTraitChanges()
      }, 3000)
    } else if (this.nft.type === 'CharacterLightningTraitChange') {
      this.quantityOwned = await this.fetchTotalCharacterLightningTraitChanges()
      this.fetchSupplyInterval = setInterval(async () => {
        this.quantityOwned =
          await this.fetchTotalCharacterLightningTraitChanges()
      }, 3000)
    } else if (this.nft.type === 'SecretBox') {
      this.fetchCommonBoxSupplyInterval = setInterval(async () => {
        this.commonBoxSupply = await this.fetchTotalCommonBoxSupply()
      }, 3000)

      this.fetchRareBoxSupplyInterval = setInterval(async () => {
        this.rareBoxSupply = await this.fetchTotalRareBoxSupply()
      }, 3000)
    }
  },

  beforeDestroy() {
    clearInterval(this.fetchSupplyInterval)
    clearInterval(this.fetchCommonBoxSupplyInterval)
    clearInterval(this.fetchRareBoxSupplyInterval)
  },
}
</script>

<style scoped>
.nft-icon {
  height: 80%;
  width: 100%;
  /* background: rgba(255, 255, 255, 0.1); */
}
/* .nft-icon-wrapper {
  width: 12em;
  height: 12em;
} */
.default-icon-wrapper {
  width: 8em;
  height: 8em;
  margin: 5px;
}
.default-placeholder {
  max-width: 100px;
  max-height: 100px;
  margin-left: 12px;
  margin-top: 8px;
  transform: scale(1);
}
.placeholder-weapon {
  max-width: 180px;
  max-height: 180px;
  margin-left: 10px;
  margin-top: 5px;
  transform: scale(0.7);
}

.placeholder-shield {
  max-width: 160px;
  max-height: 200px;
  margin-top: -10px;
}

.placeholder-box {
  width: 269px;
  height: 269px;
}

.placeholder-consumable {
  height: 100%;
  transform: scale(0.7);
}

@media (max-width: 1024px) {
  .placeholder-box {
    max-width: 200px;
    max-height: 200px;
  }
}

/* .nft-supply {
  position: absolute;
  bottom: -25px;
  left: 0;
  right: 0;
  font-weight: 800;
  font-size: 18px;
}

.nft-supply span{
  color: #EA8659;
}

.nft-name {
  position: absolute;
  bottom: 5px;
  left: 0;
  right: 0;
  font-weight: 800;
  margin: 4px 0;
} */

.nft-details {
  text-align: center;
  height: 100%;
  position: relative;
  align-items: center;
  flex-direction: column;
  justify-content: space-around;
  padding: 30px 0;
}

.trait,
.id,
.stats {
  position: absolute;
}

.id {
  top: 8px;
  right: 10px;
  font-style: italic;
}

.trait {
  top: 10px;
  left: 10px;
}

.stats {
  top: 35px;
  left: 10px;
}

.favorite-star {
  position: absolute;
  margin-left: 3px;
  margin-top: 2px;
}

.glow-container {
  height: 100%;
  width: 100%;
}

.glow-container {
  border-radius: 5px;
  z-index: 540;
}

.glow-0 {
  animation: none;
  display: flex;
  justify-content: center;
  align-items: center;
}

.glow-1 {
  animation: glow-1 2000ms ease-out infinite alternate;
}

.glow-2 {
  animation: glow-2 2000ms ease-out infinite alternate;
}

.glow-3 {
  animation: glow-3 2000ms ease-out infinite alternate;
}

.glow-4 {
  animation: glow-4 2000ms ease-out infinite alternate;
}

@keyframes glow-1 {
  0% {
    box-shadow: inset 0 0 10px rgba(0, 162, 255, 0.5);
  }
  100% {
    box-shadow: inset 0 0 15px rgba(0, 162, 255, 0.5);
  }
}

@keyframes glow-2 {
  0% {
    box-shadow: inset 0 0 10px rgba(125, 0, 125, 0.5);
  }
  100% {
    box-shadow: inset 0 0 20px rgba(125, 0, 125, 0.5);
  }
}

@keyframes glow-3 {
  0% {
    box-shadow: inset 0 0 10px rgba(255, 102, 0, 0.3);
  }
  100% {
    box-shadow: inset 0 0 25px rgba(255, 102, 0, 0.3);
  }
}

@keyframes glow-4 {
  0% {
    box-shadow: inset 0 0 10px rgba(125, 0, 0, 0.5);
  }
  100% {
    box-shadow: inset 0 0 30px rgba(125, 0, 0, 0.5);
  }
}
</style>
