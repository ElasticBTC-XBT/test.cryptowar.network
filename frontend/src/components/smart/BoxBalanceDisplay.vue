<template>
  <div class="box-list row">
    <b-modal
      id="successOpenBoxInventory"
      hide-footer
      hide-header
      hide-header-close
    >
      <div class="itemWeapon">
        <WeaponSelect :weapon="this.weaponReceive" />
      </div>
      <div
        class="buttonFightFragment"
        @click="$bvModal.hide('successOpenBoxInventory')"
      >
        <span>GO TO CHECK</span>
      </div>
    </b-modal>
    <div v-if="isOpeningBox" id="fight-overlay">
      <div class="waiting animation" v-if="isOpeningBox" margin="auto">
        <div class="fighting-img"></div>
        <div class="waiting-text">
          Loading
          <i class="fas fa-spinner fa-spin"></i>
        </div>
      </div>
    </div>
    <div class="col-lg-3 mb-sm-5 mb-lg-0">
      <div class="character-item addnew box-container">
        <div class="box-image box-image1"></div>
        <h2 class="box-label text-center">Common Box</h2>
        <div class="box-quantity-wrap">
          <div class="box-quantity text-center">
            Quantity:
            <span>{{
              this.listBoxInventory.filter((item) => item.type === '0').length
            }}</span>
            <!-- <span>{{getCommonBox()}}</span> -->
          </div>
        </div>
      </div>
      <div class="btn-open-wrap">
        <b-button
          class="gtag-link-others btn-blue-bg btn-open-box"
          v-html="`OPEN`"
          @click="handleOpenBox(`common`)"
        ></b-button>
      </div>
    </div>
    <div class="col-lg-3 mb-sm-5 mb-lg-0">
      <div class="character-item addnew box-container">
        <div class="box-image box-image2"></div>
        <h2 class="box-label text-center">Rare Box</h2>
        <div class="box-quantity-wrap">
          <div class="box-quantity text-center">
            Quantity:
            <span>{{
              this.listBoxInventory.filter((item) => item.type === '1').length
            }}</span>
            <!-- <span>{{getRareBox()}}</span> -->
          </div>
        </div>
      </div>
      <div class="btn-open-wrap">
        <b-button
          class="gtag-link-others btn-blue-bg btn-open-box"
          v-html="`OPEN`"
          @click="handleOpenBox(`rare`)"
        ></b-button>
      </div>
    </div>
    <div class="col-lg-3 mb-sm-5 mb-lg-0">
      <div class="character-item addnew box-container">
        <div class="box-image box-image3"></div>
        <h2 class="box-label text-center">Epic Box</h2>
        <div class="box-quantity-wrap">
          <div class="box-quantity text-center">
            Quantity:
            <span>{{
              this.listBoxInventory.filter((item) => item.type === '2').length
            }}</span>
            <!-- <span>{{getEpicBox()}}</span> -->
          </div>
        </div>
      </div>
      <div class="btn-open-wrap">
        <b-button
          class="gtag-link-others btn-blue-bg btn-open-box"
          v-html="`OPEN`"
          @click="handleOpenBox(`epic`)"
        ></b-button>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex'
import WeaponSelect from '../WeaponSelect.vue'

