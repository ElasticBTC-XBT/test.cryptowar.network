<template>
    <div class="body main-font inventory">
      <b-tabs class="heading">
        <b-tab title="Hero">
          <div class="tab-content">
            <charater-list showFilters />
          </div>
        </b-tab>
        <b-tab title="Weapon">
          <div class="tab-content">
            <weapon-grid />
          </div>
        </b-tab>
        <b-tab title="Dust">
          <div class="tab-content"></div>
        </b-tab>
        <b-tab title="Box">
          <div class="tab-content"></div>
        </b-tab>
      </b-tabs>
    </div>
</template>

<script lang='ts'>
import Vue from 'vue';
import CharaterList from '../components/smart/CharacterList.vue';
import WeaponGrid from '../components/smart/WeaponGrid.vue';

export default Vue.extend({
  data() {
    return {

    };
  },
  components: {
    CharaterList,
    WeaponGrid,
  },

  mounted() {
    document.querySelector(".app.app-v2")?.classList.remove("bg2");
  }
});
</script>

<style>

@media (min-width: 1025px) {
  .tab-content {
    margin-top: 119px;
  }
  .inventory {
    margin-left: 95px;
    margin-right: 78px;
  }
}
</style>
