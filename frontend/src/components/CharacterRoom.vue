<template>
  <div class="character-item">
    <div class="art">
      <CharacterRoomArt
        v-if="characters[this.characterId]"
        :character="characters[this.characterId]"
        :matchReward="this.matchReward"
        :room="this.room"
        :selectedWeaponId="this.selectedWeaponId"
        :selectedCharacterId="this.selectedCharacterId"
      />
    </div>
    <div v-if="this.isRequest == true" class="containerButton">
        <button
          type="button"
          class="buttonFight"
          @click="handleRequestFight()"
        >
        <span class="titleButtonFight">
          REQUEST FIGHT
        </span>
        </button>
      </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";
import CharacterRoomArt from "../components/CharacterRoomArt.vue";
import { mapActions, mapState } from "vuex";
import Web3 from "web3";

export default Vue.extend({
  props: ["characterId", "room", "selectedWeaponId", "selectedCharacterId", "isRequest"],
  components: {
    CharacterRoomArt,
  },
  methods: {
    ...mapActions(["fetchCharacters", "requestFight"]),
    handleRequestFight() {
      //@ts-ignore
      this.requestFight({
        roomId: this.room.id,
        weaponId: this.selectedWeaponId,
        characterId: this.selectedCharacterId,
      });
    },
  },
  computed: {
    ...mapState(["characters"]),
    matchReward() {
      return Web3.utils.fromWei(this.room.matchReward, "ether");
    },
  },
  async mounted() {
    //@ts-ignore
    await this.fetchCharacters([this.characterId]);
  },
});
</script>

<style scoped>
.character-item {
  width: 299px;
  max-width: 100%;
<<<<<<< HEAD
  background-repeat: no-repeat;
  background-size: 100% 100%;;
  margin: 50px auto;
=======
  background-image: url("../assets/images/bg-item-top.png");
  background-repeat: no-repeat;
  background-size: 100% 100%;;
  margin-top: 1rem;
  margin-bottom: 2.7rem;
  /* margin-left: 2.5rem; */
>>>>>>> dd3f251080d52c1e093af2a1597cf187167d05ca
  align-items: center;
  justify-items: center;
  max-height: 432px;
}

.character-item .art {
  width: 100%;
  min-height: 0;
  height: 100%;
<<<<<<< HEAD
=======
  /* background-position: center; */
>>>>>>> dd3f251080d52c1e093af2a1597cf187167d05ca
  background-repeat: no-repeat;
  background-size: contain;
  display: flex;
  flex-direction: column;
  align-items: center;
  background-color: transparent;
<<<<<<< HEAD
=======
  /* background-color: red; */
>>>>>>> dd3f251080d52c1e093af2a1597cf187167d05ca
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
    justify-content: center;
<<<<<<< HEAD
    margin-top: 15px;
=======
    margin-bottom: 2rem;
>>>>>>> dd3f251080d52c1e093af2a1597cf187167d05ca
  }
  .buttonFight {
    border: none;
    height: 47px;
    background-image: url('../assets/images/bg-fight-button.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-color: transparent;
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
<<<<<<< HEAD
  .titleButtonFight {
    font-size: 13px;
  }
=======
>>>>>>> dd3f251080d52c1e093af2a1597cf187167d05ca

}
</style>
