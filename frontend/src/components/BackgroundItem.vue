<template>
  <div class="character-art" v-tooltip="tooltipHtml(character)" ref="el">
    <div class="containerTop">
      <span
        :class="characterTrait.toLowerCase() + '-icon circle-element'"
      ></span>
    <div>
       <div class="name-lvl-container">
        <div
          class="idCharacterText"
          :title="getCleanCharacterName(character.id)"
          v-if="!portrait"
        >
          {{'#'+ character.id }}
        </div>
        <div class="lv" v-if="!portrait">
          Lv.<span class="">{{ character.level + 1 }}</span>
        </div>
      </div>
    </div>
    </div>
    <div class="placeholder d-flex align-items-start justify-content-center">
      <div
        :style="{
          'background-image': 'url(' + getCharacterArt(character) + ')',
          'z-index': 999
        }"
        :class="{
          'w-100': portrait,
          'h-100': !isMarket,
          'h-75': isMarket,
        }"
      ></div>
      <div class="traitOfCharacter" :style="{
        'background-image': 'url(' + getCharacterTrait(character) + ')',
        'height': '89px'
        }">
      </div>
    </div>
    <div class="loading-container" v-if="!allLoaded">
      <i class="fas fa-spinner fa-spin"></i>
    </div>
    <div :class="{ 'market-bot': !portrait }">
      <div class="score-id-container">
        <div class="black-outline" v-if="!portrait">
          <span class="white">{{ getCleanCharacterName(character.id) }}</span>
        </div>
      </div>
      <div class="score-id-container">
        <div class="black-outline" v-if="!portrait">
          Player power: <span class="ownerText">{{ renderOwner(this.playerPower) }}</span>
        </div>
      </div>
       <div class="score-id-container">
        <div class="black-outline" v-if="!portrait">
          Request to Hero: <span class="ownerText">{{ this.getHeroRequested() }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { getCharacterArt, getCharacterTrait } from "../character-arts-placeholder";
import { CharacterTrait, RequiredXp } from "../interfaces";
import { mapGetters, mapState, mapActions } from "vuex";
import { getCleanName } from "../rename-censor";

export default {
  props: [
    "character",
    "portrait",
    "isMarket",
    "matchReward",
    "room",
    "selectedWeaponId",
    "selectedCharacterId",
    "playerPower",
    "roomId"
  ],
  components: {
    //SmallButton,
  },

  data() {
    return {
      allLoaded: false,
      allLoadStarted: false,
      camera: null,
      scene: null,
      renderer: null,
      baseMaterial: null,
      loadCount: 0,
      loadCountTotal: 0,
      modelLoader: null,
      textureLoader: null,
      body: null,
      trait: this.characterTrait,
      showPlaceholder: false,
      heroScore: 0,
    };
  },

  computed: {
    console: () => console,
    ...mapState(["maxStamina", "careerModeRooms"]),
    ...mapGetters([
      "getCharacterName",
      "transferCooldownOfCharacterId",
      "getCharacterUnclaimedXp",
      "timeUntilCharacterHasMaxStamina",
      "charactersWithIds",
    ]),

    characterTrait() {
      const characterWithId =
        this.charactersWithIds && this.charactersWithIds([this.character.id]);
      return (
        (characterWithId && CharacterTrait[characterWithId[0].trait]) ||
        CharacterTrait[this.character.trait]
      );
    },
  },

  methods: {
    ...mapActions(["requestFight, fetchCharacters"]),
    RequiredXp,

    tooltipHtml(character) {
      if (!character) return "";

      const cooldown = this.transferCooldownOfCharacterId(this.character.id);
      if (cooldown) {
        if (cooldown === 86400)
          // edge case for when it's exactly 1 day and the iso string cant display
          return "May not be traded for: 1 day";
        else
          return `May not be traded for: ${new Date(cooldown * 1000)
            .toISOString()
            .substr(11, 8)}`;
      }

      return "";
    },

    getCleanCharacterName(id) {
      return getCleanName(this.getCharacterName(id));
    },

    staminaToolTipHtml(time) {
      return (
        "Regenerates 1 point every 5 minutes, stamina bar will be full at: " +
        time
      );
    },

    timestampToStamina(timestamp) {
      if (timestamp > Math.floor(Date.now() / 1000)) return 0;
      return +Math.min(
        (Math.floor(Date.now() / 1000) - timestamp) / 300,
        200
      ).toFixed(0);
    },

    getCharacterArt,
    getCharacterTrait,

    renderOwner(owner) {
      if(!owner) {
        return '';
      }
      else if(owner?.length<11) {
        return owner;
      }else {
        const hiddenString = owner.slice(5, owner?.length-5);
        const hiddenOwner = owner.split(hiddenString).join('...');
        return hiddenOwner;
      }
    },
    getHeroRequested() {
      const room = this.careerModeRooms.find(item => item.id === this.roomId);
      if(!room || room.claimed) {
        return '';
      }else {
        return room.characterId;
      }
    }
  },
  mounted() {
    this.allLoaded = true;
    this.showPlaceholder = true;
    return;
  },
};
</script>

<style scoped>
.character-art {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 299px;
  background-image: url("../assets/images/bg-item-top.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;;
  max-height: 432px;
}

.character-portrait .character-art {
  height: 100%;
}

.character-portrait .placeholder {
  height: 100%;
  margin-top: 0px;
}

.thumb-art {
  background-image: url("../assets/images/bg-item-top.png");
  background-repeat: no-repeat;
  background-position: 0 0;
  background-size: contain;
  display: flex;
  justify-content: center;
  flex-direction: column;
}

.character-info {
  background-image: url("../assets/images/bg-item-bot.png");
  background-repeat: no-repeat;
  background-size: contain;
  background-position: 0 0;
}

.xp {
  position: absolute;
}

.containerTop {
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  padding-left: 1.75rem;
  padding-right: 1.75rem;
  margin-top: 1.75rem;
}

.trait {
}

.id {
  top: 5px;
  right: 5px;
  font-style: italic;
}

.hero-score {
  top: 25px;
  right: 5px;
  font-style: italic;
}

.name {
  font-weight: 900;
  overflow: hidden;
  max-height: 24px;
  max-width: 170px;
  white-space: nowrap;
}

.xp {
  left: 40px;
  width: 238px;
  right: 0;

  background-image: url("../assets/images/bg-process-box.png");
  background-repeat: no-repeat;
  background-position: 0 0;
  height: 50px;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 0 14px;
}

.xp .bg-success {
  background-position: 0 0;
  background-image: url("../assets/images/chara-process.png");
  background-repeat: no-repeat;
  width: 218px;
  height: 27px;
  background-color: transparent !important;
}

.xp-text {
  width: 100%;
  text-align: center;
  position: absolute;
  color: #fff;
}

.xp .progress {
  background-color: initial;
  width: 100%;
  height: 24px;
  align-items: center;
}

.placeholder {
  max-width: 100%;
  position: relative;
  padding-top: 0;
  -o-object-fit: contain;
  object-fit: contain;
  height: 300px;
  margin-top: -30px;
}

.market-bot {
  height: 160px;
  overflow: hidden;
  background-position: 0 0;
  background-repeat: no-repeat;
  /* background-image: url("../assets/images/bg-item-bot.png"); */
  /* border-top: 2px solid #f48757; */
  margin-right: 17px;
}

.market-bot .name {
  font-size: 1.1rem;
  text-overflow: ellipsis;
}

.lv {
  color:#dabf75;
  font-weight: bold;
  font-size: 1rem;
  font-family: 'Rubik';
}

.idCharacterText {
    font-size: 21px;
    height: 25px;
    font-weight: 600;
}

.market-bot .lv {
  font-size: 1.1rem;
  color: #dabf75;
  font-weight: bold;
}

.market-bot .score {
  color: #d858f7;
}

.placeholder div {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 40%;
  height: 20%;
}

.circle-element {
  width: 3rem;
  height: 3rem;
  border: 1px solid #f48757;
  border-radius: 50%;
  padding: 0.5rem;
  background-color: #15052e;
}

.name-lvl-container {
  display: flex;
  justify-content: space-between;
  position: relative;
  flex-direction: column;
  align-items: flex-end;
}
.score-id-container {
  display: flex;
  justify-content: center;
  position: relative;
  padding: 0 3rem;
  align-items: center;
}

.market-bot .name-lvl-container {
  margin-top: 1.5rem;
}

.market-bot .score-id-container {
  font-size: 1.1rem;
  font-weight: bold;
}

.white {
  color: var(--white);
  font-weight: bold;
}

.small-stamina-char {
  position: relative;
  margin-top: -10px;
  top: 7px;
  align-self: center;
  height: 14px;
  width: 180px;
  border-radius: 2px;
  border: 0.5px solid rgb(216, 215, 215);
  background: linear-gradient(
    to right,
    rgb(236, 75, 75) var(--staminaReady),
    rgba(255, 255, 255, 0.1) 0
  );
}

.stamina-text {
  position: relative;
  top: -3px;
  font-size: 75%;
  left: 0;
  right: 0;
  text-align: center;
  color: #fff;
}

.request-fight-container {
  display: flex;
  align-items: center;
  justify-content: center;
  margin: 4px 0;
}

.traitOfCharacter {
  position: absolute;
  top:5.5rem;
  background-size: '100% 100%';
  background-repeat: 'no-repeat';
  transform: scale(2);
}
.ownerText {
  color:#FEA829;
  font-size: 18px;
  font-weight: bold;
}

@media (max-width: 575.98px) {
  .market-bot {
    height: auto;
    overflow: unset;
    margin-bottom: 50px;
  }
}
</style>
