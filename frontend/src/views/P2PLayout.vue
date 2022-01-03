<template>
  <div id="__next">
    <div class="disabled-animation-modal"></div>
    <div class="z" id="training">
      <div class="z-body">
           <b-modal id="fightResultsModal" hide-footer title="Fight Results">
              <CombatResults v-if="resultsAvailable" :results="fightResults" />
              <b-button class="mt-3 btn-buy" block @click="$bvModal.hide('fightResultsModal')">Close</b-button>
            </b-modal>

            <b-modal id="error-request-fight" hide-header centered hide-footer title="Fight Results">
              <!-- <CombatResults v-if="resultsAvailable" :results="fightResults" /> -->
              <div class="containerContentModal">
                <span class="titleModalBox">CryptoWar Message</span>
                <span>{{errorMessage}}</span>
              <button class="mt-3" block @click="$bvModal.hide('error-request-fight')">Close</button>
              </div>
            </b-modal>
        <div class="page-header" id="marketplace">
              <div class="col-sm-12">
                <span class="heroAmount">{{ownCharacters.length}} <span class="heroAmountWhiteText">Heroes In Career Mode</span></span>
                <div class="row justify-content-center align-items-center">
                  <div class="col-xs-12 p-0 col-sm-3 col-md-2">
                    <div
                      v-if="characterId"
                      @click="openHeroPicker()"
                      class="character-item"
                    >
                      <div class="art">
                        <BackgroundItem
                            v-if="characterId"
                            :character="characters[characterId]"
                            :selectedCharacterId="characterId"
                            :selectedWeaponId="weaponId"
                          />
                      </div>
                    </div>
                  </div>
                  <div class="col-xs-12 p-0 col-sm-3 col-md-2 mr-5">
                      <div
                        class="weaponContainer"
                        v-if="selectedWeapon"
                        @click="openWeaponPicker()"
                      >
                        <WeaponBackground
                          :weapon="selectedWeapon"
                        />
                      </div>
                  </div>
                <!-- <div class="col-6"> -->
                  <div class="col-xs-12 p-0 col-sm-5 col-md-4">
                  <div class="panelInfor">
                    <span id="titleBox">Your Information</span>
                    <div class="container">
                      <span class="titleAmountHeroes">HEROES available</span>
                      <div class="boxText">
                        <span>{{ownCharacters.length}}</span>
                      </div>
                    </div>
                    <div class="container">
                      <div class="selectButton" @click="openHeroPicker()">
                        <span>SELECT HERO</span>
                      </div>
                      <div class="selectButton" @click="openWeaponPicker()">
                        <span>SELECT WEAPON</span>
                      </div>
                    </div>
                    <div class="containerAround">
                      <span>Amount a match</span>
                      <div style="containerInputAmount">
                        <input class="inputAmountBox" type="text" v-model="matchReward">
                      </div>
                    </div>
                    <div class="containerAround">
                      <span>Total deposit</span>
                      <div style="containerInputAmount">
                        <div class="cwIconBlock"></div>
                        <input class="inputAmountBox" type="text" v-model="totalDeposit">
                      </div>
                    </div>
                    <div class="containerTwoRoomButton">
                      <div class="createRoomButton" @click="handleCreateRoom()">
                        <span class="titleCreateRoom">List HERO to Career Mode</span>
                      </div>
                      <div class="createRoomButton">
                        <span class="titleCreateRoom">List HERO to Challenge Mode</span>
                      </div>
                    </div>
                  </div>
                  </div>
                <!-- </div> -->
                </div>
              </div>
            </div>
        </div>
        <div class="bodyPage">
          <div class="containerContent">
            <div class="containerRight">
              <div class="tabView">
                <ul class="tab-categories nav nav-tabs">
                  <!-- <li class="nav-item">
                        <a
                          :class="`nav-link ${
                            currentTab === 'challenge_mode' ? 'active' : ''
                          }`"
                          @click="currentTab = 'challenge_mode'"
                          >Challenge Mode
                          <span class="badge badge-secondary badge-pill"
                            >123</span
                          ></a
                        >
                      </li> -->
                  <li class="nav-item">
                    <a
                      :class="
                        `nav-link ${
                          currentTab === 'career_mode' ? 'active' : ''
                        }`
                      "
                      @click="currentTab = 'career_mode'"
                      >Career Mode
                      <span class="badge badge-secondary badge-pill">{{
                        careerModeRooms.length
                      }}</span></a
                    >
                  </li>
                  <li class="nav-item">
                    <a
                      :class="
                        `nav-link ${currentTab === 'request' ? 'active' : ''}`
                      "
                      @click="currentTab = 'request'"
                      >Requests
                      <span class="badge badge-success badge-pill">
                        {{ this.filterCareerModeRequest(careerModeRequest).length }}</span
                      ></a
                    >
                  </li>
                </ul>
              </div>
              <div>
                <div v-if="currentTab === 'challenge_mode'">
                  <div
                    v-for="r in careerModeRooms"
                    :key="r.characterId"
                    class="justify-content-center row"
                  >
                    <span>challenge_mode</span>
                  </div>
                </div>
                <div v-if="currentTab === 'career_mode'">
                  <ul class="listCareerMode">
                    <div
                      v-for="r in careerModeRooms"
                      :key="r.characterId"
                      class="row"
                    >
                      <CharacterRoom
                        :characterId="r.characterId"
                        :room="r"
                        :selectedCharacterId="characterId"
                        :selectedWeaponId="weaponId"
                        :isRequest="true"
                      />
                    </div>
                  </ul>
                </div>

                <div v-if="currentTab === 'request'">
                  <ul class="listCareerMode">
                  <div
                    v-for="r in this.filterCareerModeRequest(careerModeRequest)"
                    :key="r.id"
                    class="row"
                  >
                    <RoomRequest :request="r" :handleFight="handleFight" />
                  </div>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
    <div class="Toastify"></div>
    <b-modal
      ref="hero-career-mode-selector"
      @ok="openHeroPicker"
      size="large"
      hide-footer
      centered
    >
      <!-- <template #modal-title> Select hero for career mode </template> -->
      <character-select-list :value="currentCharacterId" v-model="characterId" />
    </b-modal>

    <b-modal
      class="centered-modal"
      ref="weapon-career-mode-selector"
      @ok="openWeaponPicker"
      size="large"
    >
      <template #modal-title> Select weapon for career mode </template>
      <weapon-grid v-model="weaponId" isModal/>
    </b-modal>
  </div>
</template>
<script lang="ts">
import { BModal } from "bootstrap-vue";
import Vue from "vue";
import { mapGetters, mapState, mapActions } from "vuex";
import BackgroundItem from "../components/BackgroundItem.vue";
import WeaponGrid from "@/components/smart/WeaponGrid.vue";
import CharacterRoom from "@/components/CharacterRoom.vue";
import RoomRequest from "@/components/RoomRequest.vue";
import WeaponBackground from '@/components/WeaponSelect.vue';
import CombatResults from "@/components/CombatResults.vue";
import CharacterSelectList from "../components/smart/CharacterSelectList.vue";
// import CustomModal from "@/components/CustomModal.vue";
// import InforBar from '@/components/smart/InforBar.vue';

interface IData {
  characterId?: number;
  weaponId?: number;
  selectedCharacter?: any;
  selectedWeapon?: any;
  currentTab: "career_mode" | "request";
  matchReward: number;
  totalDeposit: number;
  fetchRoomInterval: any;
  fetchRequestInterval: any;
  waitingResults: any,
  resultsAvailable: any,
  fightResults: any,
  error: any,
  room: any,
  errorMessage: string;
  isVisibleModal: boolean;
  showHeroPicker: boolean;
}

export default Vue.extend({
  components: {
    BackgroundItem,
    WeaponGrid,
    CharacterRoom,
    RoomRequest,
    WeaponBackground,
    CombatResults,
    CharacterSelectList
    // CustomModal
    // InforBar
  },
  data() {
    return {
      characterId: undefined,
      weaponId: undefined,
      selectedCharacter: null,
      selectedWeapon: null,
      currentTab: "career_mode",
      matchReward: 0,
      totalDeposit: 0,
      fetchRoomInterval: null,
      fetchRequestInterval: null,
      waitingResults: false,
      resultsAvailable: false,
      fightResults: null,
      error: null,
      room: null,
      errorMessage: '',
      isVisibleModal: false,
      showHeroPicker: false
    } as IData;
  },

  computed: {
    ...mapState([
      "characters",
      "currentCharacterId",
      "careerModeRooms",
      "careerModeRequest"
    ]),
    ...mapGetters(["currentCharacter", "getCharacterName", "ownWeapons", "ownCharacters"]),
    // ...mapMutations(["setIsInCombat"]),

    character(): any {
      if (!this.currentCharacter) {
        return {
          id: null,
          name: "???",
          level: -1,
          experience: -1
        };
      }

      const c = this.currentCharacter;

      return {
        id: c.id,
        name: this.getCharacterName(c.id),
        level: c.level,
        experience: c.xp
      };
    },
    updateResults() {
      // @ts-ignore
      return [this.fightResults, this.error];
    },
  },
  watch: {
    characterId(val) {
      // @ts-ignore
      this.selectedCharacter = this.characters[val];
    },
    weaponId(val) {
      // @ts-ignore
      this.selectedWeapon = this.ownWeapons.find(
        (w: any) => !!w && w.id === val
      );
    },
    async updateResults([fightResults, error]) {
      // @ts-ignore
      this.resultsAvailable = fightResults !== null;
      // @ts-ignore
      this.waitingResults = fightResults === null && error === null;
      // this.setIsInCombat(this.waitingResults);
      if(fightResults) {
        console.log('test gifhgt', fightResults);
      }
      // @ts-ignore
      if (this.resultsAvailable && error === null) this.$bvModal.show('fightResultsModal');
    },
  },
  methods: {
    ...mapActions(["createCareerRoom", "getCareerRooms", "getRequests", "fight"]),
    openHeroPicker() {
      (this.$refs["hero-career-mode-selector"] as BModal).show();
      // this.showHeroPicker = true;
    },
    openWeaponPicker() {
      (this.$refs["weapon-career-mode-selector"] as BModal).show();
    },
    handleCreateRoom() {
      // @ts-ignore
      console.log('show me the answer', this.characterId);
      // @ts-ignore
      if(!this.selectedCharacter || !this.selectedWeapon) {
        // @ts-ignore
        this.errorMessage = 'Please select weapon and hero!';
        // @ts-ignore
        this.$bvModal.show('error-request-fight');
      }
      else {
        // @ts-ignore
        this.createCareerRoom({
        // @ts-ignore
          character: this.characterId,
          // @ts-ignore
          weapon: this.weaponId,
          // @ts-ignore
          matchReward: this.matchReward,
          // @ts-ignore
          totalDeposit: this.totalDeposit
        });
      }

    },
    async handleFight(roomId: any,requestId: any) {
      // @ts-ignore
      this.waitingResults = true;
      // @ts-ignore
      this.fightResults = null;
      // @ts-ignore
      this.error = null;
      // this.setIsInCombat(this.waitingResults);
      try{
        // @ts-ignore
        const results = await this.fight({
          roomId, requestId
        });
        console.log('gi v ta', results);
        // @ts-ignore
        this.fightResults=results;
        // @ts-ignore
        this.error=null;
      } catch (e: any) {
        console.error(e);
        // @ts-ignore
        this.error = e.message;
      }
    },
    filterCareerModeRequest () {
      return this.careerModeRequest.filter((item: any) => !item.done);
    },
  },
  async mounted() {
    // @ts-ignore
    this.fetchRoomInterval = setInterval(async () => {
      // @ts-ignore
      await this.getCareerRooms();
    }, 3000);
    // @ts-ignore
    this.fetchRequestInterval = setInterval(async () => {
      // @ts-ignore
      await this.getRequests();
    }, 3000);
  }
});
</script>
<style>
  .containerContentModal button{
    border: none;
    background-color: transparent;
    background-image: url(../assets/v2/btn-fight.png);
    background-repeat: no-repeat;
    background-size: contain;
    height: 30px;
    width: 100px;
    color: #fff;
  }
</style>
