<template>
  <div class="body main-font">
    <claim-rewards-bar />
    <ul class="lobby-box">
      <li>
        <router-link
          :to="{ name: 'combat' }"
          exact
          class="character-item addnew addmore lobby-box-item-wrap"
        >
          <div class="lobby-item-box">
            <b-button
              class="lobby-item"
              v-tooltip="'PvE'"
              tagname="recruit_character"
            >
              <img src="../assets/v2/pve.svg" alt="" class="lobby-img" />
            </b-button>
          </div>
        </router-link>
      </li>
      <li>
        <router-link
          :to="{ name: 'P2P' }"
          exact
          class="character-item addnew lobby-box-item-wrap"
        >
          <div class="lobby-item-box">
            <b-button
              class="lobby-item"
              v-tooltip="'PvP'"
              tagname="recruit_character"
            >
              <img src="../assets/v2/pvp.svg" alt="" class="lobby-img" />
            </b-button>
          </div>
        </router-link>
      </li>
      <li>
        <router-link
          :to="{ name: '' }"
          exact
          class="character-item addnew addmore lobby-box-item-wrap"
        >
          <div class="lobby-item-box">
            <b-button
              class="lobby-item"
              v-tooltip="'Raid Boss'"
              tagname="recruit_character"
            >
              <img src="../assets/v2/raid.svg" alt="" class="lobby-img" />
            </b-button>
            <span class="lobby-item-annouce">Coming soon</span>
          </div>
        </router-link>
      </li>
    </ul>
  </div>
</template>

<script>
import ClaimRewardsBar from '../components/smart/ClaimRewardsBar.vue'

export default {
  data() {
    return {}
  },

  computed: {},

  props: {},

  methods: {},

  components: {
    ClaimRewardsBar,
  },
}
</script>

<style>
.character-item {
  position: relative;
}

.lobby-box {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 8em;
  list-style: none;
}

.lobby-item.btn-secondary {
  background: none;
  border: 0px solid;
  position: relative;
  z-index: 2;
}
.lobby-box .addmore {
  width: calc(294px - 294px * 20 / 100);
  height: calc(398px - 398px * 20 / 100);
}
.character-item .lobby-item-box {
  background-image: radial-gradient(#fdf2be, #c6a02fee, transparent 60%);
  display: flex;
  height: 100%;
  width: 100%;
  align-items: center;
  justify-content: center;
}

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
    list-style: none;
  }

  .addnew.addmore.addnew.lobby-box-item-wrap {
    width: 298px;
    height: 398px;
  }
}
</style>
