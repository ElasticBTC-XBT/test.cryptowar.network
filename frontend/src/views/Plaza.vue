<template>
  <div class="body main-font home">
    <!-- <div v-if="referralAddress">
      Mint hero discount 7% with referral address {{ referralAddress }}
    </div> -->
    <div v-if="ownCharacters.length === 0" class="blank-slate">
      <div class="current-promotion promotion-hero-left" v-if="heroAmount > 0">
        <strong class="upper-text"
          ><strong class="upper-text promotion-number">{{ heroAmount }}</strong>
          heroes left!</strong
        >
      </div>
      <div
        class="current-promotion promotion-hero-left"
        v-if="heroAmount === 0"
      >
        <strong class="upper-text"
          >No more heroes left! Please buy in Market</strong
        >
      </div>
      <div class="current-promotion">
        <strong class="upper-text"
          >Mint Hero NFT
          <span
            class="price"
            v-if="
              referralAddress == '0x0000000000000000000000000000000000000000'
            "
            >{{ recruitCost }}</span
          >
          <span
            class="price"
            v-if="
              referralAddress != '0x0000000000000000000000000000000000000000'
            "
          >
            <span style="text-decoration: line-through">{{ recruitCost }}</span>
            {{ (recruitCost * 0.93).toFixed(2) }}</span
          >
          xBlade
        </strong>
      </div>
      <big-button
        v-if="heroAmount === 0"
        class="button"
        :mainText="'Go to Market'"
        @click="$router.push({ name: 'market' })"
        tagname="recruit_character"
      />
      <big-button
        v-if="heroAmount > 0"
        class="button mint-hero"
        :mainText="`Mint Hero`"
        :disabled="!canRecruit() || heroAmount < 1"
        @click="onMintCharacter"
        tagname="recruit_character"
      />
      <div v-if="formatSkill() < recruitCost">
        <br />
        You can buy more xBlade from
        <a v-bind:href="`${getExchangeUrl}`" target="_blank">here</a>. Join
        <a href="https://t.me/elasticbitcoinxbt" target="_blank"
          >Telegram community</a
        >
        to get support!
      </div>
    </div>
    <div class="row mt-3" v-if="ownCharacters.length > 0">
      <div class="col">
        <div v-if="ownCharacters.length > 0">
          <div class="chara-head-box">
            <h1 class="chara-title">Characters ({{ ownCharacters.length }})</h1>
            <!-- <b-button
              v-if="canChangeTrait()"
              variant="primary"
              class="ml-auto gtag-link-others"
              @click="openChangeTrait"
              v-tooltip="'Change character\'s trait'"
              tagname="change_trait_character"
            >
              Change Trait
            </b-button> -->
            <!-- <b-button
              v-if="canRename()"
              variant="primary"
              class="ml-auto gtag-link-others"
              @click="openRenameCharacter"
              v-tooltip="'Rename character'" tagname="rename_character">
              Rename Character
            </b-button> -->
            <div>
              <!-- <b-button
                v-if="ownCharacters.length < 8"
                :disabled="!canRecruit() || heroAmount < 1"
                variant="primary"
                class="ml-auto gtag-link-others recruit"
                @click="onMintCharacter"
                v-tooltip="'Recruit new character'"
                tagname="recruit_character"
              >
                Recruit (<span
                  :class="`${
                    referralAddress ==
                    '0x0000000000000000000000000000000000000000'
                      ? 'old-price'
                      : ''
                  }`"
                  >{{ recruitCost }}</span
                >
                <span
                  v-if="
                    referralAddress !=
                    '0x0000000000000000000000000000000000000000'
                  "
                >
                  {{ (recruitCost * 0.93).toFixed(2) }}</span
                >
                xBlade)&nbsp;
                <i class="fas fa-plus"></i>
              </b-button> -->
              <!-- <div class="small-hero-left">
                Only
                <strong
                  class="upper-text promotion-number"
                  style="margin: 0 4px"
                  >{{ heroAmount }}</strong
                >
                heroes left!
              </div> -->
            </div>

            <!-- <b-button
              v-if="ownCharacters.length < 4"
              :disabled="!canRecruit()"
              variant="primary"
              class="ml-auto gtag-link-others"
              @click="onMintCharaterWithBNB"
              v-tooltip="'Recruit new character'" tagname="recruit_character">
              Recruit ({{ recruitCost }} BNB) <i class="fas fa-plus"></i>
            </b-button> -->
          </div>

          <character-list
            :value="currentCharacterId"
            @input="setCurrentCharacter"
          />
        </div>
        <b-modal
          class="centered-modal"
          ref="character-rename-modal"
          @ok="renameCharacterCall"
        >
          <template #modal-title> Rename Character </template>
          <b-form-input
            type="string"
            class="modal-input"
            v-model="characterRename"
            placeholder="New Name"
          />
          <span
            v-if="
              characterRename !== '' &&
              (characterRename.length < 2 || characterRename.length > 24)
            "
          >
            Name must be 2 - 24 characters long.
          </span>
          <span v-if="isRenameProfanish">
            This name contains profanish words and thus will be displayed as
            follows: <em>{{ cleanRename }}</em>
          </span>
        </b-modal>
        <b-modal
          class="centered-modal"
          ref="character-change-trait-modal"
          @ok="changeCharacterTraitCall"
        >
          <template #modal-title> Change Character's Trait </template>
          <span> Pick a trait to switch to. </span>
          <select class="form-control" v-model="targetTrait">
            <option v-for="x in availableTraits" :value="x" :key="x">
              {{ x }}
            </option>
          </select>
        </b-modal>
      </div>
    </div>
  </div>
</template>

<script lang="ts">
import BN from 'bignumber.js'
import BigButton from '../components/BigButton.vue'
import CharacterList from '../components/smart/CharacterList.vue'
import { mapActions, mapGetters, mapMutations, mapState } from 'vuex'
import { fromWeiEther, toBN } from '../utils/common'
import { BModal, BvModalEvent } from 'bootstrap-vue'
import Vue from 'vue'
import { getCleanName, isProfaneIsh } from '../rename-censor'
import { mapCacheActions } from 'vuex-cache'

let getConsumablesCountInterval: any = null

interface Data {
  recruitCost: string
  haveRename: number
  characterRename: string
  haveChangeTraitFire: number
  haveChangeTraitEarth: number
  haveChangeTraitWater: number
  haveChangeTraitLightning: number
  targetTrait: string
  heroAmount: number
}

export default Vue.extend({
  computed: {
    ...mapState([
      'characters',
      'maxStamina',
      'currentCharacterId',
      'defaultAccount',
      'skillBalance',
    ]),
    ...mapGetters([
      'contracts',
      'ownCharacters',
      'ownWeapons',
      'currentCharacter',
      'currentCharacterStamina',
      'getCharacterName',
      'getExchangeUrl',
    ]),

    character(): any {
      if (!this.currentCharacter) {
        return {
          id: null,
          name: '???',
          level: -1,
          experience: -1,
        }
      }

      const c = this.currentCharacter
      return {
        id: c.id,
        name: this.getCharacterName(c.id),
        level: c.level,
        experience: c.xp,
      }
    },

    availableTraits(): string[] {
      const availableTraits = []
      if (this.haveChangeTraitFire > 0) {
        availableTraits.push('Fire')
      }
      if (this.haveChangeTraitEarth > 0) {
        availableTraits.push('Earth')
      }
      if (this.haveChangeTraitWater > 0) {
        availableTraits.push('Water')
      }
      if (this.haveChangeTraitLightning > 0) {
        availableTraits.push('Lightning')
      }

      return availableTraits
    },

    isRenameProfanish(): boolean {
      return isProfaneIsh(this.characterRename)
    },

    cleanRename(): string {
      return getCleanName(this.characterRename)
    },
    referralAddress(): string {
      // @ts-ignore
      const referralAddress = this.$route.query.r
      if (referralAddress && referralAddress !== this.defaultAccount) {
        return referralAddress
      }
      return '0x0000000000000000000000000000000000000000'
    },
  },

  async created() {
    const recruitCost = await this.contracts.CWController.methods
      .getMintPriceByToken()
      .call({ from: this.defaultAccount })
    this.recruitCost = new BN(recruitCost).div(new BN(10).pow(18)).toFixed(2)
    this.loadConsumablesCount()
    getConsumablesCountInterval = setInterval(async () => {
      this.loadConsumablesCount()
    }, 3000)

    const heroAmount = await this.contracts.Characters.methods
      .availableAmount()
      .call({ from: this.defaultAccount })

    this.heroAmount = Number(heroAmount)
  },

  destroyed() {
    clearInterval(getConsumablesCountInterval)
  },

  data() {
    return {
      recruitCost: '0',
      haveRename: 0,
      characterRename: '',
      haveChangeTraitFire: 0,
      haveChangeTraitEarth: 0,
      haveChangeTraitWater: 0,
      haveChangeTraitLightning: 0,
      targetTrait: '',
      heroAmount: 0,
    } as Data
  },

  methods: {
    ...mapMutations(['setCurrentCharacter']),
    ...mapActions([
      'mintCharacter',
      'renameCharacter',
      'changeCharacterTraitLightning',
      'changeCharacterTraitEarth',
      'changeCharacterTraitFire',
      'changeCharacterTraitWater',
    ]),
    ...mapCacheActions([
      'fetchTotalRenameTags',
      'fetchTotalCharacterFireTraitChanges',
      'fetchTotalCharacterEarthTraitChanges',
      'fetchTotalCharacterWaterTraitChanges',
      'fetchTotalCharacterLightningTraitChanges',
    ]),

    async onMintCharacter() {
      // await this.mintCharacter(this.referralAddress ? this.referralAddress : '0x0000000000000000000000000000000000000000');
      try {
        await this.mintCharacter(
          this.referralAddress
            ? this.referralAddress
            : '0x0000000000000000000000000000000000000000'
        )
      } catch (e) {
        ;(this as any).$dialog.notify.error(
          'Could not mint character: insufficient funds or transaction denied.'
        )
      }
    },

    async onMintCharaterWithBNB() {
      try {
        await this.onMintCharaterWithBNB()
      } catch (e) {
        ;(this as any).$dialog.notify.error(
          'Could not mint character: insufficient funds or transaction denied.'
        )
      }
    },

    formatSkill() {
      return fromWeiEther(this.skillBalance)
    },
    canRecruit() {
      const cost =
        toBN(this.recruitCost)
          .div(10 ** 9)
          .toNumber() /
        10 ** 9
      const balance = toBN(this.skillBalance)
      return balance.isGreaterThanOrEqualTo(cost)
    },
    canRename() {
      return (
        this.haveRename > 0 &&
        this.currentCharacter !== undefined &&
        this.currentCharacter.id >= 0
      )
    },
    openRenameCharacter() {
      ;(this.$refs['character-rename-modal'] as BModal).show()
    },
    async renameCharacterCall(bvModalEvt: BvModalEvent) {
      if (this.characterRename.length < 2 || this.characterRename.length > 24) {
        bvModalEvt.preventDefault()
        return
      }

      await this.renameCharacter({
        id: this.currentCharacter.id,
        name: this.characterRename.trim(),
      })
      //@ts-ignore
      this.haveRename = await this.fetchTotalRenameTags()
    },

    canChangeTrait() {
      return (
        (this.haveChangeTraitFire > 0 ||
          this.haveChangeTraitEarth > 0 ||
          this.haveChangeTraitWater > 0 ||
          this.haveChangeTraitLightning > 0) &&
        this.currentCharacter !== undefined &&
        this.currentCharacter.id >= 0
      )
    },
    openChangeTrait() {
      ;(this.$refs['character-change-trait-modal'] as BModal).show()
    },
    async changeCharacterTraitCall(bvModalEvt: BvModalEvent) {
      if (!this.targetTrait) {
        bvModalEvt.preventDefault()
      }
      switch (this.targetTrait) {
        case 'Fire':
          await this.changeCharacterTraitFire({ id: this.currentCharacter.id })
          this.haveChangeTraitFire =
            //@ts-ignore
            await this.fetchTotalCharacterFireTraitChanges()
          break
        case 'Earth':
          await this.changeCharacterTraitEarth({
            id: this.currentCharacter.id,
          })
          this.haveChangeTraitEarth =
            //@ts-ignore
            await this.fetchTotalCharacterEarthTraitChanges()
          break
        case 'Water':
          await this.changeCharacterTraitWater({
            id: this.currentCharacter.id,
          })
          this.haveChangeTraitWater =
            //@ts-ignore
            await this.fetchTotalCharacterWaterTraitChanges()
          break
        case 'Lightning':
          await this.changeCharacterTraitLightning({
            id: this.currentCharacter.id,
          })
          this.haveChangeTraitLightning =
            //@ts-ignore
            await this.fetchTotalCharacterLightningTraitChanges()
          break
      }
    },

    async loadConsumablesCount() {
      //@ts-ignore
      this.haveRename = await this.fetchTotalRenameTags() // the other type of call returned 0 on testnet but not on local
      this.haveChangeTraitFire =
        //@ts-ignore
        await this.fetchTotalCharacterFireTraitChanges()
      this.haveChangeTraitEarth =
        //@ts-ignore
        await this.fetchTotalCharacterEarthTraitChanges()
      this.haveChangeTraitWater =
        //@ts-ignore
        await this.fetchTotalCharacterWaterTraitChanges()
      this.haveChangeTraitLightning =
        //@ts-ignore
        await this.fetchTotalCharacterLightningTraitChanges()
    },
  },

  components: {
    BigButton,
    CharacterList,
  },
})
</script>

<style scoped>
.chara-head-box {
  position: relative;
}
.chara-title {
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
}
.recruit {
  position: absolute;
  right: 0;
  top: 0;
}
.recruit i {
  padding-left: 0.5rem;
}
.current-promotion {
  width: 40%;
  text-align: center;
  margin: 32px 0;
}

@media all and (max-width: 767.98px) {
  .current-promotion {
    width: 100vw;
    /* margin-top: 90px; */
    padding-left: 15px;
  }

  .recruit {
    margin-left: inherit !important;
    justify-content: center;
    margin-right: inherit;
    position: inherit;
  }
}

.promotion-decoration {
  width: 100%;
  margin-left: auto;
  margin-right: auto;
  margin-top: 10px;
  margin-bottom: 10px;
}

.upper-text {
  text-transform: uppercase;
}

.promotion-hero-left {
  font-size: 2rem;
  /* width: 60%; */
}

.promotion-number {
  color: #f58b5b;
}

.small-hero-left {
  display: flex;
  align-self: flex-end;
  margin: 16px 4px;
  margin-right: 18px;
}

.old-price {
  text-decoration: line-through;
  font-size: 14px;
}
.price {
  color: #f58b5b;
  text-shadow: 1px 2px 3px #666;
}
.mint-hero {
  margin: 0;
}
</style>
<style>
.mint-hero h1 {
  margin: 0 !important;
  padding-top: 4px;
  padding-bottom: 4px;
}
.mint-hero h2 {
  margin: 0 !important;
}
</style>
