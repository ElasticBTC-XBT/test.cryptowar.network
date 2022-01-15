<template>
  <!-- variant="primary" -->
  <b-button
    :disabled="disabled"
    class="button main-font dark-bg-text"
    @click="$emit('click')"
  >
    <h1>{{ mainText }}</h1>
    <h2>{{ subText }}</h2>
  </b-button>
</template>

<script lang="ts">
export default {
  props: ["mainText", "subText", "disabled"],
};
</script>

<style>
/* .button {
  border: 2px solid #6c5f38;
  border-radius: 0.1em;
  background: rgb(31, 31, 34);
  background: linear-gradient(
    180deg,
    rgba(31, 31, 34, 1) 0%,
    rgba(24, 27, 30, 1) 5%,
    rgba(24, 38, 45, 1) 100%
  );
} */

.button:hover:not(:disabled) {
  background-color: rgba(255, 255, 255, 0.1);
  border-color: currentColor;
  cursor: pointer;
}

.button:disabled {
  opacity: 0.4 !important;
}

h1 {
  margin-top: 0;
  /* padding-top: 10px; */
  /* font-size: 1em; */
}

.button h1 {
  font-size: 1.3em;
  margin-bottom: 10px;
}

/* .button div{
  width: 161px;
  position: relative;
  left: -32px;
} */

/* .button:hover{
  background-image: url(../assets/v2/Btn-fight-opcity.svg);
} */

.starter-panel .button-div h1 {
  font-size: 1.3rem;
}

@media (max-width: 767.98px) {
  .starter-panel .button-div h1 {
    font-size: 16px;
  }
}

h2 {
  white-space: pre;
}

@media only screen and (min-width: 768px) {
  div.encounter.text-center button h2 {
    font-size: x-large;
  }
}
@media only screen and (min-width: 992px) {
  div.encounter.text-center button h2 {
    font-size: xx-large;
  }
}

/* Needed to asjust image size, not just image column-size and other classes to accommodate that */
@media all and (max-width: 767.98px) {
  .dark-bg-text {
    /* width: 75%; */
  }
  .blank-slate .button h1 {
    font-size: 1.5rem;
  }
}
@media (max-width: 575.98px) {
  .button.encounter-button h1{
    font-size: 1em;
  }
}
</style>
