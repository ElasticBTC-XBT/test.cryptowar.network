<template>
  <div class="body main-font">

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
          </div>
          </li>
    </ul>

  </div>
</template>

<script>

export default {
  computed: {

  },

  props: {
  },

  methods: {
  },

  async mounted() {
    document.querySelector(".app.app-v2").classList.toggle("bg2");
  },

  components: {
  },
};
</script>

<style>



.lobby-box{
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 8em;
}

.lobby-item.btn-secondary{
  background: none;
  border: 0px solid;
}
.lobby-box .addmore{
  width: calc(294px - 294px*20/100);
  height: calc(398px - 398px*20/100);
}
.character-item.addmore{
  background-image:linear-gradient(#F47055, #04041Daa),
   url(/img/bg-recruit.76484b7f.svg) !important;
}
.character-item .lobby-item-box{
  background-image: radial-gradient(#FFFF90, #C6A02Fee 22%, #05052111 63%);
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
}
</style>