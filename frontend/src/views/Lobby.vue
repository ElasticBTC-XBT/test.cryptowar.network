<template>
  <div class="body main-font">
    <claim-rewards-bar v-if="canShowRewardsBar" />
    <ul class="lobby-box">
      <li
            class="character-item addnew addmore"
          >
          <div class="lobby-item-box">
            <b-button
                    class="lobby-item"
                    v-tooltip="'PvE'"
                    tagname="recruit_character"
                  >
                  <img src="../assets/v2/pve.svg" alt="" class="lobby-img">
                  </b-button>
                  </div>
          </li>
          <li
            class="character-item addnew"
          >
          <div class="lobby-item-box">
            <b-button
                    class="lobby-item"
                    @click="onMintCharacter"
                    v-tooltip="'PvP'"
                    tagname="recruit_character"
                  >
                  <img src="../assets/v2/pvp.svg" alt="" class="lobby-img">
                  </b-button>
          </div>
          </li>
          <li
            class="character-item addnew addmore"
          >
          <div class="lobby-item-box">
            <b-button
                    class="lobby-item"
                    @click="onMintCharacter"
                    v-tooltip="'Raid Boss'"
                    tagname="recruit_character"
                  >
                  <img src="../assets/v2/raid.svg" alt="" class="lobby-img">
                  </b-button>
            <span class="lobby-item-annouce">Coming soon</span>
          </div>
          </li>
    </ul>

  </div>
</template>

<script>
import ClaimRewardsBar from "../components/smart/ClaimRewardsBar.vue";

export default {
  data() {
    return {
      canShowRewardsBar: true,
    };
  },

  computed: {

  },

  props: {
  },

  methods: {
  },

  async mounted() {
    document.querySelector(".app.app-v2").classList.add("bg2");
  },

  components: {
    ClaimRewardsBar,
  },
};
</script>

<style>

.character-item {
  position: relative;
}

.lobby-box{
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 8em;
}

.lobby-item.btn-secondary{
  background: none;
  border: 0px solid;
  position: relative;
  z-index: 2;
}
.lobby-box .addmore{
  width: calc(294px - 294px*20/100);
  height: calc(398px - 398px*20/100);
}
.character-item .lobby-item-box{
  background-image: radial-gradient(#fdf2be, #C6A02Fee, transparent 60%);
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
}

.lobby-item-annouce {
  position: absolute;
  bottom: 25px;
  font-size: 1.3rem;
  text-transform: uppercase;
}

@media (max-width: 575.98px) {
  .lobby-box {
    flex-direction: column;
  }

  .lobby-box .addmore{
    width: 294px;
    height: 398px;
  }
}
</style>