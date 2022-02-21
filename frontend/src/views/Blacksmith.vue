<template>
  <div class="body main-font">
    <b-tabs class="heading">
      <b-tab title="Reforge Weapons">
        <div class="blank-slate" v-if="ownWeapons.length === 0">
          You do not currently have any weapons.
          <br />
          <br />
          <big-button
            class="btn btn-pink-bg"
            :mainText="`Buy Secret Box`"
            @click="$router.push({ name: 'shop' })"
          />
        </div>
        <div class="row mt-3" v-if="ownWeapons.length > 0">
          <div class="col">
            <div class="d-flex justify-content-space-between">
              <div class="d-flex justify-content-flex-end ml-auto">
                <!-- <b-button
                  class="btn-buy"
                  v-if="canRename()"
                  @click="openRenameWeapon"
                  tagname="rename_weapon"
                  v-tooltip="'Rename Weapon'">
                  Rename Weapon
                </b-button>

                <b-button
                        class="ml-3 btn-buy"
                        @click="displayDustCreation()"
                        tagname="reforge_weapon"
                        v-tooltip="'Burn weapons to buff selected weapon'">
                  Create Dust
                </b-button> -->
                <!-- <b-button
                        class="ml-3 btn-buy"
                        v-if="reforgeWeaponId !== null && ownWeapons.length > 0"
                        @click="displayDustReforge()"
                        tagname="reforge_weapon"
                        v-tooltip="'Burn weapons to buff selected weapon'">
                  Reforge with Dust
                </b-button> -->

                <!-- <b-icon-question-circle class="centered-icon" scale="1.5"
                  v-on:click="onShowForgeDetails" v-tooltip.bottom="'Click for forge percentages'"/> -->

                <b-modal
                  hide-footer
                  ref="forge-details-modal"
                  title="Forge Percentages"
                >
                  <div>
                    5+ star @ 1% chance. Estimated cost
                    {{ Number.parseFloat(forgeCost * (1 / 0.01)).toFixed(2) }}
                    xBlade.
                  </div>
                  <div>
                    4+ star @ 6% chance. Estimated cost
                    {{ Number.parseFloat(forgeCost * (1 / 0.06)).toFixed(2) }}
                    xBlade.
                  </div>
                  <div>
                    3+ star @ 21% chance. Estimated cost
                    {{ Number.parseFloat(forgeCost * (1 / 0.21)).toFixed(2) }}
                    xBlade.
                  </div>
                  <div>
                    2+ star @ 56% chance. Estimated cost
                    {{ Number.parseFloat(forgeCost * (1 / 0.56)).toFixed(2) }}
                    xBlade.
                  </div>
                  <div>1+ star @ 100% chance.</div>
                </b-modal>

                <b-modal
                  size="xl"
                  class="centered-modal"
                  ref="new-weapons"
                  @ok="closeNewWeaponsModal"
                  :ok-disabled="spin"
                  :cancel-disabled="spin"
                >
                  <template #modal-header>
                    <div
                      v-if="!spin"
                      class="new-weapon-header-text text-center"
                    >
                      <h4 class="modal-title">Forge results</h4>
                    </div>
                    <div v-if="spin" class="new-weapon-header-text text-center">
                      <h4 class="modal-title">Forging weapon...</h4>
                    </div>
                  </template>
                  <div class="text-center">
                    <b-spinner
                      class="mx-2"
                      v-if="spin"
                      type="grow"
                      label="Loading..."
                    ></b-spinner>
                    <b-spinner
                      class="mx-2"
                      v-if="spin"
                      type="grow"
                      label="Loading..."
                    ></b-spinner>
                    <b-spinner
                      class="mx-2"
                      v-if="spin"
                      type="grow"
                      label="Loading..."
                    ></b-spinner>
                  </div>
                  <div class="character-item weapon no-corner" v-if="!spin">
                    <div class="weapon-icon-wrapper">
                      <weapon-icon
                        v-if="getWeaponToUpgrade()"
                        :weapon="getWeaponToUpgrade()"
                        :isBlacksmith="true"
                      />
                    </div>
                    <div v-if="$slots.above || $scopedSlots.above">
                      <slot name="above" :weapon="getWeaponToUpgrade()"></slot>
                    </div>
                  </div>
                  <template #modal-footer></template>
                </b-modal>

                <b-modal
                  size="xl"
                  class="centered-modal"
                  ref="new-dust"
                  @ok="closeNewWeaponsModal"
                  :ok-disabled="spin"
                  :cancel-disabled="spin"
                >
                  <template #modal-header>
                    <div
                      v-if="!spin"
                      class="new-weapon-header-text text-center"
                    >
                      <h4 class="modal-title">
                        Burn weapons successfully
                        <br />
                        Total dusts now
                      </h4>
                    </div>
                    <div v-if="spin" class="new-weapon-header-text text-center">
                      <h4 class="modal-title">Burning weapons...</h4>
                    </div>
                  </template>
                  <div class="text-center">
                    <b-spinner
                      class="mx-2"
                      v-if="spin"
                      type="grow"
                      label="Loading..."
                    ></b-spinner>
                    <b-spinner
                      class="mx-2"
                      v-if="spin"
                      type="grow"
                      label="Loading..."
                    ></b-spinner>
                    <b-spinner
                      class="mx-2"
                      v-if="spin"
                      type="grow"
                      label="Loading..."
                    ></b-spinner>
                  </div>
                  <div class="dust-list row" v-if="!spin">
                    <div class="dust-container dust-1 no-corner col-4">
                      <div class="dust-image dust-image1"></div>
                      <div class="dust-quantity-burn">
                        {{ getLesserDust() }}
                      </div>
                    </div>
                    <div class="dust-container dust-2 no-corner col-4">
                      <div class="dust-image dust-image2"></div>
                      <div class="dust-quantity-burn">
                        {{ getGreaterDust() }}
                      </div>
                    </div>
                    <div class="dust-container dust-3 no-corner col-4">
                      <div class="dust-image dust-image3"></div>
                      <div class="dust-quantity-burn">
                        {{ getPowerfulDust() }}
                      </div>
                    </div>
                  </div>
                  <template #modal-footer></template>
                </b-modal>
              </div>
            </div>
            <div class="row" v-if="showBlacksmith">
              <weapon-grid
                class="col-xl-8 justify-content-lg-between"
                v-model="reforgeWeaponId"
                showFilters
                isBlacksmith
              />
              <div class="col-xl-4 reforge-ta">
                <div class="reforge-tab">
                  <div class="confirmReforge">
                    <div class="weapon">
                      <div class="blank" v-if="!getWeaponToUpgrade()">
                        You haven't chosen any weapons
                      </div>
                      <div v-if="$slots.above || $scopedSlots.above">
                        <slot
                          name="above"
                          :weapon="getWeaponToUpgrade()"
                        ></slot>
                      </div>
                      <div class="weapon-icon-wrapper">
                        <weapon-icon
                          v-if="getWeaponToUpgrade()"
                          class="weapon-icon isBlacksmith"
                          :weapon="getWeaponToUpgrade()"
                        />
                      </div>
                      <div class="text-center"></div>
                    </div>
                    <div class="seperate"></div>
                    <div class="dust-list row">
                      <div class="dust-container dust-1 no-corner col-4">
                        <div class="dust-image dust-image1"></div>
                        <span class="dust-quantity-reforge"
                          >{{ lesserDust }}/{{ getLesserDust() }}</span
                        >
                        <div class="range">
                          <div class="value left">0</div>
                          <input
                            v-model="lesserDust"
                            type="range"
                            min="0"
                            :max="getLesserDust()"
                            value="0"
                            steps="1"
                          />
                          <div class="value right">{{ getLesserDust() }}</div>
                        </div>
                      </div>
                      <div class="dust-container dust-2 no-corner col-4">
                        <div class="dust-image dust-image2"></div>
                        <span class="dust-quantity-reforge"
                          >{{ greaterDust }}/{{ getGreaterDust() }}</span
                        >
                        <div class="range">
                          <div class="value left">0</div>
                          <input
                            v-model="greaterDust"
                            type="range"
                            min="0"
                            :max="getGreaterDust()"
                            value="0"
                            steps="1"
                          />
                          <div class="value right">{{ getGreaterDust() }}</div>
                        </div>
                      </div>
                      <div class="dust-container dust-3 no-corner col-4">
                        <div class="dust-image dust-image3"></div>
                        <span class="dust-quantity-reforge"
                          >{{ powerfulDust }}/{{ getPowerfulDust() }}</span
                        >
                        <div class="range">
                          <div class="value left">0</div>
                          <input
                            v-model="powerfulDust"
                            type="range"
                            min="0"
                            :max="getPowerfulDust()"
                            value="0"
                            steps="1"
                          />
                          <div class="value right">{{ getPowerfulDust() }}</div>
                        </div>
                      </div>
                    </div>
                    <div class="d-flex justify-content-around mt-5">
                      <div class="position-relative">
                        <b-button
                          tagname="confirm_forge_weapon"
                          class="btn-pink-bg btn-confirm-reforge"
                          :class="
                            (getWeaponToUpgrade() === undefined ||
                              (lesserDust === '0' &&
                                greaterDust === '0' &&
                                powerfulDust === '0')) &&
                            'disabled'
                          "
                          @click="showDustReforgeConfirmation"
                          v-tooltip="'Reforge selected weapon with dust'"
                          v-html="'Confirm reforge'"
                        >
                        </b-button>
                        <div class="reforge-info">
                          Use: <span>{{ lesserDust }}</span> Lesser
                          <br />
                          Use: <span>{{ greaterDust }}</span> Greater
                          <br />
                          Use: <span>{{ powerfulDust }}</span> Powerful
                          <br />
                          (<span>
                            {{
                              getWeaponToUpgrade() === undefined ||
                              (lesserDust === '0' &&
                                greaterDust === '0' &&
                                powerfulDust === '0')
                                ? 0
                                : dustReforgeCost
                            }}
                          </span>
                          xBlade)
                        </div>
                      </div>
                      <b-button
                        tagname="confirm_forge_weapon"
                        class="btn-buy btn-blue-bg btn-cancel-reforge"
                        :class="
                          getWeaponToUpgrade() === undefined && 'disabled'
                        "
                        @click="cancelReforge()"
                        v-tooltip="'Cancel Reforge'"
                        v-html="'Cancel'"
                      >
                      </b-button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        <div class="col-xl-6">
          <div class="link-container">
            <div class="text">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                class="bi bi-journal-text"
                viewBox="0 0 16 16"
              >
                <path
                  d="M5 10.5a.5.5 0 0 1 .5-.5h2a.5.5 0 0 1 0 1h-2a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1
               .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0
                1h-5a.5.5 0 0 1-.5-.5zm0-2a.5.5 0 0 1 .5-.5h5a.5.5 0 0 1 0 1h-5a.5.5 0 0 1-.5-.5z"
                />
                <path
                  d="M3 0h10a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2v-1h1v1a1 1 0 0 0 1 1h10a1 1 0 0 0 1-1V2a1
               1 0 0 0-1-1H3a1 1 0 0 0-1 1v1H1V2a2 2 0 0 1 2-2z"
                />
                <path
                  d="M1 5v-.5a.5.5 0 0 1 1 0V5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1
               0-1H1zm0 3v-.5a.5.5 0 0 1 1 0V8h.5a.5.5 0 0 1 0
               1h-2a.5.5 0 0 1 0-1H1zm0 3v-.5a.5.5 0 0 1 1 0v.5h.5a.5.5 0 0 1 0 1h-2a.5.5 0 0 1 0-1H1z"
                />
              </svg>
              Docs:
            </div>
            <a
              class="link-to-wiki"
              href="https://wiki.cryptowar.network/gameplay/what-are-weapons/reforging"
              target="_blank"
            >
              https://wiki.cryptowar.network/gameplay/what-are-weapons/reforging</a
            >
          </div>
        </div>
        <!-- <div class="row mt-3 dust-box" v-if="showReforge && !showReforgeDust">
          <div class="col">
            <div class="d-flex justify-content-space-between">
              <h1>Create Dust</h1>
              <div class="d-flex justify-content-flex-end ml-auto">
                <b-button
                        tagname="confirm_forge_weapon"
                        class="confirmReforge ml-3 btn-buy"
                        @click="showMassDustConfirmation"
                        v-tooltip="'Reforge selected weapon with dust'">
                  Mass Burn
                  <br>
                  ({{burnCost * burnWeaponIds.length }} xBlade)
                </b-button>
                <b-button
                        tagname="confirm_forge_weapon"
                        class="confirmReforge ml-3 btn-buy"
                        @click="cancelReforge()"
                        v-tooltip="'Cancel Reforge'">
                        Cancel
                </b-button>
              </div>
            </div>
          </div>
        </div> -->
      </b-tab>

      <b-tab title="Create Dust">
        <div class="row mt-3" v-if="showBlacksmith">
          <weapon-grid
            class="col-xl-8 justify-content-lg-between"
            v-model="burnWeaponId"
            :ignore="burnWeaponIds"
            :showGivenWeaponIds="true"
            :weaponIds="hideWeapons"
            @chooseweapon="addBurnWeapon"
            showFilters
            isBlacksmith
          />
          <div class="col-xl-4">
            <div class="burn-tab">
              <div class="confirmBurn">
                <h2 style="font-size: 24px">
                  Weapons chosen ({{ burnWeaponIds.length }})
                </h2>
                <div class="burn-weapons">
                  <weapon-grid
                    :showGivenWeaponIds="true"
                    :weaponIds="burnWeaponIds"
                    @chooseweapon="removeBurnWeapon"
                    :isBurnWeapon="true"
                  />
                </div>
                <div class="seperate"></div>
                <div class="burn-footer">
                  <b-button
                    tagname="confirm_burn_weapons"
                    class="btn-pink-bg btn-confirm-reforge"
                    :class="burnWeaponIds.length === 0 && 'disabled'"
                    @click="showMassDustConfirmation"
                    v-tooltip="'Burn selected weapons to get dust'"
                    v-html="'Mass burn'"
                  >
                  </b-button>
                  <b-button
                    tagname="confirm_burn_weapons"
                    class="btn-buy btn-blue-bg btn-cancel-reforge"
                    :class="burnWeaponIds.length === 0 && 'disabled'"
                    @click="clearAllMassBurn()"
                    v-tooltip="'Cancel burn weapons'"
                    v-html="'Cancel'"
                  >
                  </b-button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </b-tab>
    </b-tabs>

    <b-modal
      class="centered-modal"
      ref="weapon-rename-modal"
      @ok="renameWeaponCall()"
    >
      <template #modal-title> Rename Weapon </template>
      <b-form-input
        type="string"
        class="modal-input"
        v-model="weaponRename"
        placeholder="New Name"
      />
      <span v-if="isRenameProfanish">
        This name contains profanish words and thus will be displayed as
        follows: <em>{{ cleanRename }}</em>
      </span>
    </b-modal>

    <b-modal
      class="centered-modal text-center dust-box-modal"
      ref="dustreforge-confirmation-modal"
      title="Dust Reforge Confirmation"
      @ok="onReforgeWeaponWithDust"
    >
      <div class="character-item weapon no-corner" v-if="reforgeWeaponId">
        <div class="weapon-icon-wrapper">
          <weapon-icon
            v-if="getWeaponToUpgrade()"
            :weapon="getWeaponToUpgrade()"
            :isBlacksmith="true"
          />
        </div>
        <div v-if="$slots.above || $scopedSlots.above">
          <slot name="above" :weapon="getWeaponToUpgrade()"></slot>
        </div>
      </div>
      <div
        class="text-center mt-3"
        v-text="'Are you sure you want to reforge this weapon using:'"
      />
      <div class="reforge-info-modal text-center">
        <span>{{ lesserDust }}</span> Lesser Dust
        <br />
        <span>{{ greaterDust }}</span> Greater Dust
        <br />
        <span>{{ powerfulDust }}</span> Powerful Dust
      </div>
      <div class="modal-alert text-center">
        <b-icon icon="exclamation-circle" variant="danger" /> This process
        cannot be undone!
      </div>
    </b-modal>

    <b-modal
      class="centered-modal text-center"
      ref="mass-dust-confirmation-modal"
      title="Burn Weapons Confirmation"
      @ok="onMassBurnWeapons"
    >
      <div class="burn-weapons modal-weapons">
        <weapon-grid
          :showGivenWeaponIds="true"
          :weaponIds="burnWeaponIds"
          @chooseweapon="removeBurnWeapon"
          :isBurnWeapon="true"
        />
      </div>
      <div class="text-center mt-3">
        <b-icon icon="exclamation-circle" variant="danger" /> [WARNING] Please
        make sure you want to burn these weapons to dust the process is
        irreversible!
      </div>
      <div class="text-center">
        <b-icon icon="exclamation-circle" variant="danger" /> No Refunds will be
        given for accidentally destroyed items!
      </div>
    </b-modal>

    <b-modal
      class="centered-text-modal"
      ref="reforge-bonuses-modal"
      title="Reforge Bonuses"
    >
      <div>5* Burn: 1 5B (75 Bonus Power / 600 Max).</div>
      <div>4* Burn: 1 4B (30 Bonus Power/ 750 Max).</div>
      <div>3* Burn: 3 LB (45 Bonus Power/ 1500 Max).</div>
      <div>2* Burn: 2 LB (30 Bonus Power/ 1500 Max).</div>
      <div>1* Burn: 1 LB (15 Bonus Power/ 1500 Max).</div>
    </b-modal>
  </div>
