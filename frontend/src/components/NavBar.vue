<template>

  <div class="main-nav-div">
    <div v-if="referralAddress" style="color:#7F327C; text-align:center; background: white; padding:10px">
     ✨ Congratulations! You get 7% discount when mint new heroes ⚔️ only valid in 24 hours ⏰  </div>
    <b-navbar class="main-nav" toggleable="sm">
      <b-navbar-brand href="#" class="nav-logo">
        <img
          src="../assets/logo250.png"
          class="logo d-inline-block align-top"
          alt="Logo"
        />
      </b-navbar-brand>

      <view-links class="view-links"></view-links>

      <skill-balance-display class="ml-auto d-none d-sm-flex" />

      <claim-rewards v-if="!canShowRewardsBar" />

      <options class="d-none d-sm-flex" />

      <!-- Render only on mobile view -->
      <div class="d-flex d-sm-none">
        <skill-balance-display class="skill-display-mobile" />
        <options class="options-display-mobile" />
      </div>
    </b-navbar>
    <div class="nav-bottom-line"></div>
    <claim-rewards-bar v-if="canShowRewardsBar" />
    <div class="container_row">
      <!-- <img src="../assets/divider4.png" class="expander-divider" /> -->
      <!-- <b-button
        class="expander-button"
        @click="toggleCharacterView"
        v-if="ownCharacters.length > 0"
      >
        <b-icon-arrows-expand
          class="expand-collapse-icon"
          v-if="!getIsCharacterViewExpanded"
        />
        <b-icon-arrows-collapse
          class="expand-collapse-icon"
          v-if="getIsCharacterViewExpanded"
          aria-hidden="true"
        />
      </b-button> -->
    </div>
  </div>
</template>

<script lang="ts">
import Vue from "vue";

import ViewLinks from "./ViewLinks.vue";
import Options from "./Options.vue";
import SkillBalanceDisplay from "./smart/SkillBalanceDisplay.vue";
import ClaimRewards from "./smart/ClaimRewards.vue";
import ClaimRewardsBar from "./smart/ClaimRewardsBar.vue";

import Events from "../events";
import { mapGetters, mapMutations } from "vuex";

export default Vue.extend({
  components: {
    ViewLinks,
    SkillBalanceDisplay,
    ClaimRewards,
    ClaimRewardsBar,
    Options,
  },

  data() {
    return {
      canShowRewardsBar: true,
    };
  },

  computed: {
    ...mapGetters(["getIsCharacterViewExpanded", "ownCharacters","defaultAccount"]),
    referralAddress(): string {
      // @ts-ignore
      const referralAddress = this.$route.query.r;
      if (referralAddress && referralAddress !== this.defaultAccount) {
        return referralAddress;
      }
      return '';
    },
  },

  methods: {
    ...mapMutations(["setIsCharacterViewExpanded"]),
    checkStorage(): void {
      this.canShowRewardsBar = localStorage.getItem("hideRewards") === "false";
    },
    toggleCharacterView(): void {
      this.setIsCharacterViewExpanded(!this.getIsCharacterViewExpanded);
      localStorage.setItem(
        "isCharacterViewExpanded",
        this.getIsCharacterViewExpanded ? "true" : "false"
      );
    },
  },

  mounted() {
    this.checkStorage();
    Events.$on("setting:hideRewards", () => this.checkStorage());
  },
});
</script>

<style>
/** Suggest to move this to atomic folder structure like assets/css **/
a {
  text-decoration: none;
  user-select: none;
}

.dropdown-menu {
  background: rgb(20, 20, 20);
  background: linear-gradient(
    45deg,
    rgba(20, 20, 20, 1) 0%,
    rgba(36, 39, 32, 1) 100%
  );
  border: none !important;
}

.dropdown-menu li a:hover {
  background: transparent !important;
}

@media (max-width: 767.98px) {
  .main-nav {
    align-items: normal !important; /** force only for mobile to manually set alignments **/
    flex-direction: column;
  }
  .main-nav > .navbar-brand {
    align-self: center;
  }
  .main-nav > .navbar-nav {
    flex-direction: row;
    justify-content: space-evenly;
    flex-wrap: wrap;
  }
  .skill-display-mobile {
    flex: 5;
  }
  .skill-display-mobile > .balance-container {
    font-size: 0.8em;
  }
  .options-display-mobile {
    flex: 1;
    align-items: flex-end;
  }
}
</style>

<style scoped>
.logo {
  max-width: 86px;
}


.main-nav > .view-links {
  flex: 2.3;
}
.nav-logo {
  flex: 0.3;
}

.expand-collapse-icon {
  position: relative;
  color: #9e8a57;
}

.expander-button {
  position: absolute;
  height: 27px;
  width: 27px;
  background: #200334;
  border: 1px solid #312e21 !important;
  border-radius: 0.1em;
  padding: 0;
  margin-top: -5px;
  margin-right: 0;
}

.expander-button.focus, .expander-button:focus, .expander-button:active{
  box-shadow: none;
}

.container_row {
  display: grid;
  justify-items: center;
  position: relative;
}

.expander-divider {
  width: 100%;
  position: relative;
}

.expander-divider,
.expander-button {
  grid-column: 1;
  grid-row: 1;
}

.nav-bottom-line{
  height: 36px;
  border-top: 3px solid;
  border-image-slice: 1;
  border-top-width: 3px;
  border-image-source: linear-gradient(to left, #3ADD9A, #121154, #A54476);
  background-image: radial-gradient(ellipse at top, #CBA938 -10%, transparent 35%), radial-gradient(ellipse at bottom, transparent, transparent);
}

</style>