export default {
  props: [],

  data() {
    return {
      listBoxInventory: [],
      isOpeningBox: false,
      errorMessage: '',
      weaponReceive: null,
    }
  },

  components: {
    WeaponSelect,
  },

  watch: {
    async updateListInventory([listBoxInventory]) {
      this.listBoxInventory = listBoxInventory
    },
  },

  computed: {
    ...mapGetters(['getCommonBox', 'getRareBox', 'getEpicBox']),
  },

  methods: {
    ...mapActions([
      'getMyBoxes',
      'getBoxDetail',
      'openCommonBox',
      'fetchWeaponId',
    ]),
    async handleOpenBox(type) {
      try {
        switch (type) {
          case 'common': {
            const listCommon = this.listBoxInventory.filter(
              (item) => item.type === '0'
            )
            if (!listCommon || listCommon.length === 0) {
              break
            }
            this.isOpeningBox = true
            const res = await this.openCommonBox({ boxId: listCommon[0].id })
            setTimeout(async () => {
              const weapon = await this.fetchWeaponId(
                res?.[0]?.returnValues?.tokenId
              )
              this.weaponReceive = weapon
              this.$bvModal.show('successOpenBoxInventory')
              this.isOpeningBox = false
            }, 1000)
            setTimeout(async () => {
              this.listBoxInventory = await this.getMyBoxes()
            }, 5000)
            break
          }
          case 'rare': {
            const listRare = this.listBoxInventory.filter(
              (item) => item.type === '1'
            )
            if (!listRare || listRare.length === 0) {
              break
            }
            this.isOpeningBox = true
            const res = await this.openCommonBox({ boxId: listRare[0].id })
            setTimeout(async () => {
              const weapon = await this.fetchWeaponId(
                res?.[0]?.returnValues?.tokenId
              )
              this.weaponReceive = weapon
              this.$bvModal.show('successOpenBoxInventory')
              this.isOpeningBox = false
            }, 1000)
            setTimeout(async () => {
              this.listBoxInventory = await this.getMyBoxes()
            }, 5000)
            break
          }
          default: {
            const listEpic = this.listBoxInventory.filter(
              (item) => item.type === '2'
            )
            if (!listEpic || listEpic.length === 0) {
              break
            }
            this.isOpeningBox = true
            const res = await this.openCommonBox({ boxId: listEpic[0].id })
            setTimeout(async () => {
              const weapon = await this.fetchWeaponId(
                res?.[0]?.returnValues?.tokenId
              )
              this.weaponReceive = weapon
              this.$bvModal.show('successOpenBoxInventory')
              this.isOpeningBox = false
            }, 1000)
            setTimeout(async () => {
              this.listBoxInventory = await this.getMyBoxes()
            }, 5000)
            break
          }
        }
      } catch (error) {
        this.isOpeningBox = false
        this.$bvModal.hide('successOpenBoxInventory')
      }
    },
  },
  async mounted() {
    setTimeout(async () => {
      this.listBoxInventory = await this.getMyBoxes()
    }, 1000)
  },
}
</script>

<style>
.tab-content {
  margin-top: 60px !important;
}

.box-list {
  justify-content: center;
  margin: 0 auto;
}

.character-item.addnew.box-container {
  width: 294px !important;
  margin: 0 auto;
  cursor: pointer;
  align-items: center;
  flex-direction: column;
  justify-content: space-around;
  padding: 30px 0;
}

.box-image {
  width: 269px;
  height: 269px;
}

.waiting {
  margin: auto;
  text-align: center;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding: 10px 0;
  position: fixed;
  z-index: 3;
}
.animation {
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}
.itemWeapon {
  min-width: 19em;
  height: 26.5em;
  background-position: left;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: url(../../assets/images/bg-item-top.png);
  position: relative;
}
.waiting.animation .fighting-img {
  background-image: url(../../assets/images/diamond.gif);
  background-repeat: no-repeat;
  background-size: 100% 100%;
  width: 10rem;
  height: 10rem;
}

#fight-overlay {
  position: fixed;
  z-index: 2;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.7);
  display: table;
  transition: opacity 0.3s ease;
}

.box-image1 {
  content: url('../../assets/common-box.png');
}

.box-image2 {
  content: url('../../assets/rare-box.png');
}

.box-image3 {
  content: url('../../assets/epic-box.png');
}

.box-label {
  font-size: 34px !important;
  font-weight: 400 !important;
  margin: 0;
}

.box-quantity {
  margin: auto;
  font-size: 22px;
  width: 100%;
}

.box-quantity span {
  color: #f58b5b;
}

.btn-open-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
}

.btn-open-box {
  height: 42px !important;
  background-image: url('../../assets/v2/btn-bg-pink.png') !important;
  background-size: cover;
  margin-right: 0 !important;
}

.waiting-text {
  font-size: 25px;
  margin-top: 10px;
}

@media (max-width: 576px) {
  .box-label {
    font-size: 21px !important;
  }

  .box-quantity {
    font-size: 18px;
  }
  .btn-open-box {
    height: 42px !important;
  }
  .character-item.addnew.box-container {
    margin-top: 0 !important;
  }
  .btn-open-wrap {
    margin-bottom: 5rem;
  }
}

@media (max-width: 768px) {
  .box-list {
    justify-content: center;
  }

  .box-label {
    margin: 0 0 16px;
  }
}
</style>
