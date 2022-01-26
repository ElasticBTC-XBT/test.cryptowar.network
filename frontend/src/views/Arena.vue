<template>
  <div class="body main-font">
      <ul class="arena-box">
        <router-link :to="{ name: 'rps' }" exact
          class="character-item addnew addmore mr-xl-5"
        >
          <li class="arena-item-box">
            <b-button
              class="arena-item"
              v-tooltip="'RPS'"
              tagname="recruit_character"
              @click="checkRpsClick = true"
            >
              <img src="../assets/v2/rps.svg" alt="" class="arena-img">
            </b-button>
          </li>
        </router-link>
        <router-link :to="{ name: 'luckywheel' }" exact
          class="character-item addnew addmore"
        >
          <li class="arena-item-box">
            <b-button
              class="arena-item"
              v-tooltip="'Lucky Wheel'"
              tagname="recruit_character"
            >
            <img src="../assets/v2/lucky-wheel.svg" alt="" class="arena-img">
            </b-button>
          </li>
        </router-link>
    </ul>
  </div>
</template>

<script>
// import CombatPVP from "../views/CombatPVP.vue";

export default {
  data() {
    return {
      checkRpsClick: false,
    }
  },
  computed: {},

  props: {},

  methods: {},

  components: {
    // CombatPVP,
  },
}
</script>

<style scoped>
.arena-img {
  width: 20em;
}
.arena-box {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 8em;
}

.arena-item.btn-secondary {
  background: none;
  border: 0px solid;
}
.arena-box .addmore {
  width: calc(294px - 100px * 20 / 100);
  height: calc(398px - 200px * 20 / 100);
}
.character-item.addmore{
  background-image:linear-gradient(#F47055, #04041Daa),
   url(/img/bg-recruit.76484b7f.svg) !important;
  margin-bottom: 50px !important;
}
.character-item .arena-item-box {
  background-image: radial-gradient(#ffff90, #c6a02fee 22%, #05052111 63%);
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
}
.app.app-v2 {
  background-image: url('../assets/v2/lobbybackground.jpg');
  background-repeat: no-repeat;
  background-size: cover;
}

@media (max-width: 767.98px) {
  .arena-box{
    flex-direction: column;
  }
}

@media (max-width: 575.98px) {
}

@media (min-width: 768px) {
}
</style>
