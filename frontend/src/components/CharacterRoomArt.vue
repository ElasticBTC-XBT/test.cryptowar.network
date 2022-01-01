<template>
  <div class="character-art" v-tooltip="tooltipHtml(character)" ref="el">
    <div class="trait" v-if="!portrait">
      <span
        :class="characterTrait.toLowerCase() + '-icon circle-element'"
      ></span>
      <div class="id-lvl-container">
          <div
            class="id"
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
    <!-- <div class="containerTop">
      <span
        :class="characterTrait.toLowerCase() + '-icon circle-element'"
      ></span>
      <div>

      </div>
    </div> -->

    <div class="placeholder d-flex align-items-start justify-content-center " :class="characterTrait.toLowerCase() + '-bg'">
      <div
        :style="{
          'background-image': 'url(' + getCharacterArt(character) + ')',
        }"
        :class="{
          'w-100': portrait,
          'h-100': !isMarket,
          'h-75': isMarket,
        }"
      ></div>
    </div>

    <!-- <div class="placeholder d-flex align-items-start justify-content-center">
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
    </div> -->
    <div class="loading-container" v-if="!allLoaded">
      <i class="fas fa-spinner fa-spin"></i>
    </div>
    <div :class="{ 'market-bot': !portrait }">
      <div class="name black-outline" v-if="!portrait">
        {{ getCleanCharacterName(character.id) }}
      </div>

      <div class="owner black-outline" v-if="!portrait">
        Owner: <span class="ownerText">{{ renderOwner(this.room.owner) }}</span>
      </div>
    </div>
  </div>
</template>

<script>
import { getCharacterArt, getCharacterTrait } from "../character-arts-placeholder";
import { CharacterTrait, RequiredXp } from "../interfaces";
import { mapGetters, mapState, mapActions } from "vuex";
import { getCleanName } from "../rename-censor";
import Web3 from "web3";

export default {
  props: [
    "character",
    "portrait",
    "isMarket",
    "matchReward",
    "room",
    "selectedWeaponId",
    "selectedCharacterId",
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
    ...mapState(["maxStamina"]),
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
    totalReward(){
      return Web3.utils.fromWei(this.room.totalDeposit, "ether");
    }
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
    handleRequestFight() {
      this.requestFight({
        roomId: this.room.id,
        weaponId: this.selectedWeaponId,
        characterId: this.selectedCharacterId,
      });
    },

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
  width: 100%;
  height: 100%;
  position: relative;
  display: flex;
  justify-content: center;
  flex-direction: column;
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

.trait {
  margin: 0 auto;
  position: relative;
  display: flex;
  height: 75px;
  width: 100%;
  justify-content: space-between;
  padding: 0 1.5em 0 0.8em;
  align-items: center;
}

.id-lvl-container {
  text-align: right;
  font-size: 21px;
  padding-top: 15px;
}

.lv {
  color: #FEA829;
}

.id {
  top: 5px;
  right: 5px;
  font-style: italic;
}

.black-outline {
  color: #fff;
  font-weight: bold;
  font-size: 1.3em;
  text-shadow: none;
}

.black-outline .white{
  color: #fff;
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

.placeholder {
  max-width: 100%;
  position: relative;
  padding-top: 0;
  -o-object-fit: contain;
  object-fit: contain;
  height: 300px;
}

.market-bot {
  height: 95px;
  overflow: hidden;
  background-position: 0 0;
  background-repeat: no-repeat;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.market-bot .name {
  font-size: 1.3rem;
  text-overflow: ellipsis;
}

.market-bot .owner {
  font-size: 1.2rem;
  font-weight: bold;
  line-height: 1;
}

.market-bot .owner span {
  color: #FEA829;
}

.market-bot .score {
  color: #d858f7;
}

.placeholder div {
  background-size: contain;
  background-repeat: no-repeat;
  background-position: center;
  width: 100%;
  height: 100%;
}

.circle-element {
  width: 43px;
  height: 43px;
  border: 0px solid #f48757;
  border-radius: 50%;
  background-color: #15052e;
}

.score-id-container {
  display: flex;
  justify-content: space-between;
  position: relative;
  padding: 0 3rem;
}

.name-lvl-container .name{
  max-width: 100%;
  max-height: inherit;
  font-size: 1.2em;
}

.market-bot .score-id-container {
  font-size: 1.3rem;
  font-weight: bold;
}

.white {
  color: rgb(204, 204, 204);
}

.water-bg, .fire-bg, .lightning-bg, .earth-bg {
  background-image: url('../assets/images/water.png');
  background-repeat: no-repeat;
  background-position: center bottom;
}
.fire-bg{
  background-image: url('../assets/images/fire.png');
}
.lightning-bg{
  background-image: url('../assets/images/lightning.png');
}
.earth-bg{
  background-image: url('../assets/images/earth.png');
}

@media (min-width: 768px) {
  .placeholder {
    margin-top: -30px;
  }
}

@media (max-width: 576px) {
  .trait {
    height: 45px;
  }

  .circle-element {
    width: 27px;
    height: 27px;
  }

  .id-lvl-container {
    font-size: 14px;
  }

  .black-outline {
    font-size: 16px;
    font-weight: normal;
  }

  .placeholder {
    height: 164px;
    background-size: 70% 60%;
  }

  .market-bot .name {
    font-size: 12px;
    font-weight: 600;
    margin-top: 10px;
  }

  .market-bot .owner {
    font-size: 12px;
  }
}

</style>
