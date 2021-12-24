<template>
  <div
    class="weapon-icon"
    v-bind:class="[getWeaponDurability(weapon.id) === 0 ? 'no-durability' : '']"
    v-tooltip="{ content: tooltipHtml , trigger: (isMobile() ? 'click' : 'hover') }"
    @mouseover="hover = !isMobile() || true"
    @mouseleave="hover = !isMobile()"
  >

    <div class="loading-container" v-if="!allLoaded">
      <i class="fas fa-spinner fa-spin"></i>
    </div>

    <div class="weapon-header">
      <div>
        <div class="trait">
          <span :class="weapon.element.toLowerCase() + '-icon'"></span>
          <span class="weapon-star" v-for="n in this.weapon.stars + 1" :key="n">
            <i class="fas fa-star"></i>
          </span>
        </div>

        <div class="stats">
          <div v-if="weapon.stat1Value">
            <span :class="weapon.stat1.toLowerCase() + '-icon'" class="mr-2 icon"></span>
            <span :class="weapon.stat1.toLowerCase()">{{ weapon.stat1 }} +{{ weapon.stat1Value }}</span>
          </div>
          <div v-if="weapon.stat2Value">
            <span :class="weapon.stat2.toLowerCase() + '-icon'" class="mr-2 icon"></span>
            <span :class="weapon.stat2.toLowerCase()">{{ weapon.stat2 }} +{{ weapon.stat2Value }}</span>
          </div>
          <div v-if="weapon.stat3Value">
            <span :class="weapon.stat3.toLowerCase() + '-icon'" class="mr-2 icon"></span>
            <span :class="weapon.stat3.toLowerCase()">{{ weapon.stat3 }} +{{ weapon.stat3Value }}</span>
          </div>
        </div>
      </div>

      <div>
        <div class="id">
          ID {{ weapon.id }}
          <!-- <br><b-icon v-if="favorite" class="favorite-star" icon="star-fill" variant="warning" /> -->
        </div>


        <div class="bonus-power">
          <div v-if="weapon.lowStarBurnPoints > 0"><span>{{ weapon.lowStarBurnPoints }} LB</span></div>
          <div v-if="weapon.fourStarBurnPoints > 0"><span>{{ weapon.fourStarBurnPoints }} 4B</span></div>
          <div v-if="weapon.fiveStarBurnPoints > 0"><span>{{ weapon.fiveStarBurnPoints }} 5B</span></div>
        </div>
      </div>
    </div>

    <div class="glow-img-box">
      <img v-if="showPlaceholder" class="placeholder" :src="getWeaponArt(weapon)" />
    </div>

    <div class="name">
      {{ getCleanWeaponName(weapon.id, weapon.stars) }}
    </div>

    <div class="small-durability-bar-wrap">
      <div
        class="small-durability-bar"
        :style="`--durabilityReady: ${(getWeaponDurability(weapon.id)/maxDurability)*100}%;`"
        v-tooltip.bottom="`Durability: ${getWeaponDurability(weapon.id)}/${maxDurability}<br>
        Repairs 1 point every 50 minutes, durability will be full at: ${timeUntilWeaponHasMaxDurability(weapon.id)}`"
      ></div>
    </div>
      <!--
      <div class="weapon-bt-box default-contrast" v-if="isSell">
        <b-button @click="sellClick()">
          Sell
        </b-button>
      </div> -->
  </div>
</template>

<script>
import { getWeaponArt } from '../weapon-arts-placeholder';
import '@/mixins/general';
import { Stat1PercentForChar,
  Stat2PercentForChar,
  Stat3PercentForChar
} from '../interfaces';

import { mapGetters, mapState } from 'vuex';
import { getCleanName } from '../rename-censor';


export default {
  props: ['weapon', 'favorite', 'isSell', 'sellClick'],

  computed: {
    ...mapState(['maxDurability']),
    ...mapGetters([
      'currentCharacter',
      'getWeaponDurability',
      'timeUntilWeaponHasMaxDurability',
      'getWeaponName'
    ]),
    tooltipHtml() {
      if(!this.weapon) return '';

      const wrapInSpan = (spanClass, text) => {
        return `<span class="${spanClass.toLowerCase()}">${text}</span><span class="${spanClass.toLowerCase()+'-icon'}"></span>`;
      };

      const wrapInSpanTextOnly = (spanClass, text) => {
        return `<span class="${spanClass.toLowerCase()}">${text}</span>`;
      };

      let ttHtml = `
        ID: ${this.weapon.id}
        <br>
        ${Array(this.weapon.stars + 1).fill('★').join('')}
      `;
      if(this.weapon.level > 0) {
        ttHtml += `<br>Level ${this.weapon.level + 1}`;
      }

      if(this.weapon.element) {
        ttHtml += `<br>Element: ${wrapInSpan(this.weapon.element, this.weapon.element)}`;
      }

      if(this.weapon.stat1Value) {
        ttHtml += `<br>${wrapInSpan(this.weapon.stat1, this.weapon.stat1)}: +${this.weapon.stat1Value}`;
        if(this.currentCharacter) {
          ttHtml += ` (${wrapInSpanTextOnly(
            this.currentCharacter.traitName,
            '+'+Stat1PercentForChar(this.weapon, +this.currentCharacter.trait)+'%')
          })`;
        }
      }

      if(this.weapon.stat2Value) {
        ttHtml += `<br>${wrapInSpan(this.weapon.stat2, this.weapon.stat2)}: +${this.weapon.stat2Value}`;
        if(this.currentCharacter) {
          ttHtml += ` (${wrapInSpanTextOnly(
            this.currentCharacter.traitName,
            '+'+Stat2PercentForChar(this.weapon, +this.currentCharacter.trait)+'%')
          })`;
        }
      }

      if(this.weapon.stat3Value) {
        ttHtml += `<br>${wrapInSpan(this.weapon.stat3, this.weapon.stat3)}: +${this.weapon.stat3Value}`;
        if(this.currentCharacter) {
          ttHtml += ` (${wrapInSpanTextOnly(
            this.currentCharacter.traitName,
            '+'+Stat3PercentForChar(this.weapon, +this.currentCharacter.trait)+'%')
          })`;
        }
      }

      if(this.weapon.lowStarBurnPoints > 0) {
        ttHtml += `<br>LB: ${this.weapon.lowStarBurnPoints}/100`;
      }

      if(this.weapon.fourStarBurnPoints > 0) {
        ttHtml += `<br>4B: ${this.weapon.fourStarBurnPoints}/25`;
      }

      if(this.weapon.fiveStarBurnPoints > 0) {
        ttHtml += `<br>5B: ${this.weapon.fiveStarBurnPoints}/10`;
      }

      if(this.weapon.bonusPower > 0) {
        ttHtml += `<br>Bonus power: ${this.weapon.bonusPower}`;
      }

      return ttHtml;
    }
  },

  data() {
    return {
      hover: false,
      allLoaded: false,
      allLoadStarted: false,
      camera: null,
      scene: null,
      renderer: null,
      baseMaterial: null,
      loadCount: 0,
      loadCountTotal: 0,
      pommel: null,
      grip: null,
      crossGuard: null,
      blade: null,
      group: null,
      bladeMaskTexture: null,
      bladeNormalTexture: null,
      bladeAOTexture: null,
      crossGuardNormalTexture: null,
      crossGuardAOTexture: null,
      gripMaskTexture: null,
      gripNormalTexture: null,
      gripAOTexture: null,
      pommelNormalTexture: null,
      pommelAOTexture: null,
      showPlaceholder: false,
    };
  },

  methods: {
    getWeaponArt,
    getCleanWeaponName(id, stars) {
      return getCleanName(this.getWeaponName(id, stars));
    }
  },
  mounted() {
    this.allLoaded = true;
    this.showPlaceholder = true;
    return;
  }
};

</script>

<style scoped>
.loading-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  z-index: 541;
  padding: 0;
}

.weapon-header {
  display: flex;
  justify-content: space-between;
}

.weapon-header .id {
  font-size: 21px;
}

.weapon-header .trait,
.weapon-header .stats div {
  display: flex;
  align-items: center;
}

.weapon-header .stats {
  margin-top: 8px;
  font-size: 18px;
}

.weapon-header .trait span:first-child {
  margin-right: 4.5px;
}

.weapon-star {
  font-size: 20px;
  line-height: 20px;
  color: #FBD231;
  margin: 0 2.2px;
}

.weapon-icon .icon {
  width: 35px;
  height: 35px;
}

.glow-img-box{
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.placeholder {
  max-width: 180px;
  max-height: 180px;
  margin-left: 16px;
  margin-top: 0px;
  transform: scale(0.8);
}

.weapon-icon .name {
  font-size: 18px;
  font-weight: bold;
  text-align: center;
  margin-top: 15px;
  display: -webkit-box;
  -webkit-line-clamp: 1;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.small-durability-bar-wrap {
  margin-top: 15px;
}

.small-durability-bar {
  height: 13.44px;
  width: 100%;
  border-radius: 16px;
  background : linear-gradient(to right, #DDB73C var(--durabilityReady), rgba(255, 255, 255, 0.1) 0);
}

@media (max-width: 576px) {
  .weapon-header {
    position: relative;
    padding-top: 20px !important;
  }

  .weapon-header .trait span:first-child,
  .weapon-icon .icon {
    width: 22px;
    height: 22px;
  }

  .weapon-star,
  .weapon-header .stats div {
    font-size: 14px;
  }

  .weapon-header .id {
    font-size: 14px;
    text-align: center;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
  }

  .placeholder {
    max-width: 131px;
    max-height: 131px;
  }

  .weapon-icon .name {
    font-size: 14px;
    margin-top: 8px;
  }

  .small-durability-bar-wrap {
    margin-top: 5.7px;
  }

  .small-durability-bar {
    height: 8.52px;
  }
}

.weapon-bt-box{
  position: absolute;
  bottom: 15px;
  display: flex;
  width: 100%;
  justify-content: center;
}

.sell-grid .glow-img-box, .weapon-grid .glow-img-box{
  padding-top: 1rem;
}

.confirmReforge .glow-img-box img, .modal-body .glow-img-box img {
  max-width: 7rem;
  margin-top: 1.5rem;
  padding-bottom: 0.5rem;
}


.confirmReforge .small-durability-bar, .modal-body .small-durability-bar{
  top: -10px
}

.confirmReforge .name, .modal-body .name{
  bottom: 5px;
}

/* .glow-container {
  height: 100%;
  width: 100%;
  border-radius: 5px;
  z-index: 540;
}

.weapon.selected .glow-container{
  border: 1px solid rgb(255 255 255 / 41%);
  background-color: rgb(255 255 255 / 7%);
  background-color: rgb(255 255 255 / 30%);
  border: 1px solid rgb(255, 165, 0);
  filter: contrast(200%);
}

.weapon.selected .glow-container .default-contrast{
  filter: contrast(40%);
}

.weapon.selected .glow-container.glow-0{
  box-shadow: inset 0 0 10px rgb(255, 165, 0);
}

.glow-img-box img{
  margin: 0;
}

.glow-0 {
  animation: none;
  display: flex;
  justify-content: center;
  align-items: center;
  box-shadow: inset 0 0 5px rgba(255, 255, 255, 0.411);;
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
} */

.no-durability {
  opacity: 0.6;
}

.bonus-power {
  position: absolute;
  top: 45px;
  right: 5%;
  font-size: 0.6em;
  text-align: right;
}

/* @keyframes glow-1 {
  0% {
    box-shadow: inset 0 0 10px rgba(9, 163, 252, 1);
  }
  100% {
    box-shadow: inset 0 0 20px rgba(27, 162, 240, 1);
  }
}

@keyframes glow-2 {
  0% {
    box-shadow: inset 0 0 10px rgba(157, 250, 8, 0.8);
  }
  100% {
    box-shadow: inset 0 0 20px rgba(157, 250, 8, 0.8);
  }
}

@keyframes glow-3 {
  0% {
    box-shadow: inset 0 0 10px rgba(255, 148, 61, 1);
  }
  100% {
    box-shadow: inset 0 0 30px rgb(238, 95, 0);
  }
}

@keyframes glow-4 {
  0% {
    box-shadow: inset 0 0 10px rgba(197, 77, 233, 1);
  }
  100% {
    box-shadow: inset 0 0 30px rgba(197, 77, 233, 1);
  } */
</style>
