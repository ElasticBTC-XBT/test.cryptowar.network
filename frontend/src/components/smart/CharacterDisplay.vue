<template>
  <div class="character-display-container"
    @mouseover="hover = !isMobile() || true"
    @mouseleave="hover = !isMobile()">
    <transition name="slide-fade">
      <!-- <div class="row chara-head-box" :class="[getIsCharacterViewExpanded?'':'chara-head-close']">
        <div class="col-sm-12 root main-font">
          <div class="character-portrait">
            <CharacterArt
              v-if="!isLoadingCharacter"
              :character="currentCharacter"
              :portrait="true"
            />
            <span v-if="isLoadingCharacter" style="position: relative">
              <div class="loading-container">
                <i class="fas fa-spinner fa-spin"></i>
              </div>
            </span>
          </div>

          <div class="character-data-column dark-bg-text">
            <span v-if="!isLoadingCharacter" class="name character-name"
              >{{ getCleanCharacterName(currentCharacterId) }}
              <span
                :class="
                  traits[currentCharacter.trait].toLowerCase() +
                  '-icon trait-icon'
                "
              ></span
            ></span>
            <span v-if="isLoadingCharacter" class="name">Loading...</span>
            <div v-if="!isLoadingCharacter" class="subtext subtext-stats">
              <p>
                <span>Level </span>
                <span
                  >{{ currentCharacter.level + 1 }} ({{ currentCharacter.xp }} /
                  {{ RequiredXp(currentCharacter.level).toLocaleString() }} XP)
                </span>
              </p>
              <p>
                <span>Power: </span>
                <span
                  >{{ CharacterPower(currentCharacter.level).toLocaleString() }}
                </span>
                <Hint
                  class="power-hint"
                  text="Power increases by 10 every level up,
              <br>and multiplied every 10 level ups
              <br>Level 1: 1000
              <br>Level 10: 1090
              <br>Level 11: 2200
              <br>Level 20: 2380
              <br>Level 21: 3600"
                />
              </p>
            </div>
          <earnings-calculator />
          </div>
        </div>
      </div> -->
    </transition>

    <div class="character-full-list">
      <ul
        class="character-list"
        v-bind:class="[
          getIsInCombat ? 'disabled-li' : '',
          getIsCharacterViewExpanded ? '' : 'centered-list',
        ]"
      >
        <li
          :class="`${setListClassForSelChar(c.id, currentCharacterId)}`"
          :style="`--staminaReady: ${
            (getCharacterStamina(c.id) / maxStamina) * 100
          }%;`"
          v-for="c in filteredCharactersForList"
          :key="c.id"
          @click="!getIsInCombat && setCurrentCharacter(c.id) && alert(c.id)"
          v-tooltip="{content: `Power: ${CharacterPower(c.level).toLocaleString()}<br>
          <span>Level </span>
          <span
            >${ c.level + 1 } (${ c.xp } /
            ${ RequiredXp(c.level).toLocaleString() } XP)
          </span>`, trigger: (isMobile() ? 'click' : 'hover')}"
        >
          <div class="element-icon"><span
            :class="
              traits[c.trait].toLowerCase() +
              '-icon trait-icon'
            "
            ></span>
          </div>
          <div>
            <div class="name-list">
            <div>{{ getCleanCharacterName(c.id) }} </div> Lv.{{ c.level + 1 }}
            </div>
            <div
              v-if="getCharacterStamina(c.id) === maxStamina"
              class="small-stamina-char"
              :style="`--staminaReady: ${
                (getCharacterStamina(c.id) / maxStamina) * 100
              }%;`"
            >
              <div class="stamina-text">
                STA {{ getCharacterStamina(c.id) }} / 200
              </div>
            </div>
            <div
              v-if="getCharacterStamina(c.id) !== maxStamina"
              class="small-stamina-char"
              :style="`--staminaReady: ${
                (getCharacterStamina(c.id) / maxStamina) * 100
              }%;`"
              v-tooltip.bottom="{content: toolTipHtml(timeUntilCharacterHasMaxStamina(c.id), getTimeStamina(c.level + 1)), trigger: (isMobile() ? 'click' : 'hover')}
              "
            >
              <div class="stamina-text">
                STA {{ getCharacterStamina(c.id) }} / 200
              </div>
            </div>
          </div>
        </li>
      </ul>
    </div>

    <!-- <div class="character-list-mobile" v-if="isMobile()">
      <ul>
        <li
          class="{selectedCharactersLiClass}"
          v-for="c in filteredCharactersForList"
          :key="c.id"
          @click="!getIsInCombat && setCurrentCharacter(c.id)"
        >
          <div class="name-list">
            {{ getCleanCharacterName(c.id) }} Lv.{{ c.level + 1 }}
            <small-bar
              :showMinimalVersion="true"
              v-if="!isLoadingCharacter"
              :current="getCharacterStamina(c.id)"
              :max="maxStamina"
            />
          </div>
        </li>
      </ul>
    </div> -->
  </div>
</template>

<script lang="ts">
import { mapGetters, mapState, mapMutations } from "vuex";
import { getCharacterArt } from "../../character-arts-placeholder";
// import SmallBar from "../SmallBar.vue";
// import CharacterArt from "../CharacterArt.vue";
import { CharacterPower, CharacterTrait } from "../../interfaces";
import { RequiredXp } from "../../interfaces";
// import Hint from "../Hint.vue";
import Vue from "vue";
import { toBN, fromWeiEther } from "../../utils/common";
import { getCleanName } from "../../rename-censor";

export default Vue.extend({
  components: {
    // CharacterArt,
    // SmallBar,
    // Hint,
  },

  computed: {
    ...mapState(["maxStamina", "currentCharacterId", "ownedCharacterIds", "secondsPerStamina"]),
    ...mapGetters([
      "currentCharacter",
      "currentCharacterStamina",
      "getCharacterName",
      "getCharacterStamina",
      "charactersWithIds",
      "ownCharacters",
      "timeUntilCharacterHasMaxStamina",
      "getSecondPerStamina",
      "getIsInCombat",
      "getIsCharacterViewExpanded",
      "fightGasOffset",
      "fightBaseline",
      "minutesPerStamina"
    ]),

    isLoadingCharacter(): boolean {
      return !this.currentCharacter;
    },

    filteredCharactersForList(): any {
      const items: any = this.ownCharacters;
      return items;
    },
  },

  data() {
    return {
      traits: CharacterTrait,
      isPlaza: false,
      staminaTimer: 0
    };
  },
  methods: {
    ...mapMutations(["setCurrentCharacter"]),
    getCharacterArt,
    CharacterPower,
    RequiredXp,

    setListClassForSelChar(id: string, currentCharId: string): any {
      if (id === currentCharId) {
        return "character-highlight";
      } else return "character";
    },

    getTimeStamina(level: any){
      if(level === 1){
        return (420 / 60).toFixed(2);
      }

      else if(level >= 2 && level <= 29){
        return (((level - 2) *  21 + 462) / 60).toFixed(2);
      }

      else if(level >= 30 && level <= 54){
        return (((level - 30) *  81 + 4050) / 60).toFixed(2);
      }

      else
        return (6000 / 60).toFixed(2);
    },

    toolTipHtml(time: string, minutesPerStamina: string): string {
      return (
        `Regenerates 1 point every ${minutesPerStamina} minutes, stamina bar will be full at: ` +
        time
      );
    },

    formattedSkill(skill: number): number {
      const skillBalance = fromWeiEther(skill.toString());
      return toBN(skillBalance).toNumber();
    },

    getCleanCharacterName(id: string): string {
      return getCleanName(this.getCharacterName(id));
    },
  },
});
</script>

<style scoped>
.root {
  display: inline-flex;
  width: 100%;
}

.chara-head-close{
  max-height: 0px;
  /* overflow: hidden; */
}

.character-data-column {
  display: flex;
  flex-direction: column;
}

.character-data-column > * + * {
  margin-top: 0.375rem;
}

.character-data-column .name {
  font-size: 1.9rem;
}

.character-data-column .subtext {
  font-size: 1rem;
}

.character-data-column .bar {
  height: 1rem;
}

.power-hint {
  font-size: 1.3rem;
}

div.character-list {
  width: 70%;
}

ul.character-list {
  float: right;
  margin: 0px;
}

li.character {
  background: #F58B5B;
  padding: 0.5rem 0.5rem 0.5rem;
  margin: 5px;
  vertical-align: middle;
  cursor: pointer;
  border-radius: 10px;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  /* border: 2px solid #5D5A62; */
}

li.character .element-icon{
  width: 50px;
  height: 45px;
}

li.character-highlight {
  border: solid #9e8a57 3px;
  /* font-weight: 800; */
  /* padding: 5px; */
  padding: 0.5rem 0.5rem 0.5rem;
  border-radius: 10px;
  margin: 10x;
  vertical-align: middle;
  cursor: pointer;
  display: flex;
  justify-content: space-evenly;
  align-items: center;
}

li.character-highlight .element-icon{
  width: 50px;
  height: 45px;
}

.name-list {
  margin: auto;
  font-size: 1.05em;
  text-align: center;
  color: #fff;
  white-space: nowrap;
  overflow-x: hidden;
  width: 200px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.name-list div{
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    width: 140px;
    margin-right: 10px;
    /* display: inline-block; */
}

.character-list-mobile {
  /* border-top: 3px solid #9e8a57; */
  margin-top: 15px;
  padding-top: 15px;
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: stretch;
}

.character-full-list {
  /* padding-top: 15px; */
  display: flex;
  flex-direction: column;
  justify-content: space-around;
  align-items: stretch;
  margin-bottom: 15px;
  flex: 1;
  transition: flex 0.3s ease;
  width: 80%;
  margin: 0 auto;
}


.centered-list {
  justify-content: center;
}

.character-full-list > ul {
  padding-left: 0px;
  list-style: none;
  transition: flex 0.3s ease;
}
.move-center{
  padding-top: 0;
}
.character-list {
  list-style: none;
  margin: 0;
  padding: 0.5em 0.5em 0.5em 0.5em;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}

.character-full-list .character,
.character-full-list .character-highlight {
  width: 280px;
  margin: 10px 20px 10px 0;
}

.character-list-mobile > ul {
  padding: 0px;
}
.character-list-mobile > ul > li {
  justify-content: center;
  display: flex;
}
.disabled-li {
  pointer-events: none;
  opacity: 0.6;
}

.trait-icon {
  position: relative;
  border-radius: 15px;
  top: 5px;
  left: 5px;
}

.character-name {
  color: #cd4ff2; /* little lighter to emboss */
}

.subtext-stats {
  padding: 5px;
  margin-bottom: 2px;
}

.subtext-stats > span {
  color: rgb(230, 230, 230);
  font-size: 1.1em;
  margin-right: 2px;
}

.subtext-stats p {
  margin: 0;
  line-height: 1.1;
}

.small-stamina-char {
  position: relative;
  height: 18px;
  margin-top: 5px;
  border-radius: 4px;
  background: linear-gradient(
    to right,
    #FBE033 var(--staminaReady),
    #fff 0
  );
  border-radius: 10px;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  font-size: 1.1em;
}

.stamina-text {
  font-size: 75%;
  color: #000;
}

.slide-fade-enter-active {
  transition: all 0.3s ease;
}
.slide-fade-leave-active {
  transition: all 0.3s ease;
}
.slide-fade-enter,
.slide-fade-leave-to {
  transform: translateY(-30px);
  overflow: hidden;
  opacity: 0;
}
.hidden {
  display: none;
}
</style>
