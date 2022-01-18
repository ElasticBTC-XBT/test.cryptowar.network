<template>
 <div style="containerListRequest">
   <BackgroundItem
   v-if="this.request.heroId"
   :character="characters[this.request.heroId]" :selectedCharacterId="this.request.heroId" :selectedWeaponId="this.request.weaponId" :noMargin="false"
   :playerPower="this.playerPower" :roomId="this.request.roomId" />
   <div class="containerButton" v-if="!isMine">
         <button
          type="button"
          class="buttonShowWeapon"
          @click="() =>this.handleShowWeapon(this.request.weaponId)"
        >
          <span class="titleButtonShowWeapon">
            Show Weapon
          </span>
        </button>
        <button
          type="button"
          class="buttonFight"
          @click="() =>this.handleFight(this.request.roomId, this.request.id)"
        >
          <span class="titleButtonFight">
            FIGHT
          </span>
        </button>
      </div>
      <div class="containerButton" v-if="isDone ==='0' && isMine">
        <button
          type="button"
          class="buttonFight"
          @click="() =>this.cancelRequestFight(this.request.roomId, this.request.id)"
        >
        <span class="titleButtonFight">
          CANCEL FIGHT
        </span>
        </button>
      </div>
      <div v-if="isDone === '1'">
        <div class="cost"><div></div> {{this.getResult()}}</div>
      </div>
       <div v-if="isDone === '2'">
        <div class="cost"><div></div> You canceled this match</div>
      </div>


     <!-- <div class="character-item">
       <div class="art">
         <div class="name-lvl-container">
        <div
          class="name black-outline"
          :title="getCleanCharacterName(this.request.heroId)"
        >
          {{'#'+ this.request.heroId }}
        </div>
      </div>
       </div>
     </div> -->
     </div>
</template>


<script lang="ts">
import Vue from "vue";
import {  mapActions, mapState, mapMutations, mapGetters } from "vuex";
import { getCleanName } from "../rename-censor";
// import CharacterRoom from "./CharacterRoom.vue";
// import CharacterRoomArt from "./CharacterRoomArt.vue";
import BackgroundItem from "./BackgroundItem.vue";
// import CharacterRoomArt from "./CharacterRoomArt.vue";
import { mapCacheActions } from 'vuex-cache';

export default Vue.extend({

  data() {
    return {
      waitingResults: false,
      resultsAvailable: false,
      fightResults: null,
      error: null,
      room: null,
      dataRoom: null,
      playerPower: 0,
      weapon: null
    };
  },
  components: { BackgroundItem },
  props: ["request", "handleFight", "isMine", "isDone", "cancelRequestFight", "isWin", "handleShowWeapon"],

  methods: {
    ...mapCacheActions(["fetchCharacters", "fetchWeaponId"]),
    ...mapActions(["fight", "getRoom", "checkPlayerPower"]),
    ...mapMutations(['setIsInCombat']),
    getCleanCharacterName(id: number) {
      return getCleanName(this.getCharacterName(id));
    },
    getResult() {
      if(this.isWin) {
        return 'You win this match!';
      }else {
        return 'You lose this match!';
      }
    }
  },
  computed: {
    ...mapState(["characters", "careerModeRooms"]),
    ...mapGetters(["getCharacterName"]),
  },

  async mounted() {
    if (this.request.heroId) {
      //@ts-ignore
      await this.fetchCharacters([this.request.heroId]);
    }
    //@ts-ignore
    const res: number = await this.checkPlayerPower({heroId: this.request.heroId, weaponId: this.request.weaponId});
    this.playerPower =res;
  },
});
</script>

<style scoped>

.containerListRequest {
  margin-top: 3.5rem;
}
.character-item {
  width: 100%;
  max-width: 340px;
  background-image: url("../assets/images/bg-item-top.png");
  background-position: 50% 50%;
  background-repeat: no-repeat;
  margin-top: 50px;
  background-size: cover;
  position: relative;
}

.character-item .art {
  width: 100%;
  min-height: 0;
  height: 100%;
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
}
.character-list {
  list-style: none;
  flex-wrap: wrap;
  justify-content: center;
  padding-left: 0px;
}

.containerButton {
    display: flex;
    align-items: center;
    justify-content:center;
    margin-bottom: 2rem;
  }
  .buttonFight {
    border: none;
    height: 47px;
    background-image: url('../assets/images/bg-fight-button.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-color: transparent;
    margin-left: 0.8rem;
  }
  .buttonShowWeapon {
  border: none;
    height: 47px;
    background-image: url('../assets/images/bg-fight-button.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-color: transparent;
    margin-left: 0.8rem;
  }
  .titleButtonShowWeapon {
    font-size: 12px;
    color: var(--white);
    padding-left: 6px;
    padding-right: 6px;
  }
.titleButtonFight {
  color: var(--white);
  font-size: 20px;
  padding-left: 23.5px;
  padding-right: 23.5px;
  font-size: 19px;
  font-weight: bold;
  padding-top: 12px;
  padding-bottom: 12px;
}
.cost{
  color: #D858F7;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  font-size: 1.3em;
}
.cost > div{
  /* background-image: url(../assets/v2/icon-crypto.svg); */
  width: 20px;
  height: 19px;
  background-repeat: no-repeat;
  background-size: cover;
  margin-right: 6px;
}

@media (max-width: 576px) {
  .character-item img {
    object-fit: contain;
  }

  .character-item.selected {
    background-image: url("../assets/images/bg-item-top-select.png");
  }
  .character-list {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
  }
  .clear-filters-button {
    width: 100%;
    text-align: center;
    justify-content: center;
  }
}
</style>
