<template>
  <div class="body main-font">
<<<<<<< HEAD
    <claim-rewards-bar v-if="canShowRewardsBar" />
    <ul class="lobby-box">
      <li
        class="character-item addnew addmore lobby-box-item-wrap"
      >
        <router-link :to="{ name: 'combat' }" exact class="lobby-item-box">
          <b-button
          class="lobby-item"
          v-tooltip="'PvE'"
          tagname="recruit_character"
          >
            <img src="../assets/v2/pve.svg" alt="" class="lobby-img">
          </b-button>
        </router-link>
      </li>
      <li
        class="character-item addnew lobby-box-item-wrap"
      >
        <router-link :to="{ name: 'P2P' }" exact class="lobby-item-box">
          <b-button
            class="lobby-item"
            @click="onMintCharacter"
            v-tooltip="'PvP'"
            tagname="recruit_character"
          >
            <img src="../assets/v2/pvp.svg" alt="" class="lobby-img">
          </b-button>
        </router-link>
      </li>
      <li
        class="character-item addnew addmore lobby-box-item-wrap"
      >
        <router-link :to="{ name: '#' }" exact class="lobby-item-box">
          <b-button
            class="lobby-item"
            @click="onMintCharacter"
            v-tooltip="'Raid Boss'"
            tagname="recruit_character"
          >
            <img src="../assets/v2/raid.svg" alt="" class="lobby-img">
          </b-button>
          <span class="lobby-item-annouce">Coming soon</span>
        </router-link>
      </li>
=======

    <ul class="lobby-box">
      <li
            class="character-item addnew addmore"
          >
          <div class="lobby-item-box">
            <router-link :to="{ name: 'combat' }" exact class="">
              <b-button
                    class="lobby-item"
                    v-tooltip="'PvE'"
                    tagname="recruit_character"
                  >
                <img src="../assets/v2/pve.svg" alt="" class="lobby-img">
              </b-button>
            </router-link>
          </div>
          </li>
          <li
            class="character-item addnew"
          >
          <div class="lobby-item-box">
            <router-link :to="{ name: 'pvp' }" exact class="">
              <b-button
                class="lobby-item"
                @click="onMintCharacter"
                v-tooltip="'PvP'"
                tagname="recruit_character"
              >
                <img src="../assets/v2/pvp.svg" alt="" class="lobby-img">
              </b-button>
            </router-link>
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
          </div>
          </li>
>>>>>>> dd3f251080d52c1e093af2a1597cf187167d05ca
    </ul>

  </div>
</template>

<script>
<<<<<<< HEAD
import ClaimRewardsBar from "../components/smart/ClaimRewardsBar.vue";

export default {
  data() {
    return {
      canShowRewardsBar: true,
    };
  },

=======

export default {
>>>>>>> dd3f251080d52c1e093af2a1597cf187167d05ca
  computed: {

  },

  props: {
  },

  methods: {
  },

  async mounted() {
<<<<<<< HEAD
    document.querySelector(".app.app-v2").classList.add("bg2");
  },

  components: {
    ClaimRewardsBar,
=======

  },

  components: {
>>>>>>> dd3f251080d52c1e093af2a1597cf187167d05ca
  },
};
</script>

<style>

<<<<<<< HEAD
.character-item {
  position: relative;
}
=======

>>>>>>> dd3f251080d52c1e093af2a1597cf187167d05ca

.lobby-box{
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 8em;
}

.lobby-item.btn-secondary{
  background: none;
  border: 0px solid;
<<<<<<< HEAD
  position: relative;
  z-index: 2;
=======
>>>>>>> dd3f251080d52c1e093af2a1597cf187167d05ca
}
.lobby-box .addmore{
  width: calc(294px - 294px*20/100);
  height: calc(398px - 398px*20/100);
}
<<<<<<< HEAD
.character-item .lobby-item-box{
  background-image: radial-gradient(#fdf2be, #C6A02Fee, transparent 60%);
=======
.character-item.addmore{
  background-image:linear-gradient(#F47055, #04041Daa),
   url(/img/bg-recruit.76484b7f.svg) !important;
}
.character-item .lobby-item-box{
  background-image: radial-gradient(#FFFF90, #C6A02Fee 22%, #05052111 63%);
>>>>>>> dd3f251080d52c1e093af2a1597cf187167d05ca
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
}
<<<<<<< HEAD

.addnew.lobby-box-item-wrap {
  margin-left: 15px;
  margin-right: 15px;
  width: 298px;
}

.addnew.addmore.addnew.lobby-box-item-wrap {
  width: 254px;
}

.lobby-item-annouce {
  position: absolute;
  bottom: 25px;
  font-size: 1.3rem;
  text-transform: uppercase;
  color: #fff;
}

@media (max-width: 575.98px) {
  .lobby-box {
    flex-direction: column;
    margin-top: 37px;
    padding-left: 0;
  }

  .addnew.addmore.addnew.lobby-box-item-wrap {
    width: 298px;
    height: 398px;
  }
}
</style>
=======
.app.app-v2{
  background-image: url('../assets/v2/lobbybackground.jpg');
  background-repeat: no-repeat;
  background-size: cover;
}
</style>
>>>>>>> dd3f251080d52c1e093af2a1597cf187167d05ca