</template>

<script lang="ts">
import BN from 'bignumber.js'
import WeaponGrid from '../components/smart/WeaponGrid.vue'
import BigButton from '../components/BigButton.vue'
import Vue from 'vue'
import { mapActions, mapGetters, mapState } from 'vuex'
import { mapCacheActions } from 'vuex-cache'
import WeaponIcon from '../components/WeaponIcon.vue'
import { BModal } from 'bootstrap-vue'
import { Contracts, IState } from '@/interfaces'
import { Accessors } from 'vue/types/options'
import { getCleanName, isProfaneIsh } from '../rename-censor'
// import VueRouter from 'vue-router';

type StoreMappedState = Pick<IState, 'defaultAccount' | 'ownedWeaponIds'>

interface StoreMappedGetters {
  contracts: Contracts
  ownWeapons: any[]
  nftsCount: number
}

interface Data {
  showBlacksmith: boolean
  showDustForge: boolean
  showReforgeDust: boolean
  reforgeWeaponId: string | null
  burnWeaponId: string | null
  selectedNft: string | null
  forgeCost: string
  reforgeCost: string
  dustReforgeCost: string
  burnCost: string
  disableForge: boolean
  newForged: number[]
  currentListofWeapons: string[]
  spin: boolean
  lesserDust: string
  greaterDust: string
  powerfulDust: string
  dust: string[]
  allowDustForge: false
  burnWeaponIds: any[]
  weaponRename: string
  haveRename: string
  onError: boolean
  hideWeapons: any[]
}

