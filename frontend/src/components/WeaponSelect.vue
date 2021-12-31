<template>
  <div
    class="weapon-icon"
  >
  <div class="container">
      <div class="containerTop">
          <div class="containerColumn">
            <span :class="weapon.element.toLowerCase() + '-icon'"></span>
            <!-- <div :v-for="r in Array(this.weapon.stars + 1).fill('*')">
                <span>{{r}}</span>
                </div> -->
            <div class="stats">
                <div v-if="weapon.stat1Value" class="wrapStat">
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
          <span class="idWeapon">ID {{this.weapon.id}}</span>
      </div>
  </div>
  <div>
      <img
      v-if="showPlaceholder"
      class="placeholder"
      :src="getWeaponArt(weapon)" />
  </div>
    <div class="name">
        {{ getCleanWeaponName(weapon.id, weapon.stars) }}
      </div>
    <div>
        <div class="small-durability-bar"
        :style="`--durabilityReady: ${(getWeaponDurability(weapon.id)/maxDurability)*100}%;`"
        v-tooltip.bottom="`Durability: ${getWeaponDurability(weapon.id)}/${maxDurability}<br>
          Repairs 1 point every 50 minutes, durability will be full at: ${timeUntilWeaponHasMaxDurability(weapon.id)}`"></div>
      </div>

    <!-- <div class="glow-container" ref="el"> -->
      <!-- <div class="glow-img-box"> -->
      <!-- <img
      v-if="showPlaceholder"
      class="placeholder"
      :src="getWeaponArt(weapon)" /> -->
      <!-- </div> -->
      <!-- <div class="trait">
        <span :class="weapon.element.toLowerCase() + '-icon'"></span>
            <div :v-for="r in Array(this.weapon.stars + 1).fill('*')">
            <span>{{r}}</span></div> -->
        <!-- <div class="yellowStar"> -->
            <!-- {{Array(this.weapon.stars + 1).fill('★').join('')}} -->
        <!-- </div> -->
      <!-- </div>

      <div class="name">
        {{ getCleanWeaponName(weapon.id, weapon.stars) }}
      </div>

      <div class="bonus-power">
        <div v-if="weapon.lowStarBurnPoints > 0"><span>{{ weapon.lowStarBurnPoints }} LB</span></div>
        <div v-if="weapon.fourStarBurnPoints > 0"><span>{{ weapon.fourStarBurnPoints }} 4B</span></div>
        <div v-if="weapon.fiveStarBurnPoints > 0"><span>{{ weapon.fiveStarBurnPoints }} 5B</span></div>
      </div>

      <div>
        <div class="small-durability-bar"
        :style="`--durabilityReady: ${(getWeaponDurability(weapon.id)/maxDurability)*100}%;`"
        v-tooltip.bottom="`Durability: ${getWeaponDurability(weapon.id)}/${maxDurability}<br>
          Repairs 1 point every 50 minutes, durability will be full at: ${timeUntilWeaponHasMaxDurability(weapon.id)}`"></div>
      </div> -->

      <!-- <div class="weapon-bt-box" v-if="isSell">
        <b-button @click="sellClick()">
          Sell
        </b-button>
      </div> -->
    <!-- </div> -->

    <!-- <div class="id">
      ID {{ weapon.id }}<br>
      <b-icon v-if="favorite" class="favorite-star" icon="star-fill" variant="warning" />
    </div> -->

    <!-- <div class="stats">
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
    console.log('1234', this.weapon);
    this.allLoaded = true;
    this.showPlaceholder = true;
    return;
  }
};

</script>

<style scoped>
.small-durability-bar {
  position: relative;
  top: 0px;
  height: 12px;
  width: 80%;
  margin: 0 auto;
  border-radius: 4px;
  background-color : #ddb73c;
}

.weapon-icon {
    display: flex;
    flex-direction: column;
    /* justify-content: center; */
    align-items: center;
  background-image: url("../assets/images/bg-item-top.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-position: center;
  /* width: 299px; */
  height: 432px;
}

.glow-container {
  border-radius: 5px;
  z-index: 540;
}

.weapon.selected .glow-container{
  /* border: 1px solid rgb(255 255 255 / 41%); */
  background-color: rgb(255 255 255 / 7%);
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

.id, .trait {
  position: absolute;
}

.stats {
    margin-top: 10px;
}

.trait {
  top: 10px;
  left: 10px;
}

.favorite-star {
  position: absolute;
  right: 4px;
  font-size: 0.8rem;
}

.id {
  top: 8px;
  right: 10px;
  font-style: italic;
}

.stats {
  /* left: 3rem; */
}

.icon {
  display: inline-block;
  min-width: 18px;
}

.placeholder {
  max-width: 208px;
  max-height: 208px;
  /* margin-left: 16px; */
  /* margin-top: 0px; */
  transform: scale(0.5);
}

.name {
  font-size: 1.12em;
  font-weight: bold;
  text-align: center;
}

.weapon-market .name{
  bottom: 4rem;
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

.glow-img-box{
  display: flex;
  justify-content: center;
  align-items: flex-end;
}

.glow-img-box img{
  margin: 0;
}

.idWeapon {
    font-size: 21px;
    height: 25px;
    font-weight: 600;
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

.containerLeftInfor {
    display: flex;
    /* align-items: center; */
    flex-direction: column;
}

.wrapStat {
    display: flex;
    align-items: center;
}

.glow-0 {
  animation: none;
   /* display: flex; */
  justify-content: center;
  align-items: center;
  /* box-shadow: inset 0 0 5px rgba(255, 255, 255, 0.411);; */
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

.yellowStar {
    width: 20.4px;
  height: 19.5px;
  box-shadow: 0 3px 6px 0 rgba(0, 0, 0, 0.16);
  background-image: linear-gradient(to bottom, #fcf738, #fab42b);
}

.bonus-power {
  position: absolute;
  top: 45px;
  right: 5%;
  font-size: 0.6em;
  text-align: right;
}

.containerTop {
    display: flex;
    justify-content: space-between;
    width: 100%;
    padding-left: 1rem;
    padding-right: 1rem;
}

.containerColumn {
    display: flex;
    flex-direction: column;
    align-items: flex-start;
}

@keyframes glow-1 {
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
}
</style>
