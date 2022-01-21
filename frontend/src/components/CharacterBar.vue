<template>
  <div class="character-bar">
    <character-display :setCountTargetToFight="setCountTargetToFight" />
    <!-- <div class="character-bar-divider"/> -->
    <!-- <img src="../assets/infoDivider.png" class="info-divider"> -->
    <!-- <div class="nav-bottom-line"></div> -->
  </div>
</template>

<script lang="ts">
import CharacterDisplay from './smart/CharacterDisplay.vue';

export default {
  props: {
    setCountTargetToFight:{
      type: Function,
      default: null
    },
  },
  components: {
    CharacterDisplay,
  },
};
</script>

<style scoped>
.character-bar {
  /* padding: 0.5em 1.2em 0.5em 1.2em; */
  /* background-color: #000; */
  position: relative;
  /* left: -16px; */
  width: 100%;
}
/* .character-bar::before{
  content: "";
  width: 100%;
  height: 40px;
  background-color: #000;
  position: absolute;
  left: 0;
  top: -33px;
  z-index: 1;
  padding: 0;
} */
.character-bar-divider {
  height: 1px;
  background: rgb(124, 70, 117);
}
.nav-bottom-line{
  width: 105.6%;
  position: relative;
  left: -70px;
  top: 12px;
  height: 4px;
  border-top: 3px solid;
  border-image-slice: 1;
  border-top-width: 3px;
  border-image-source: linear-gradient(to left, #3ADD9A, #121154, #A54476);
  /* background-image: radial-gradient(ellipse at top, #CBA938 -10%, transparent 35%), radial-gradient(ellipse at bottom, transparent, transparent); */
}

@media (max-width: 767.98px){
  .character-bar {
    /* padding: 0.5em 1.2em 0.5em 3.4em; */
    width: 100%;
  }

  .nav-bottom-line{
    width: 100%;
  }
/* .character-bar::before{
  content: "";
  width: 100%;
  height: 61px;
  background-color: #000;
  position: absolute;
  left: 0;
  top: -58px;
  z-index: 1;
  padding: 0;
} */
/* .character-bar[data-v-203b7b5a] {
  width: 110%;
} */
}

@media (max-width: 575.98px) {
  .character-bar {
    /* padding: 0.5em 1.2em 0.5em 3.4em; */
    width: 100%;
  }

  .nav-bottom-line{
    width: 100%;
  }
}

@media (max-width: 414px) {
  .character-bar {
    /* padding: 0.5em 1.2em 0.5em 3.4em; */
    width: 100%;
  }

  .nav-bottom-line{
    width: 100%;
  }
}
@media (max-width: 375px) {
  .character-bar {
    /* padding: 0.5em 1.2em 0.5em 3.8em; */
    width: 100%;
  }

  .nav-bottom-line{
    width: 100%;
  }
}
</style>