export default Vue.extend({
  data() {
    return {
      showBlacksmith: true,
      showDustForge: false,
      showReforgeDust: false,
      reforgeWeaponId: null,
      burnWeaponId: null,
      selectedNft: null,
      forgeCost: '0',
      reforgeCost: '0',
      dustReforgeCost: '0',
      burnCost: '0',
      disableForge: false,
      newForged: [],
      currentListofWeapons: [],
      spin: false,
      lesserDust: '0',
      greaterDust: '0',
      powerfulDust: '0',
      dust: [],
      allowDustForge: false,
      burnWeaponIds: [],
      weaponRename: '',
      haveRename: '0',
      onError: false,
      hideWeapons: [],
    } as Data
  },

  computed: {
    ...(mapState([
      'defaultAccount',
      'ownedWeaponIds',
      'ownedShieldIds',
    ]) as Accessors<StoreMappedState>),
    ...(mapGetters([
      'contracts',
      'ownWeapons',
      'nftsCount',
      'ownShields',
      'getPowerfulDust',
      'getGreaterDust',
      'getLesserDust',
    ]) as Accessors<StoreMappedGetters>),

    isRenameProfanish(): boolean {
      return isProfaneIsh(this.weaponRename)
    },

    cleanRename(): string {
      return getCleanName(this.weaponRename)
    },
  },

  watch: {
    reforgeWeaponId() {
      this.burnWeaponId = null
    },
  },

  async created() {
    if (!this.contracts.CryptoWars) return
    // const forgeCost = await this.contracts.CryptoWars.methods.mintWeaponFee().call({ from: this.defaultAccount });
    const skillForgeCost = 0 /* await this.contracts.CryptoWars.methods.usdToxBlade(forgeCost).call({ from: this.defaultAccount });*/
    this.forgeCost = new BN(skillForgeCost).div(new BN(10).pow(18)).toFixed(4)

    const reforgeCost = await this.contracts.CryptoWars.methods
      .reforgeWeaponFee()
      .call({ from: this.defaultAccount })
    const skillReforgeCost = await this.contracts.CryptoWars.methods
      .usdToxBlade(reforgeCost)
      .call({ from: this.defaultAccount })
    this.reforgeCost = new BN(skillReforgeCost)
      .div(new BN(10).pow(18))
      .toFixed(4)

    const reforgeDustCost = await this.contracts.CryptoWars.methods
      .reforgeWeaponWithDustFee()
      .call({ from: this.defaultAccount })
    const skillDustReforgeCost = await this.contracts.CryptoWars.methods
      .usdToxBlade(reforgeDustCost)
      .call({ from: this.defaultAccount })
    this.dustReforgeCost = new BN(skillDustReforgeCost)
      .div(new BN(10).pow(18))
      .toFixed(4)

    const burnCost = await this.contracts.CryptoWars.methods
      .burnWeaponFee()
      .call({ from: this.defaultAccount })
    const skillBurnCost = await this.contracts.CryptoWars.methods
      .usdToxBlade(burnCost)
      .call({ from: this.defaultAccount })
    this.burnCost = new BN(skillBurnCost).div(new BN(10).pow(18)).toFixed(4)
    this.hideWeapons = this.ownedWeaponIds
    // if(!this.contracts.WeaponRenameTagConsumables) return;
    // this.haveRename = await this.contracts.WeaponRenameTagConsumables.methods.getItemCount().call({ from: this.defaultAccount });
  },

  methods: {
    ...mapCacheActions(['fetchTotalWeaponRenameTags']),
    ...mapActions([
      'reforgeWeapon',
      'renameWeapon',
      'fetchTotalWeaponRenameTags',
      'burnWeapon',
      'reforgeWeaponWithDust',
      'massBurnWeapons',
    ]),

    relayFunction(offset: number) {
      try {
        this.viewNewWeapons(offset)
      } catch (e) {
        console.error(e)
        this.onError = true
      }
    },

    onShowForgeDetails() {
      ;(this.$refs['forge-details-modal'] as BModal).show()
    },

    showDustReforgeConfirmation() {
      if (
        this.reforgeWeaponId !== null &&
        (this.lesserDust !== '0' ||
          this.greaterDust !== '0' ||
          this.powerfulDust !== '0')
      ) {
        ;(this.$refs['dustreforge-confirmation-modal'] as BModal).show()
      }
    },

    showMassDustConfirmation() {
      ;(this.$refs['mass-dust-confirmation-modal'] as BModal).show()
    },

    displayDustReforge() {
      this.showBlacksmith = false
      this.showReforgeDust = true
      this.showDustForge = false
      this.lesserDust = '0'
      this.greaterDust = '0'
      this.powerfulDust = '0'
    },
    displayDustCreation() {
      return (
        (this.showBlacksmith = false),
        (this.showDustForge = true),
        (this.showReforgeDust = false),
        (this.hideWeapons = this.ownedWeaponIds)
      )
    },
    displayBlacksmith() {
      this.showBlacksmith = true
      this.showDustForge = false
      this.showReforgeDust = false
    },
    cancelReforge() {
      this.showBlacksmith = true
      this.showDustForge = false
      this.showReforgeDust = false
      this.burnWeaponIds = []
      this.hideWeapons = this.ownedWeaponIds
      this.lesserDust = '0'
      this.greaterDust = '0'
      this.powerfulDust = '0'
      this.reforgeWeaponId = null
    },
    clearAllMassBurn() {
      return (this.burnWeaponIds = []), (this.hideWeapons = this.ownedWeaponIds)
    },
    getWeaponToUpgrade() {
      return this.ownWeapons.find((x) => x.id === this.reforgeWeaponId)
    },

    addBurnWeapon(id: number) {
      this.burnWeaponIds.push(id.toString())
      this.hideWeapons = this.hideWeapons.filter(
        (val) => !this.burnWeaponIds.includes(val)
      )
      this.burnWeaponId = null
    },

    removeBurnWeapon(id: number) {
      this.hideWeapons.push(id.toString())
      this.burnWeaponIds = this.burnWeaponIds.filter((x) => x !== id.toString())
    },

    viewNewWeapons(offset: number) {
      this.newForged = []
      this.ownedWeaponIds.forEach((x) => {
        this.newForged.push(x)
      })

      this.newForged.splice(0, this.ownedWeaponIds.length - offset + 1)

      // eslint-disable-next-line no-constant-condition
      if (this.newForged.length > 0 && !this.onError) {
        this.spin = true
        ;(this.$refs['new-weapons'] as BModal).show()

        setTimeout(() => {
          this.spin = false
        }, 10000)
      }
    },

    closeNewWeaponsModal() {
      ;(this.$refs['new-weapons'] as BModal).hide()
    },

    async onReforgeWeaponWithDust() {
      try {
        ;(this.$refs['new-weapons'] as BModal).show()
        this.spin = true
        //@ts-ignore
        await this.reforgeWeaponWithDust({
          reforgeWeaponId: this.reforgeWeaponId,
          lesserDust: this.lesserDust,
          greaterDust: this.greaterDust,
          powerfulDust: this.powerfulDust,
        })

        this.lesserDust = '0'
        this.greaterDust = '0'
        this.powerfulDust = '0'
        this.spin = false
      } catch (e) {
        console.error(e)
        ;(this as any).$dialog.notify.error(
          'Could not ReForge sword: insufficient funds / Dust or transaction denied.'
        )
        ;(this.$refs['new-weapons'] as BModal).hide()
        this.spin = false
      }
    },

    async onMassBurnWeapons() {
      try {
        ;(this.$refs['new-dust'] as BModal).show()
        this.spin = true
        //@ts-ignore
        await this.massBurnWeapons({
          burnWeaponIds: this.burnWeaponIds,
        })
        this.burnWeaponIds = []
        this.burnWeaponId = null
        this.spin = false
      } catch (e) {
        console.error(e)
        ;(this.$refs['new-dust'] as BModal).hide()
        this.spin = false
        ;(this as any).$dialog.notify.error(
          'Could not burn sword: insufficient funds or transaction denied.'
        )
      }
    },
    canRename() {
      return this.reforgeWeaponId !== null && +this.haveRename > 0
    },
    openRenameWeapon() {
      ;(this.$refs['weapon-rename-modal'] as BModal).show()
    },
    async renameWeaponCall() {
      if (this.weaponRename === '' || this.reforgeWeaponId === null) {
        return
      }

      //@ts-ignore
      await this.renameWeapon({
        id: this.reforgeWeaponId,
        name: this.weaponRename,
      })
      if (this.contracts.WeaponRenameTagConsumables) {
        this.haveRename =
          await this.contracts.WeaponRenameTagConsumables.methods
            .getItemCount()
            .call({ from: this.defaultAccount })
      }
    },
  },

  components: {
    WeaponGrid,
    BigButton,
    WeaponIcon,
    BModal,
  },
})
</script>

