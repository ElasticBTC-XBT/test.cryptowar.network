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

    <div class="glow-container" ref="el" :class="['glow-' + (weapon.stars || 0)]">
      <div class="glow-img-box">
      <img v-if="showPlaceholder" class="placeholder" :src="getWeaponArt(weapon)" />
      </div>
      <div class="trait">
        <span :class="weapon.element.toLowerCase() + '-icon'"></span>
        {{Array(this.weapon.stars + 1).fill('★').join('')}}
      </div>

      <div class="name">
        {{ getCleanWeaponName(weapon.id, weapon.stars) }}
      </div>

      <div class="bonus-power">
        <div v-if="weapon.lowStarBurnPoints > 0"><span>{{ weapon.lowStarBurnPoints }} LB</span></div>
        <div v-if="weapon.fourStarBurnPoints > 0"><span>{{ weapon.fourStarBurnPoints }} 4B</span></div>
        <div v-if="weapon.fiveStarBurnPoints > 0"><span>{{ weapon.fiveStarBurnPoints }} 5B</span></div>
      </div>

      <div class="small-durability-bar">
        <div
        :style="`--durabilityReady: ${(getWeaponDurability(weapon.id)/maxDurability)*100}%;`"
        v-tooltip.bottom="`Durability: ${getWeaponDurability(weapon.id)}/${maxDurability}<br>
          Repairs 1 point every 50 minutes, durability will be full at: ${timeUntilWeaponHasMaxDurability(weapon.id)}`">
        </div>
      </div>

      <div class="weapon-bt-box" v-if="isSell">
        <b-button @click="sellClick()">
          SELL
        </b-button>
      </div>
    </div>

    <div class="id">
      ID {{ weapon.id }}<br>
      <b-icon v-if="favorite" class="favorite-star" icon="star-fill" variant="warning" />
    </div>

    <div class="stats">
      <div v-if="weapon.stat1Value">
        <span :class="weapon.stat1.toLowerCase() + '-icon'" class="mr-1 icon"></span>
        <span :class="weapon.stat1.toLowerCase()">{{ weapon.stat1 }} +{{ weapon.stat1Value }}</span>
      </div>
      <div v-if="weapon.stat2Value">
        <span :class="weapon.stat2.toLowerCase() + '-icon'" class="mr-1 icon"></span>
        <span :class="weapon.stat2.toLowerCase()">{{ weapon.stat2 }} +{{ weapon.stat2Value }}</span>
      </div>
      <div v-if="weapon.stat3Value">
        <span :class="weapon.stat3.toLowerCase() + '-icon'" class="mr-1 icon"></span>
        <span :class="weapon.stat3.toLowerCase()">{{ weapon.stat3 }} +{{ weapon.stat3Value }}</span>
      </div>
    </div>
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

.small-durability-bar {
  background: url("../assets/v2/xp_bg.svg");
  background-repeat: no-repeat;
  background-size: contain;
  height: 16px;
  width: 210px;
  margin: auto;
  margin-top: 70px;
}

.small-durability-bar > div {
  width: var(--durabilityReady);
  height: 15px;
  border-radius: 4px;
  background: url("../assets/v2/xp_progress.svg");
  background-repeat: no-repeat;
  background-size: cover;
  /* background : linear-gradient(to right, rgb(142, 30, 165) var(--durabilityReady), rgba(255, 255, 255, 0.1) 0); */
}

.weapon-icon {
  position: relative;
}

.glow-container {
  height: 100%;
  width: 100%;
  border-radius: 5px;
  z-index: 540;
}

.weapon.selected .glow-container{
  /* border: 1px solid rgb(255 255 255 / 41%); */
  /* background-color: rgb(255 255 255 / 7%); */
  /* background-color: rgb(255 255 255 / 30%);
  border: 1px solid rgb(255, 165, 0); */
  filter: contrast(200%);
}


.weapon.selected .glow-container.glow-0{
  /* box-shadow: inset 0 0 10px rgb(255, 165, 0); */
}

.loading-container {
  height: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  z-index: 541;
  padding: 0;
}

.id, .trait, .stats {
  position: absolute;
}

.stats > div {
  display: flex;
  align-items: center;
}

.trait {
  top: -75px;
  left: 15px;
  display: flex;
  align-items: center;
  color: yellow;
  font-size: 25px;
}

.favorite-star {
  position: absolute;
  right: 4px;
  font-size: 0.8rem;
}

.id {
  top: -70px;
  right: 15px;
  font-size: 18px;
}

.stats {
  top: -30px;
  left: 15px;
}

.icon {
  display: inline-block;
  min-width: 18px;
}

.placeholder {
  max-width: 220px;
  max-height: 220px;
  transform: scale(0.8);
}

.name {
  position: absolute;
  bottom: 2rem;
  left: 12%;
  right: 12%;
  font-size: 1em;
  text-align: center;
  bottom: 30px;
  font-weight: bold;
}

.weapon-bt-box{
  position: absolute;
  bottom: -77px;
  display: flex;
  width: 100%;
  justify-content: center;
}

.weapon-bt-box button{
  background: url("../assets/v2/shop_nft_btn.svg");
  background-repeat: no-repeat;
  background-size: contain;
  width: 170px;
  height: 40px;
  border: none;
  border-radius: 0;
  margin: 0;
  font-weight: bold;
  font-size: 18px;
}

.sell-grid .glow-img-box, .weapon-grid .glow-img-box{
  margin-top: 90px;
}

.glow-img-box{
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.glow-img-box img{
  margin: 0;
}

.confirmReforge .glow-img-box img, .modal-body .glow-img-box img {
  max-width: 7rem;
  margin-top: 1.5rem;
  padding-bottom: 0.5rem;
}

.confirmReforge .name, .modal-body .name{
  bottom: 5px;
}

.glow-0 {
  animation: none;
   /* display: flex; */
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
  }
} */
</style>
