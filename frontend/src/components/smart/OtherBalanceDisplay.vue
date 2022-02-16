<template>
  <div class="others-list row">
    <div class="col-lg-3 mb-sm-5 mb-lg-0">
      <div class="character-item addnew item-container">
        <div class="item-image stamina-image"></div>
        <h2 class="item-label text-center">Stamina</h2>
        <div class="item-quantity-wrap">
          <div class="item-quantity text-center">
            Owned:
            <span v-if="!isLoading"> {{ ownedStamina }} </span>
            <span v-if="isLoading"> Loading </span>
          </div>
        </div>
      </div>
      <div class="btn-open-wrap">
        <b-button
          class="gtag-link-others btn-blue-bg btn-open-item"
          v-html="`USE`"
          :disabled="ownedStamina === 0"
          @click="openHeroSelect"
        ></b-button>
      </div>
    </div>

    <b-modal id="selectHeroModal" class="modal-box" hide-footer>
      <div class="row list">
        <div
          class="item-wrap"
          v-for="character in ownCharacters"
          :key="character.id"
        >
          <div class="item">
            <div class="info">
              <div class="info-head">
                <div :class="character.traitName.toLowerCase() + '-icon'"></div>
              </div>
              <div class="item-id">
                <span>#{{ character.id }}</span>
                <div class="level">Lv.{{ character.level + 1 }}</div>
              </div>
              <div
                :style="{
                  'background-image':
                    'url(' + getCharacterTrait(character) + ')',
                  'z-index': 999,
                }"
                class="img-hero-around"
              >
                <div
                  :style="{
                    'background-image':
                      'url(' + getCharacterArt(character) + ')',
                    'z-index': 999,
                  }"
                  class="img-hero"
                ></div>
              </div>
              <div
                class="small-stamina-char"
                :style="`--staminaReady: ${
                  (getCharacterStamina(character.id) / maxStamina) * 100
                }%;`"
              >
                <div class="stamina-text">
                  STA {{ getCharacterStamina(character.id) }} / 200
                </div>
              </div>
            </div>
          </div>
          <div class="button-container">
            <button
              @click="selectHero(character)"
              class="btn-claim-stamina"
              :disabled="
                getCharacterStamina(character.id) === 200 || ownedStamina === 0
              "
            >
              SELECT
            </button>
          </div>
        </div>
      </div>
    </b-modal>

    <b-modal
      class="centered-modal text-center"
      ref="loadingModal"
      hide-footer
      hide-header
      no-close-on-backdrop
      no-close-on-esc
      style="justify-content: center"
    >
      <span class="loading-icon">
        Loading
        <i class="fas fa-spinner fa-spin"></i>
      </span>
    </b-modal>

    <b-modal
      id="setStaminalModal"
      class="centered-modal text-center"
      ref="setStamina"
      title="Set number of stamina you want to add"
      v-if="choosenHero"
      ok-only
      ok-title="USE"
      :ok-disabled="parseInt(stamina) === 0"
      ok-variant="secondary btn-pink-bg"
      @ok="onClaimStamina(choosenHero.id, stamina)"
      style="justify-content: center"
    >
      <div class="item-wrap">
        <div class="item">
          <div class="info">
            <div class="info-head">
              <div :class="choosenHero.traitName.toLowerCase() + '-icon'"></div>
            </div>
            <div class="item-id">
              <span>#{{ choosenHero.id }}</span>
              <div class="level">Lv.{{ choosenHero.level + 1 }}</div>
            </div>
            <div
              :style="{
                'background-image':
                  'url(' + getCharacterTrait(choosenHero) + ')',
                'z-index': 999,
              }"
              class="img-hero-around"
            >
              <div
                :style="{
                  'background-image':
                    'url(' + getCharacterArt(choosenHero) + ')',
                  'z-index': 999,
                }"
                class="img-hero"
              ></div>
            </div>
            <div
              class="small-stamina-char"
              :style="`--staminaReady: ${
                (getCharacterStamina(choosenHero.id) / maxStamina) * 100
              }%;`"
            >
              <div class="stamina-text">
                STA {{ getCharacterStamina(choosenHero.id) }} / 200
              </div>
            </div>
          </div>
        </div>
        <div>
          <div class="stamina-quantity">{{ stamina }}/{{ ownedStamina }}</div>
          <div class="range">
            <div class="value left">0</div>
            <input
              v-model="stamina"
              type="range"
              min="0"
              :max="
                200 - getCharacterStamina(choosenHero.id) < ownedStamina
                  ? 200 - getCharacterStamina(choosenHero.id)
                  : ownedStamina
              "
              value="0"
              steps="1"
            />
            <div class="value right">
              {{ getStaminaClaimable(getCharacterStamina(choosenHero.id)) }}
            </div>
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import { mapGetters, mapActions, mapState } from 'vuex'
import {
  getCharacterArt,
  getCharacterTrait,
} from '../../character-arts-placeholder'

export default {
  data() {
    return {
      isLoading: true,
      choosenHero: null,
      ownedStamina: 0,
      stamina: 0,
      featchUnclaimedStaminaInterval: 0,
    }
  },

  computed: {
    ...mapState(['maxStamina']),
    ...mapGetters(['ownCharacters', 'getCharacterStamina']),
  },

  methods: {
    ...mapActions(['fetchUnclaimedStamina', 'claimStamina']),

    getCharacterTrait,
    getCharacterArt,
    async openHeroSelect() {
      if (this.ownCharacters.length === 0) {
        this.$dialog.notify.error("You don't have any hero available!")
      } else {
        this.$bvModal.show('selectHeroModal')
      }
    },

    selectHero(hero) {
      if (this.ownedStamina === 0) {
        this.$dialog.notify.error("You don't have any stamina left!")
      } else {
        this.choosenHero = hero
        this.$refs.setStamina.show()
      }
    },

    getStaminaClaimable(staminaLost) {
      return 200 - staminaLost < this.ownedStamina
        ? 200 - staminaLost
        : this.ownedStamina
    },

    async onClaimStamina(id, stamina) {
      this.$refs.loadingModal.show()
      await this.claimStamina({
        id,
        stamina,
      }).finally(() => {
        this.$refs.loadingModal.hide()
      })
      this.ownedStamina = await this.fetchUnclaimedStamina()
      this.stamina = 0
    },
  },

  async mounted() {
    this.featchUnclaimedStaminaInterval = setInterval(async () => {
      this.ownedStamina = await this.fetchUnclaimedStamina()
    }, 3000)
    setTimeout(() => {
      this.choosenHero = this.ownCharacters[0]
      this.isLoading = false
    }, 4000)
  },

  beforeDestroy() {
    clearInterval(this.featchUnclaimedStaminaInterval)
  },
}
</script>

<style>
.others-list {
  justify-content: center;
  margin: 0 auto;
}
.tab-content {
  margin-top: 60px !important;
}

.character-item.addnew.item-container {
  width: 294px !important;
  margin: 0 auto;
  cursor: pointer;
  align-items: center;
  flex-direction: column;
  justify-content: space-around;
  padding: 30px 0;
}

.stamina-image {
  content: url('../../assets/stamina-item.png');
}

.item-label {
  font-size: 34px !important;
  font-weight: 400 !important;
  margin: 0;
}

.item-quantity {
  margin: auto;
  font-size: 22px;
  width: 100%;
}

.item-quantity span {
  color: #f58b5b;
}

.btn-open-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
}

.btn-open-item {
  height: 42px !important;
  background-image: url('../../assets/v2/btn-bg-pink.png') !important;
  background-size: cover;
  margin-right: 0 !important;
}

#selectHeroModal .icon-close {
  background-image: url(../../assets/v2/icon-close-2.svg);
  width: 50px;
  height: 47px;
  margin-right: 40px;
}

#selectHeroModal .icon-close-container {
  display: flex;
  justify-content: flex-end;
}

.list {
  color: #fff;
  overflow-y: scroll;
  padding: 0;
  margin-top: 20px;
  margin-bottom: 40px;
  scroll-margin-left: 50px;
  display: flex;
  justify-content: center;
  height: 700px;
  width: 90%;
  margin: 0 auto;
}

.item-wrap {
  min-width: 18em;
  height: 28em;
  background-position: top center;
  background-repeat: no-repeat;
  background-size: contain;
  background-image: url(../../assets/images/bg-item-top.png);
  margin: 0.4em 1.6em 0;
  position: relative;
  display: flex;
  justify-content: space-between;
  flex-direction: column;
}

.info {
  margin: 0 11px 30px 11px;
  height: 50%;
  margin-top: 55px;
}

.info .property {
  width: 30px;
  height: 30px;
  display: block;
  margin-top: 10px;
  position: relative;
  top: -25px;
}

.element-container {
  position: relative;
  top: 0;
}

.info-head > div {
  font-size: 1.3em;
}

.item-id {
  position: absolute;
  right: 30px;
  top: 30px;
}

.item-id > div {
  text-align: end;
  font-size: 1em;
  line-height: 15px;
  color: #f2be3e;
}

.info-head {
  position: relative;
  top: -20px;
  left: 15px;
}

.info-head span:first-child {
  margin: 0;
}

.img-hero-around {
  width: 151px;
  height: 207px;
  background-repeat: no-repeat;
  background-size: contain;
  position: absolute;
  bottom: 150px;
  left: 80px;
}

.img-hero {
  width: 151px;
  height: 238px;
  background-repeat: no-repeat;
  background-size: 100%;
  margin: 0 auto;
  position: relative;
  top: 0;
}

.img-weapon {
  width: 190px;
  height: 214px;
  background-repeat: no-repeat;
  background-size: 100%;
  margin: 0 auto;
  margin-top: 20px;
  position: relative;
  top: 35px;
}

.info-footer {
  position: absolute;
  bottom: 40px;
  width: 100%;
}

.info-footer div {
  font-weight: 600;
  text-align: center;
}

.btn-claim-stamina {
  margin: 0 auto;
  display: block;
  background-color: transparent;
  border: none;
  background-image: url(../../assets/v2/btn-fight-big.svg);
  width: 190px;
  height: 42px;
  background-size: cover;
  background-repeat: no-repeat;
  color: #fff;
  font-weight: 600;
  font-size: 1em;
  margin-bottom: 20px;
  opacity: 1;
}

.btn-claim-stamina:not(:disabled):hover {
  background-image: url(../../assets/v2/btn-fight-big-opcity.svg);
  transition: 0.9s;
}

.btn-claim-stamina:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

#selectHeroModal .modal-dialog {
  width: 80rem;
}

#selectHeroModal .modal-content {
  max-width: unset !important;
}

#setStaminalModal .modal-content {
  height: 600px;
}

.range {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  font-weight: bold;
  font-size: 18px;
}

.range input {
  -webkit-appearance: none;
  height: 3px;
  border-radius: 5px;
  outline: none;
  border: none;
  width: 60%;
  margin: 0 5px;
}

.range input::-webkit-slider-thumb {
  appearance: none;
  width: 18px;
  height: 18px;
  border-radius: 50%;
  border: 0.3px solid #fff;
  cursor: pointer;
}

.stamina-quantity {
  font-weight: bold;
  font-size: 18px;
  text-align: center;
}

@media (max-width: 376px) {
  #selectHeroModal .icon-close {
    margin-right: 10px;
  }
}

@media (max-width: 767px) {
  #selectHeroModal .icon-close {
    margin-right: 10px;
  }

  .stamina-image {
    width: 100px;
    height: 250px;
  }
}
</style>

<style scoped>
.small-stamina-char {
  position: absolute;
  bottom: 5.2em;
  right: 50%;
  transform: translateX(50%);
  width: 80%;
  height: 18px;
  border-radius: 4px;
  background: linear-gradient(to right, #fbe033 var(--staminaReady), #fff 0);
  border-radius: 10px;
  background-repeat: no-repeat;
  background-size: cover;
  display: flex;
  justify-content: center;
  align-items: center;
  font-weight: 700;
  font-size: 1.1em;
}

.stamina-text {
  font-size: 75%;
  color: #000;
}
</style>
