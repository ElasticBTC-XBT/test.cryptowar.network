<template>
  <div class="character-bar">
    <character-display />
    <!-- <div class="character-bar-divider"/> -->
    <!-- <img src="../assets/infoDivider.png" class="info-divider"> -->
    <div class="nav-bottom-line"></div>
  </div>
</template>

<script lang="ts">
import CharacterDisplay from './smart/CharacterDisplay.vue';

export default {
  components: {
    CharacterDisplay,
  },
};
</script>

<style scoped>
.character-bar {
  padding: 0.5em 1.2em 0.5em 1.2em;
  background-color: #000;
  position: relative;
  left: -16px;
  width: 103%;
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
  width: 125%;
  position: relative;
  left: -19px;
  top: 12px;
  height: 4px;
  border-top: 3px solid;
  border-image-slice: 1;
  border-top-width: 3px;
  border-image-source: linear-gradient(to left, #3ADD9A, #121154, #A54476);
  /* background-image: radial-gradient(ellipse at top, #CBA938 -10%, transparent 35%), radial-gradient(ellipse at bottom, transparent, transparent); */
}

@media (max-width: 767.98px){
.character-bar::before{
  content: "";
  width: 100%;
  height: 61px;
  background-color: #000;
  position: absolute;
  left: 0;
  top: -58px;
  z-index: 1;
  padding: 0;
}
.character-bar[data-v-203b7b5a] {
  width: 110%;
}
}
</style>