<style scoped>
.tab-content {
  margin-top: 47px !important;
}

.new-weapon-header-text {
  color: #9e8a57;
  font-size: 34px;
}

.weapon-container {
  /* border-right: 1px solid #9e8a57; */
}

.weapon-container h1 {
  font-size: 2rem;
}

.burn-tab,
.reforge-tab {
  background-image: url('../assets/v2/blacksmith-weapon-bg.svg');
  background-size: 100%;
  background-position: top center;
  background-repeat: no-repeat;
  max-height: 868px;
  height: 100%;
  padding: 26px 20px;
  border: 0.5px solid #3cde9b;
}

.burn-tab {
  padding-top: 10px;
}

.confirmReforge {
  border-radius: 0.15em;
  text-decoration: none;
  font-weight: 400;
  text-align: center;
  height: 100%;
}

.confirmReforge:active {
  top: 0.1em;
}

.weapon {
  width: 100%;
  height: 58%;
  padding-bottom: 50px;
  border-radius: 5px;
  position: relative;
}

.weapon .blank {
  font-size: 24px;
  font-weight: bold;
}

.dust-box-modal .weapon {
  height: auto;
}

.dust-container {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.confirmReforge .dust-list {
  padding-top: 50px;
}

.confirmReforge .dust-quantity-reforge {
  font-weight: bold;
  font-size: 18px;
}

.btn-confirm-reforge {
  background-size: contain !important;
  padding: 0;
  position: relative;
  text-align: center;
}

.reforge-info {
  position: absolute;
  top: 130%;
  left: 25px;
  width: 160px;
  height: 110px;
  border-radius: 16px;
  background-color: #000;
  border: 1px solid #ecd931;
  text-align: left;
  padding-left: 15px;
  padding-top: 8px;
}

.reforge-info::before {
  content: '';
  position: absolute;
  top: -20px;
  left: 50%;
  transform: translateX(-50%);
  border-style: solid;
  border-width: 10px;
  border-color: transparent transparent #ecd931 transparent;
}

.reforge-info span,
.reforge-info-modal span {
  color: #ecd931;
}

.modal-alert {
  color: #ca6779;
}

.multiForging {
  align-items: center;
}

/* .headings {
  min-height: 13em;
  min-width: 13em;
  max-height: 13em;
  max-width: 13em;
  border-radius:0.15em;
  box-sizing: border-box;
  font-weight:400;
  width: 13em;
  margin: 1em auto 2em;
} */

.upgrade-container {
  border-top: 1px solid #9e8a57;
  border-left: 1px solid #9e8a57;
}

.centered-modal {
  display: inline-block;
}

.centered-text-modal {
  justify-content: center;
  text-align: center;
}

.centered-icon {
  align-self: center;
  margin-left: 5px;
}

.confirmReforge .weapon-icon-wrapper,
.modal-body .weapon-icon-wrapper {
  width: 100%;
  height: 100%;
}

.seperate {
  width: 100%;
  height: 12px;
  background-image: url('../assets/v2/blacksmith-seperate.svg');
  background-repeat: no-repeat;
  background-size: cover;
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

.dust-1 .dust-quantity-burn,
.dust-1 .range {
  color: #53adf7;
}

.dust-2 .dust-quantity-burn,
.dust-2 .range {
  color: #5ee146;
}

.dust-3 .dust-quantity-burn,
.dust-3 .range {
  color: #f03559;
}

.dust-1 .range input {
  background-color: #53adf7;
}

.dust-2 .range input {
  background-color: #5ee146;
}

.dust-3 .range input {
  background-color: #f03559;
}

.dust-1 .range input::-webkit-slider-thumb {
  background-color: #53adf7;
}

.dust-2 .range input::-webkit-slider-thumb {
  background-color: #5ee146;
}

.dust-3 .range input::-webkit-slider-thumb {
  background-color: #f03559;
}

.btn-cancel-reforge {
  background-image: url('../assets/v2/btn-blue-bg-small.svg') !important;
  background-position: center;
  max-width: 145px;
}

.character-item.weapon.no-corner {
  padding: 10px;
  margin: 0;
}

.spinner-grow {
  color: #f48761;
}

.burn-weapons {
  height: 590px;
  max-height: 590px;
  overflow-y: auto;
}

.burn-weapons::-webkit-scrollbar {
  display: block;
  width: 8px;
}

.burn-weapons::-webkit-scrollbar-track {
  background-color: rgba(0, 0, 0, 0.3);
}

.burn-weapons::-webkit-scrollbar-thumb {
  background: #f48761;
}

.burn-footer {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 70px 0;
}

.burn-weapons.modal-weapons {
  height: 290px;
  max-height: 290px;
  width: 90%;
}

.dust-quantity-burn {
  font-size: 20px;
  font-weight: bold;
  width: 135px;
  text-align: center;
}

.link-container {
  display: flex;
  align-items: center;
  margin: 15px 8px;
  padding: 0 10px;
  border: 1px solid #3cde9b;
  font-size: 1.2em;
  background-color: rgba(0, 0, 0, 0.5);
}

.link-container .text {
  display: flex;
  font-size: 1.2em;
  padding: 10px 0;
}

.link-to-wiki {
  margin-left: 5px;
  width: 90%;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.link-container svg {
  margin-right: 5px;
  width: 30px;
}

@media (max-width: 1000px) {
  .mobile-flip {
    display: flex;
    flex-flow: column-reverse;
  }
}

@media (max-width: 1024px) {
  .burn-tab,
  .reforge-tab {
    margin-left: auto;
    margin-right: auto;
    margin-top: 28px;
    max-width: 590px;
    height: 990px;
  }
}

@media all and (max-width: 767.98px) {
  .dust-box .d-flex {
    flex-wrap: wrap;
    justify-content: center;
  }

  .dust-box .d-flex .btn-secondary {
    margin: inherit;
    margin-bottom: 1rem;
  }

  .burn-tab,
  .reforge-tab {
    max-height: none;
    height: 880px;
  }

  .weapon {
    height: 45%;
  }

  .seperate {
    background-size: contain;
  }

  .btn-cancel-reforge {
    background-size: 120px 40px !important;
    font-size: 14px;
    min-width: 120px;
  }

  .btn-confirm-reforge {
    min-width: 178px;
    background-position: right center;
    font-size: 14px;
  }

  .burn-weapons.modal-weapons {
    height: 220px;
  }

  .link-container {
    font-size: 1em;
  }

  .link-container svg {
    width: 25px;
  }
}
</style>
