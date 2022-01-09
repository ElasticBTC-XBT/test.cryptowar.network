<template>
  <div class="body main-font">
    <CombatPVPFight :propCancelRequest = cancelRequest v-if="checkFight" />
    <div v-if="!checkFight" class="container">
      <div class="row">
        <div class="col-12">
          <div class="quantity-heroes">
            <div><span>{{this.filterCareerModeRooms(careerModeRooms).length}}</span> Heroes In Career Mode</div>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-12 d-flex justify-content-end">
            <div class="info-user-btn">
                <div class="cost"><div></div> {{this.convertReward(rewardPvp)}}</div>
              <button @click="handleClaimTokenReward()">Claim Reward PvP</button>
            </div>
        </div>
      </div>
      <b-modal id="listHeroToCareerModal" hide-footer hide-header-close>
        <div class="headerModalCareer"></div>
        <div class="listHeroToCareerModal-head">CryptoWar Message</div>
        <div class="listHeroToCareerModal-body" v-if="errorMessage">{{errorMessage}}</div>
        <div class="listHeroToCareerModal-body" v-if="!errorMessage">Listing HERO to Career: <span>Done</span></div>
        <button @click="$bvModal.hide('listHeroToCareerModal'), careerMode = true, changeMode = false, requestChallenge = false,
          checkSelect = false, addClass = ''" class="listHeroToCareerModal-btn confirm">GO TO CHECK</button>
      </b-modal>
      <b-modal id="showWeaponModal" hide-footer hide-header-close>
        <div class="headerModalCareer"></div>
        <div class="listHeroToCareerModal-body" v-if="errorMessage">{{errorMessage}}</div>
        <div class="itemWeapon" >
            <WeaponSelect :weapon="this.weaponToShow"/>
          </div>
        <button @click="$bvModal.hide('showWeaponModal'), addClass = ''" class="weaponShow-btn confirm">CLOSE</button>
      </b-modal>
      <b-modal id="fightErrorModal" hide-footer>
        <div class="icon-close-container"><div class="icon-close" @click="$bvModal.hide('fightErrorModal')"></div></div>
        <div class="listHeroToCareerModal-head">CryptoWar Message</div>
        <div class="listHeroToCareerModal-body" v-if="errorMessage">{{errorMessage}}</div>
        <button @click="$bvModal.hide('fightErrorModal'), careerMode = true, changeMode = false, requestChallenge = false,
          checkSelect = false, addClass = ''" class="listHeroToCareerModal-btn confirm">GO TO CHECK</button>
      </b-modal>
      <b-modal id="claimModal" hide-footer>
        <div class="icon-close-container"><div class="icon-close" @click="$bvModal.hide('claimModal')"></div></div>
        <div class="listHeroToCareerModal-head">CryptoWar Message</div>
        <div class="listHeroToCareerModal-body" v-if="errorMessage">{{errorMessage}}</div>
        <div class="listHeroToCareerModal-body" v-if="!errorMessage">Claim xBlade<span>Done</span></div>
        <button @click="$bvModal.hide('claimModal'), careerMode = true, changeMode = false, requestChallenge = false,
          checkSelect = false, addClass = ''" class="listHeroToCareerModal-btn confirm">GO TO CHECK</button>
      </b-modal>
      <b-modal id="loadingModal" hide-footer centered hide-header-close>
        <div class="centerLoading">
          <pulse-loader :loading="true"/>
        </div>
      </b-modal>
      <b-modal id="requestFightModal" hide-footer>
        <div class="icon-close-container"><div class="icon-close" @click="$bvModal.hide('listHeroToChallengeModal')"></div></div>
        <div class="listHeroToChallengeModal-head">CryptoWar Message</div>
        <div class="listHeroToCareerModal-body" v-if="errorMessage">{{errorMessage}}</div>
        <div class="listHeroToCareerModal-body" v-if="!errorMessage">Request Fight: <span>Done</span></div>
        <button @click="$bvModal.hide('requestFightModal'), careerMode = true, changeMode = false, requestChallenge = false,
          checkSelect = false, addClass = ''" class="listHeroToChallengeModal-btn confirm">GO TO CHECK</button>
      </b-modal>
      <b-modal id="fightResult" hide-footer>
        <div class="icon-close-container"><div class="icon-close" @click="$bvModal.hide('listHeroToChallengeModal')"></div></div>
        <div class="listHeroToChallengeModal-head">CryptoWar Message</div>
        <FightResult :results="fightResults"/>
        <button @click="$bvModal.hide('fightResult')" class="listHeroToChallengeModal-btn confirm">GO TO CHECK</button>
      </b-modal>
      <b-modal id="cancelCareerModal" hide-footer hide-header-close>
        <div class="listHeroToChallengeModal-head">CryptoWar Message</div>
        <div class="listHeroToCareerModal-body" v-if="errorMessage">{{errorMessage}}</div>
        <div class="listHeroToChallengeModal-body" v-if="!errorMessage">Cancel Career Mode: <span>Done</span></div>
        <button @click="$bvModal.hide('cancelCareerModal')" class="listHeroToChallengeModal-btn confirm">GO TO CHECK</button>
      </b-modal>
      <div class="row">
        <div :class="addClass" class="col-12 info-box">
          <div v-if="selectedCharacter" class="item-selected">
            <div class="item">
              <div class="info">
                <div class="info-head">
                    <div
                    :class="selectedCharacter.traitName.toLowerCase() + '-icon'">
                    </div>
                </div>
                <div class="item-id">
                    <span>#{{selectedCharacter.id}}</span>
                    <div class="leve">Lv.{{selectedCharacter.level+1}}</div>
                </div>
                <div
                  :style="{
                    'background-image': 'url(' + getCharacterTrait(selectedCharacter) + ')',
                    'z-index': 999
                    }"
                 class="img-hero-around">
                  <div
                    :style="{
                    'background-image': 'url(' + getCharacterArt(selectedCharacter) + ')',
                    'z-index': 999
                    }"
                    class="img-hero"></div>
                </div>
                <div class="info-footer">
                  <div class="hero-name">{{getCleanCharacterName(selectedCharacter.id)}}</div>
                  <div class="orner-hero">Owner: <span>{{renderOwner(selectedCharacter.owner)}}</span></div>
                </div>
              </div>
            </div>
          </div>
          <div class="item-selected" v-if="selectedWeapon">
          <div class="item" >
            <WeaponSelect :weapon="selectedWeapon"/>
          </div>
          </div>
          <div class="info-user">
            <div class="info-user-title">Your Information</div>
            <div class="info-user-body">
              <span>HEROES available</span>
              <div>{{ownCharacters.length}}</div>
            </div>
            <div class="info-user-btn">
              <button @click="openHeroSelect">SELECT HERO</button>
              <button @click="openWeaponSelect">SELECT WEAPON</button>
            </div>
            <div v-if="selectedCharacter" class="info-user-footer">
              <div class="info-user-footer-item">
                <div>Amount a match
                  <input class="inputAmountBox" type="text" v-model="matchReward">
                </div>
              </div>
              <div class="info-user-footer-item">
                <div>
                  <span>
                    Toal deposit
                    <span>Min = value * 210%</span>
                  </span>
                  <input class="inputAmountBox" type="text" v-model="totalDeposit">
                </div>
              </div>
              <button @click="handleCreateRoom()">List HERO to Career Mode</button>
              <!-- <button @click="$bvModal.show('listHeroToChallengeModal')">List HERO to Challenge Mode</button> -->
            </div>
          </div>
        </div>
      </div>
      <b-modal id="selectHeroOrWeaponModal" class="modal-box" hide-footer>
        <!-- <div class="title-results">{{titleResults}}</div>
        <CombatResults v-if="resultsAvailable" :results="fightResults" /> -->
        <div class="row list" v-if="selectHero">
          <div class="item" v-for="i in ownCharacters" :key="i.id">
            <div class="info">
              <div class="info-head">
                  <div
                    :class="i.traitName.toLowerCase() + '-icon'">
                    </div>
              </div>
              <div class="item-id">
                  <span>#{{i.id}}</span>
                  <div class="leve">Lv.{{i.level +1}}</div>
              </div>
              <div
                :style="{
                    'background-image': 'url(' + getCharacterTrait(i) + ')',
                    'z-index': 999
                    }"
               class="img-hero-around">
                <div
                  :style="{
                    'background-image': 'url(' + getCharacterArt(i) + ')',
                    'z-index': 999
                    }"
                  class="img-hero"></div>
              </div>
              <div class="info-footer">
                <div class="hero-name">{{getCleanCharacterName(i.id)}}</div>
                <div class="orner-hero"><span>Owner: {{renderOwner(i.owner)}}</span></div>
              </div>
            </div>
            <div class="button-container"><button @click="onSelectHero(i), checkCurrentMode(),
              $bvModal.hide('selectHeroOrWeaponModal'), addClass = 'background'" class="btn-request-fight">SELECT</button></div>
          </div>
        </div>
        <div class="row list" v-if="selectWeapon">
          <div class="item" v-for="i in ownWeapons" :key="i.id">
            <WeaponSelect :weapon="i"/>
            <div class="button-container"><button @click="onSelectWeapon(i), checkCurrentMode(),
              $bvModal.hide('selectHeroOrWeaponModal'),  addClass = 'background'" class="btn-request-fight">SELECT</button></div>
          </div>
        </div>
      </b-modal>
      <div class="row">
        <div class="col-xl-3 col-12">
          <div class="search-hero">
            <input type="text" placeholder="Search Hero's ID" />
          </div>
        </div>
        <div class="col-xl-9 col-12 nav-option-box">
          <div class="nav-option">
            <b-nav pills>
              <b-nav-item
                class="nav-item"
                @click="
                  checkActive(),
                  (changeMode = false),
                    (careerMode = true),
                    (requestChallenge = false),
                    (myRequestMode= false)
                "
                :active="careerMode"
                ><div>CAREER MODE <div>{{this.filterCareerModeRooms(careerModeRooms).length}}</div></div></b-nav-item
              >
              <b-nav-item
                class="nav-item"
                @click="
                  checkActive(),
                  (changeMode = false),
                    (careerMode = false),
                    (requestChallenge = true),
                    (myRequestMode= false)
                "
                :active="requestChallenge"
                ><div>REQUEST TO CHALLENGE <div>{{this.filterCareerModeRequest(careerModeRequest).length}}</div></div></b-nav-item
              >
              <b-nav-item
                class="nav-item"
                @click="
                  checkActive(),
                  (changeMode = true),
                    (careerMode = false),
                    (requestChallenge = false),
                    (myRequestMode= false)
                "
                :active="changeMode"
                ><div>MY CAREER MODE <div>{{this.filterMyCareerModeRooms(careerModeRooms).length}}</div></div></b-nav-item
              >
              <b-nav-item
                class="nav-item"
                @click="
                  checkActive(),
                  (changeMode = false),
                    (careerMode = false),
                    (requestChallenge = false),
                    (myRequestMode= true)
                "
                :active="myRequestMode"
                ><div>MY REQUEST<div>{{this.filterMyRequestRoom(this.myCareerModeRequest).length}}</div></div></b-nav-item
              >
            </b-nav>
          </div>
        </div>
      </div>
      <b-modal id="requestSelect" class="modal-box" hide-footer>
        <div class="icon-close" @click="$bvModal.hide('requestSelect')"></div>
        <div class="requestSelect-head">Request battle to HERO #123</div>
        <div class="requestSelect-body">
          <div>Amount request
            <div><div></div><span>100</span></div>
          </div>
        </div>
        <button @click="$bvModal.hide('requestSelect')" class="requestSelect-btn confirm">CONFIRM</button>
      </b-modal>
      <div v-if="changeMode">
          <div class="row list-heroes" style="margin-left: 0">
          <div class="itemCareer" v-for="i in this.filterMyCareerModeRooms(careerModeRooms)" :key="i.id">
            <CharacterRoom
              :characterId="i.characterId"
              :room="i"
              :selectedCharacterId="i.characterId"
              :selectedWeaponId="i.weaponId"
              :isCancel="true"
              :handleCancelFight="cancelCareerMode"
              :handleShowWeapon="handleShowWeapon"
              />
              <!-- <router-link :to="{ name: 'pvp-fight' }">
              </router-link> -->
          </div>
        </div>
      </div>
      <b-modal id="fightModal" class="modal-box" hide-footer>
        <div class="icon-close" @click="$bvModal.hide('fightModal')"></div>
        <div class="requestSelect-head">You got request battle from Hero #123</div>
        <div class="requestSelect-body">
          <div>Amount request
            <div><div></div><span>100</span></div>
          </div>
        </div>
        <div class="requestSelect-footer">
          <button @click="$bvModal.hide('fightModal')" class="requestSelect-btn reject">REJECT</button>
          <button @click="$bvModal.hide('fightModal')" class="requestSelect-btn fight">FIGHT</button>
        </div>
      </b-modal>
      <div v-if="careerMode">
        <div class="row list-heroes" style="margin-left: 0;">
          <div class="itemCareer" v-for="i in this.filterCareerModeRooms(careerModeRooms)" :key="i.id">
            <CharacterRoom
              :characterId="i.characterId"
              :room="i"
              :selectedCharacterId="i.characterId"
              :selectedWeaponId="i.weaponId"
              :isRequest="true"
              :handleRequestFight="() => handleRequestFight(i.id)"
              :handleShowWeapon="handleShowWeapon"
              />
              <!-- <router-link :to="{ name: 'pvp-fight' }">
              </router-link> -->
          </div>
        </div>
      </div>
      <div v-if="requestChallenge">
          <div class="row list-request" style="margin-left: 0;">
            <div class="itemCareer" v-for="i in this.filterCareerModeRequest(careerModeRequest)" :key="i.id">
            <RoomRequest :request="i" :handleFight="handleFight" :isMine="false" :isDone="false" :handleShowWeapon="handleShowWeapon"/>
            </div>
        </div>
      </div>
      <div v-if="myRequestMode">
          <div class="row list-request" style="margin-left: 0;">
            <div class="itemCareer" v-for="i in this.filterMyRequestRoom(this.myCareerModeRequest)" :key="i.id">
            <RoomRequest
              :request="i"
              :handleFight="handleFight" :isMine="true" :isDone="i.done" :cancelRequestFight="handleCancelRequestFight" :isWin="i.win" :handleShowWeapon="handleShowWeapon"/>
            </div>
        </div>
      </div>
    </div>
    <div v-if="careerModeRooms.length>0" v-observe-visibility="handleScrollToEnd"></div>
</div>
</template>

<script>
// import Character from "../components/Character.vue";
// import BigButton from '../components/BigButton.vue';
// import WeaponGrid from '../components/smart/WeaponGrid.vue';
import { getEnemyArtAround } from "../enemy-art-around";
import { getEnemyArt } from "../enemy-art";
import {
  CharacterPower,
  // CharacterTrait,
  GetTotalMultiplierForTrait,
  WeaponElement,
} from "../interfaces";
// import Hint from '../components/Hint.vue';
// import CombatResults from '../components/CombatResults.vue';
import { toBN, fromWeiEther } from "../utils/common";
// import WeaponIcon from '../components/WeaponIcon.vue';
import { mapActions, mapGetters, mapState, mapMutations } from "vuex";
// import CharacterBar from "../components/CharacterBar.vue";
import CombatPVPFight from "../views/CombatPVPFight.vue";
import { getCleanName } from "../rename-censor";
import { getCharacterArt, getCharacterTrait } from "../character-arts-placeholder";
import CharacterRoom from "@/components/CharacterRoom.vue";
import WeaponSelect from "@/components/WeaponSelect.vue";
import RoomRequest from "@/components/RoomRequest.vue";
import PulseLoader from 'vue-spinner/src/PulseLoader.vue';
import FightResult from "@/components/v2/FightResult.vue";
import { CharacterTrait } from "../interfaces";
// import Events from "../events";

export default {
  props: ['propCheckSelect'],
  data() {
    return {
      selectedWeaponId: null,
      error: null,
      waitingResults: false,
      resultsAvailable: false,
      fightResults: null,
      intervalSeconds: null,
      intervalMinutes: null,
      timeSeconds: null,
      timeMinutes: null,
      changeMode: false,
      careerMode: true,
      requestChallenge: false,
      myRequestMode: false,
      fightXpGain: 16,
      selectedWeapon: null,
      fightMultiplier: Number(localStorage.getItem("fightMultiplier")),
      selectHero: false,
      selectWeapon: false,
      checkSelect: false,
      addClass: "",
      checkFight: false,
      cancelRequest: false,
      checkSelectFromRPS: this.propCheckSelect,
      listWeapon: null,
      selectedCharacter: null,
      matchReward: 0,
      totalDeposit: 0,
      errorMessage: '',
      cursor: 0,
      trait: this.characterTrait,
      listMyRequest: [],
      weaponToShow: null
    };
  },

  computed: {
    ...mapState(["currentCharacterId", "careerModeRooms", "careerModeRequest","characters","ownedWeaponIds", "defaultAccount", "rewardPvp", "myCareerModeRequest"]),
    ...mapGetters([
      "getTargetsByCharacterIdAndWeaponId",
      "ownCharacters",
      "ownWeapons",
      "currentCharacter",
      "currentCharacterStamina",
      "getWeaponDurability",
      "fightGasOffset",
      "fightBaseline",
      "getCharacterName",
      "getWeaponName",
      "charactersWithIds",
    ]),

    targets() {
      return this.getTargetsByCharacterIdAndWeaponId(
        this.currentCharacterId,
        this.selectedWeaponId
      );
    },

    isLoadingTargets() {
      return (
        this.targets.length === 0 &&
        this.currentCharacterId &&
        this.selectedWeaponId
      );
    },

    characterTrait() {
      const characterWithId =
        this.charactersWithIds && this.charactersWithIds([this.character.id]);
      return (
        (characterWithId && CharacterTrait[characterWithId[0].trait]) ||
        CharacterTrait[this.character.trait]
      );
    },

    selections() {
      return [this.currentCharacterId, this.selectedWeaponId];
    },

    updateResults() {
      return [this.fightResults, this.error];
    },
  },

  // watch: {
  //   async selections([characterId, weaponId]) {
  //     if (
  //       !this.ownWeapons
  //         .filter(Boolean)
  //         .find((weapon) => weapon.id === weaponId)
  //     ) {
  //       this.selectedWeaponId = null;
  //     }
  //     await this.fetchTargets({ characterId, weaponId });
  //   },

  //   async updateResults([fightResults, error]) {
  //     this.resultsAvailable = fightResults !== null;
  //     this.waitingResults = fightResults === null && error === null;
  //     this.setIsInCombat(this.waitingResults);
  //     if (this.resultsAvailable && error === null)
  //       this.$bvModal.show("selectHeroOrWeaponModal");
  //     if (this.fightResults[0] === true) {
  //       this.titleResults = "Congratulation!";
  //     } else {
  //       this.titleResults = "Better luck Next Time";
  //     }
  //   },
  // },

  methods: {
    ...mapActions([
      "fetchTargets",
      "doEncounter",
      "fetchFightRewardSkill",
      "fetchFightRewardXp",
      "getXPRewardsIfWin",
      "createCareerRoom",
      "getCareerRooms",
      "getRequests",
      "fight",
      "fetchWeapons",
      "fetchCharacters",
      "requestFight",
      "cancelRequestFight",
      "endCareerMode",
      "getRewardPvp",
      "claimTokenReward",
      "getListParticipatedRoom",
      "cancelRequestFight",
      "fetchWeaponId"
    ]),
    ...mapMutations(["setIsInCombat"]),
    checkActive(){
      if(this.changeMode || this.careerMode || this.requestChallenge){
        this.addClass = "";
        this.checkSelect = false;
      }
    },
    checkCurrentMode(){
      if(this.changeMode){
        this.careerMode = false;
      }
      else if(this.careerMode){
        this.changeMode = false;
      }
    },
    openHeroSelect() {
      if(this.ownCharacters.length === 0) {
        this.errorMessage = "You don't have any hero available!";
        this.$bvModal.show('cancelCareerModal');
      }
      else {
        this.$bvModal.show('selectHeroOrWeaponModal');
        this.selectHero = true;
        this.selectWeapon = false;
      }
    },
    openWeaponSelect() {
      if(this.ownWeapons.length === 0) {
        this.errorMessage = "You don't have any weapon available!";
        this.$bvModal.show('cancelCareerModal');
      }else {
        this.selectHero=false;
        this.selectWeapon=true;
        this.$bvModal.show('selectHeroOrWeaponModal');
      }
    },
    getCharacterArt,
    getCharacterTrait,
    getCleanWeaponName(id, stars) {
      return getCleanName(this.getWeaponName(id, stars));
    },
    getEnemyArt,
    getEnemyArtAround,
    weaponHasDurability(id) {
      return this.getWeaponDurability(id) >= this.fightMultiplier * 3;
    },
    charHasStamina() {
      return this.currentCharacterStamina >= this.staminaPerFight;
    },
    getWinChance(enemyPower, enemyElement) {
      const characterPower = CharacterPower(this.currentCharacter.level);
      const playerElement = parseInt(this.currentCharacter.trait, 10);
      const selectedWeapon = this.ownWeapons
        .filter(Boolean)
        .find((weapon) => weapon.id === this.selectedWeaponId);
      this.selectedWeapon = selectedWeapon;
      const weaponElement = parseInt(WeaponElement[selectedWeapon.element], 10);
      const weaponMultiplier = GetTotalMultiplierForTrait(
        selectedWeapon,
        playerElement
      );
      const totalPower =
        characterPower * weaponMultiplier + selectedWeapon.bonusPower;
      const totalMultiplier =
        1 +
        0.075 * (weaponElement === playerElement ? 1 : 0) +
        0.075 * this.getElementAdvantage(playerElement, enemyElement);
      const playerMin = totalPower * totalMultiplier * 0.9;
      const playerMax = totalPower * totalMultiplier * 1.1;
      const playerRange = playerMax - playerMin;
      const enemyMin = enemyPower * 0.9;
      const enemyMax = enemyPower * 1.1;
      const enemyRange = enemyMax - enemyMin;
      let rollingTotal = 0;
      // shortcut: if it is impossible for one side to win, just say so
      if (playerMin > enemyMax) return "Very Likely";
      if (playerMax < enemyMin) return "Unlikely";

      // case 1: player power is higher than enemy power
      if (playerMin >= enemyMin) {
        // case 1: enemy roll is lower than player's minimum
        rollingTotal = (playerMin - enemyMin) / enemyRange;
        // case 2: 1 is not true, and player roll is higher than enemy maximum
        rollingTotal +=
          (1 - rollingTotal) * ((playerMax - enemyMax) / playerRange);
        // case 3: 1 and 2 are not true, both values are in the overlap range. Since values are basically continuous, we assume 50%
        rollingTotal += (1 - rollingTotal) * 0.5;
      } // otherwise, enemy power is higher
      else {
        // case 1: player rolls below enemy minimum
        rollingTotal = (enemyMin - playerMin) / playerRange;
        // case 2: enemy rolls above player maximum
        rollingTotal +=
          (1 - rollingTotal) * ((enemyMax - playerMax) / enemyRange);
        // case 3: 1 and 2 are not true, both values are in the overlap range
        rollingTotal += (1 - rollingTotal) * 0.5;
        //since this is chance the enemy wins, we negate it
        rollingTotal = 1 - rollingTotal;
      }
      if (rollingTotal <= 0.3) return "Unlikely";
      if (rollingTotal <= 0.5) return "Possible";
      if (rollingTotal <= 0.7) return "Likely";
      return "Very Likely";
    },
    getElementAdvantage(playerElement, enemyElement) {
      if ((playerElement + 1) % 4 === enemyElement) return 1;
      if ((enemyElement + 1) % 4 === playerElement) return -1;
      return 0;
    },
    async onClickEncounter(targetToFight) {
      if (this.selectedWeaponId === null || this.currentCharacterId === null) {
        return;
      }

      this.waitingResults = true;

      // Force a quick refresh of targets
      await this.fetchTargets({
        characterId: this.currentCharacterId,
        weaponId: this.selectedWeaponId,
      });
      // If the targets list no longer contains the chosen target, return so a new target can be chosen
      if (
        !this.targets.find(
          (target) => target.original === targetToFight.original
        )
      ) {
        this.waitingResults = false;
        return;
      }

      this.fightResults = null;
      this.error = null;
      this.setIsInCombat(this.waitingResults);

      try {
        const results = await this.doEncounter({
          characterId: this.currentCharacterId,
          weaponId: this.selectedWeaponId,
          targetString: targetToFight.original,
          fightMultiplier: this.fightMultiplier,
        });

        this.fightResults = results;

        await this.fetchFightRewardSkill();
        await this.fetchFightRewardXp();

        this.error = null;
      } catch (e) {
        console.error(e);
        this.error = e.message;
      }
    },

    formattedSkill(skill) {
      const skillBalance = fromWeiEther(skill, "ether");
      return `${toBN(skillBalance).toFixed(6)} xBlade`;
    },

    getPotentialXp(targetToFight) {
      const characterPower = CharacterPower(this.currentCharacter.level);
      const playerElement = parseInt(this.currentCharacter.trait, 10);
      const selectedWeapon = this.ownWeapons
        .filter(Boolean)
        .find((weapon) => weapon.id === this.selectedWeaponId);
      const weaponMultiplier = GetTotalMultiplierForTrait(
        selectedWeapon,
        playerElement
      );
      const totalPower =
        characterPower * weaponMultiplier + selectedWeapon.bonusPower;

      //Formula taken from getXpGainForFight funtion of CryptoWars.sol
      return (
        Math.floor((targetToFight.power / totalPower) * this.fightXpGain) *
        this.fightMultiplier
      );
    },

    setFightMultiplier() {
      localStorage.setItem("fightMultiplier", this.fightMultiplier.toString());
    },
    getCleanCharacterName(id) {
      return getCleanName(this.getCharacterName(id));
    },
    renderOwner(owner) {
      if(!owner) {
        return '';
      }
      else if(owner?.length<11) {
        return owner;
      }else {
        const hiddenString = owner.slice(5, owner?.length-5);
        const hiddenOwner = owner.split(hiddenString).join('...');
        return hiddenOwner;
      }
    },

    onSelectHero(heroId) {
      this.selectedCharacter = heroId;
    },

    onSelectWeapon(weapon) {
      this.selectedWeapon = weapon;
    },

    convertReward(reward) {
      const _reward = fromWeiEther(reward);
      return `${_reward}`;
    },

    async handleCreateRoom() {
      this.$bvModal.show('loadingModal');
      // @ts-ignore
      // @ts-ignore
      if(!this.selectedCharacter || !this.selectedWeapon) {
        // @ts-ignore
        this.errorMessage = 'Please select weapon and hero!';
        this.$bvModal.show('listHeroToCareerModal');
        // @ts-ignore
        setTimeout(() => {
          this.$bvModal.hide('loadingModal');
        }, 500);
      }
      else if(!this.totalDeposit || !this.matchReward) {
        this.errorMessage = 'Please input total deposit and match reward!';
        this.$bvModal.show('listHeroToCareerModal');
        this.$bvModal.hide('loadingModal');
        setTimeout(() => {
          this.$bvModal.hide('loadingModal');
        }, 500);
      }
      else if(this.totalDeposit< 2.1*this.matchReward) {
        this.errorMessage = 'The Total deposit needs to bigger than 210% of the Match reward!';
        this.$bvModal.show('listHeroToCareerModal');
        setTimeout(() => {
          this.$bvModal.hide('loadingModal');
        }, 500);
      }
      else {
        // @ts-ignore
        const res = await this.createCareerRoom({
        // @ts-ignore
          character: this.selectedCharacter.id,
          // @ts-ignore
          weapon: this.selectedWeapon.id,
          // @ts-ignore
          matchReward: this.matchReward,
          // @ts-ignore
          totalDeposit: this.totalDeposit
        });
        if(res) {
          this.selectedCharacter= null;
          this.selectedWeapon=null;
          this.errorMessage='';
          this.$bvModal.hide('loadingModal');
          this.getCareerRooms({cursor:0});
          setTimeout(() => {
            this.$bvModal.show('listHeroToCareerModal');
          }, 500);
        }
        // console.log('hiihi', result);
        // if(result) {
        //   this.errorMessage='';
        //   this.$bvModal.show('listHeroToCareerModal');
        // }
      }
    },

    async handleFight(roomId, requestId) {
      const room = this.careerModeRooms.filter(item => item.id ===roomId);
      if(!room?.[0]) {
        return;
      }
      this.$bvModal.show('loadingModal');
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
        if(results) {
          console.log('results', results);
          this.$bvModal.show('fightResult');
          const fightResultsFull = {...results, matchReward: room?.[0]?.matchReward};
          this.fightResults=fightResultsFull;
          setTimeout(() => {
            this.$bvModal.hide('loadingModal');
          }, 500);
          await this.getRequests();
          await this.getRewardPvp();
          await this.getCareerRooms({cursor: 0});
        }else {
          console.log('bug here');
          this.$bvModal.hide('loadingModal');
          this.errorMessage="Something went wrong! Please check later!";
          setTimeout(() => {
            this.$bvModal.show('fightErrorModal');
          }, 500);
        }
        // @ts-ignore
        // @ts-ignore
        this.error=null;
      } catch (e) {
        console.error(e);
        // @ts-ignore
        this.error = e.message;
      }
      // @ts-ignore
    },
    async handleCancelRequestFight (roomId, requestId) {
      this.$bvModal.show('loadingModal');
      const response = await this.cancelRequestFight({roomId, requestId});
      if(response) {
        this.$bvModal.hide('loadingModal');
        this.getListParticipatedRoom();
      }
    },
    async handleShowWeapon(weaponId) {
      this.errorMessage = "";
      const weapon = await this.fetchWeaponId(weaponId);
      this.weaponToShow = weapon;
      this.$bvModal.show('showWeaponModal');
    },
    filterCareerModeRequest () {
      const newCareerModeRequest = [];
      const object = {};
      for(let i = 0 ;i< this.careerModeRequest.length; i++) {
        object[this.careerModeRequest[i].id] = this.careerModeRequest[i];
      }
      for(const i in object) {
        newCareerModeRequest.push(object[i]);
      }
      const listRoomRequest = this.careerModeRequest.filter((item) => {
        const roomCareer = this.careerModeRooms.find(room => room.id === item.roomId);
        return item.done === '0' && !roomCareer.claimed;
      });
      return listRoomRequest;
    },

    filterCareerModeRooms() {
      return this.careerModeRooms.filter((item)=> {
        const _matchReward = fromWeiEther(item.matchReward);
        const _totalDeposit = fromWeiEther(item.totalDeposit);
        return item.owner!==this.defaultAccount && !item.claimed && Number(_matchReward) < Number(_totalDeposit);
      });
    },
    filterMyCareerModeRooms() {
      return this.careerModeRooms.filter((item)=> item.owner===this.defaultAccount && !item.claimed);
    },
    filterMyRequestRoom() {
      const newCareerModeRequest = [];
      const object = {};
      for(let i = 0 ;i< this.myCareerModeRequest.length; i++) {
        object[this.myCareerModeRequest[i].id] = this.myCareerModeRequest[i];
      }
      for(const i in object) {
        newCareerModeRequest.push(object[i]);
      }
      return newCareerModeRequest.filter(item => item.done !== '2');
    },
    async handleScrollToEnd(isVisible) {
      if(!isVisible) { return; }
      this.cursor +=20;
      if(this.careerModeRooms.length < this.cursor) {
        return ;
      }
      this.getCareerRooms({cursor:this.cursor});
    },
    async handleRequestFight(roomId) {
      if(!this.selectedWeapon || !this.selectedCharacter) {
        this.errorMessage='Please select weapon and hero';
        this.$bvModal.show('requestFightModal');
      }
      else {
        this.$bvModal.show('loadingModal');
        const res = await this.requestFight({
          roomId,
          weaponId: this.selectedWeapon.id,
          characterId: this.selectedCharacter.id,
        });
        if(res) {
          this.$bvModal.hide('loadingModal');
          this.getListParticipatedRoom();
          setTimeout(() => {
            this.errorMessage = '';
            this.$bvModal.show('requestFightModal');
          }, 500);
        }
        else {
          this.$bvModal.hide('loadingModal');
          this.errorMessage="Something went wrong! Please check later!";
          setTimeout(() => {
            this.$bvModal.show('requestFightModal');
          }, 500);
        }
      }
    },
    async cancelCareerMode(roomId, isAvailable) {
      if(isAvailable) {
        this.$bvModal.show('loadingModal');
        const res = await this.endCareerMode({roomId});
        if(res) {
          this.$bvModal.hide('loadingModal');
          setTimeout(() => {
            this.$bvModal.show('cancelCareerModal');
          }, 500);
        }else {
          this.$bvModal.hide('loadingModal');
          this.errorMessage="Something went wrong! Please check later!";
          setTimeout(() => {
            this.$bvModal.show('cancelCareerModal');
          }, 500);
        }
      }
      else {
        this.errorMessage= `You only can "Cancel Career" after 1 hour`;
        this.$bvModal.show('cancelCareerModal');
      }
    },
    async handleClaimTokenReward() {
      if(this.rewardPvp > 0) {
        this.$bvModal.show('loadingModal');
        const res = await this.claimTokenReward();
        console.log('resss', res);
        if(res) {
          this.errorMessage = '';
          this.$bvModal.hide('loadingModal');
          this.$bvModal.show('claimModal');
          this.getRewardPvp();
        }else {
          this.$bvModal.hide('loadingModal');
        }
      }
      else {
        this.errorMessage = 'You have 0 xBlade!';
        this.$bvModal.show('claimModal');
        return ;
      }
    }

    // setStaminaSelectorValues() {
    //   if(this.currentCharacterStamina < 40) {
    //     return [{ value: this.fightMultiplier, text: 'You need more stamina to fight!', disabled: true}];
    //   }

    //   const choices = [
    //     {value: null, text: 'Please select Stamina Cost per Fight', disabled: true},
    //   ];

    //   const addChoices = [];

    //   if(this.currentCharacterStamina >= 200) {
    //     addChoices.push({ value: 5, text: 200 });
    //   }

    //   if(this.currentCharacterStamina >= 160) {
    //     addChoices.push({ value: 4, text: 160 });
    //   }

    //   if(this.currentCharacterStamina >= 120) {
    //     addChoices.push({ value: 3, text: 120 });
    //   }

    //   if(this.currentCharacterStamina >= 80) {
    //     addChoices.push({ value: 2, text: 80 });
    //   }

    //   if(this.currentCharacterStamina >= 40) {
    //     addChoices.push({ value: 1, text: 40 });
    //   }

    //   choices.push(...addChoices.reverse());

    //   return choices;
    // },
  },

  components: {
    // BigButton,
    // WeaponGrid,
    // Hint,
    // CombatResults,
    // WeaponIcon,
    // CharacterBar,
    CombatPVPFight,
    CharacterRoom,
    WeaponSelect,
    RoomRequest,
    PulseLoader,
    FightResult
  },
  async beforeMount() {
    await this.getCareerRooms({cursor: 0});
    await this.getRewardPvp();
    await this.getListParticipatedRoom();
    await this.getRequests();
  },
  async mounted(){
    if(this.checkSelectFromRPS){
      this.addClass = "background";
    }
    setTimeout(async () => {
      this.fetchInfoInterval = setInterval(async() => {
        await this.getCareerRooms({cursor: 0});
        await this.getRewardPvp();
        await this.getListParticipatedRoom();
      }, 180000);
      this.fetchRequestInterval = setInterval(async () => {
        await this.getRequests();
      }, 5000);
      console.log('111', this.careerModeRooms);
    }, 1000);
  },
};
</script>

<style scoped>
.row {
  width: 100%;
}
.container {
  /* margin: 0 200px; */
  margin-top: 0;
  display: flex;
  flex-direction: column;
  max-width: 1550px;
}



#selectHeroOrWeaponModal .icon-close{
  background-image: url(../assets/v2/icon-close-2.svg);
  width: 50px;
  height: 47px;
  margin-right: 40px;
}

#requestSelect .icon-close,
#fightModal .icon-close{
  background-image: url(../assets/v2/icon-close.svg);
  width: 50px;
  height: 47px;
  position: relative;
  right: -36em;
  top: -15px;
}

#loadingModal .icon-close,
#listHeroToCareerModal .icon-close,
#listHeroToChallengeModal .icon-close{
  background-image: url(../assets/v2/icon-close.svg);
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

#loadingModal .icon-close-container,
#listHeroToChallengeModal .icon-close-container,
#listHeroToCareerModal .icon-close-container,
#selectHeroOrWeaponModal .icon-close-container{
  display: flex;
  justify-content: flex-end;
}
#requestFightModal .modalContent,
#cancelCareerModal .modalContent,
#fightErrorModal .modalContent {
    max-width: 50rem;
    margin: auto;
    padding: 20px;
    position: relative;
    display: flex;
    flex-direction: column;
    justify-content: space-around;
    background-clip: padding-box;
    border: 1px solid rgba(0, 0, 0, 0.2);
    border-radius: 0.3rem;
    outline: 0;
    background-image: url('../assets/v2/shop-select-item.svg');
    background-position: 50% 0;
    background-repeat: no-repeat;
    background-size: 100% 100%;
}

#loadingModal .centerLoading {
  display: flex;
  justify-content: center;
  align-items: center;
  padding-bottom: 2rem;
  padding-top: 2rem;
}

.quantity-heroes {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 1.7em;
}

.quantity-heroes > div span {
  color: #f3bf2b;
}

.info-box {
  padding:50px 100px;
  display: flex;
  justify-content: center;
}

.info-user {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 624px;
  padding: 20px 3em;
  /* margin: 0 auto; */
  border: 2px solid #f58b5b;
  border-radius: 18px;
  background-color: #000;
}

.info-user-title {
  font-size: 1.7em;
  font-weight: 600;
}

.info-user-body {
  display: flex;
  justify-content: center;
  margin: 20px;
}

.info-user-body span {
  font-size: 1.3em;
  padding: 10px;
  margin: 0 10px;
}

.info-user-body > div {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 150px;
  border: 2px solid #504a46;
  margin: 0 10px;
  font-size: 1.8em;
  color: #f3bf2b;
}

.info-user-btn button {
  background-image: url(../assets/v2/btn-fight-big.svg);
  background-color: transparent;
  background-repeat: no-repeat;
  background-size: contain;
  border: none;
  width: 180px;
  height: 42px;
  font-size: 1em;
  margin: 15px;
  font-weight: 600;
  color: #fff;
}

.info-user-btn button:hover{
  background-image: url(../assets/v2/btn-fight-big-opcity.svg);
  transition: 0.9s;
}

.list-heroes{
  display: flex;
  justify-content: center;
}

.list-request {
  display: flex;
  justify-content: center;
  margin: 0 auto;
}

.search-hero{
  display: flex;
  align-items: center;
}

.search-hero input {
  background-color: #000;
  outline: none;
  border: 1px solid #5bc7f5;
  color: #fff;
  padding: 17px;
  border-radius: 10px;
  font-size: 1em;
}

.nav-option {
  padding: 5px 15px;
  background-color: rgba(0, 0, 0, 0.6);
  border-radius: 45px;
  width: fit-content;
}

.main-font .nav-item {
  margin: 0;
}

.nav-item div{
    display: flex;
    align-items: center;
}

.nav-item div div{
    padding: 0 20px;
    margin-left: 10px;
    color: #fff;
    background-color: #f58b5b;
    border-radius: 20px;
}

.nav.nav-pills .nav-link {
  color: #fff !important;
  border: none;
  background: transparent;
  font-size: 1.3em;
  border-radius: 0;
  padding: 0.7rem 0.7rem;
}

.nav.nav-pills .nav-link:hover {
  border: none !important;
  border-bottom: 6px solid #f58b5b !important;
  color: #f58b5b !important;
}

.nav.nav-pills .nav-link.active {
  border: none !important;
  border-bottom: 6px solid #f58b5b !important;
  color: #f58b5b !important;
  background: transparent;
}

.list{
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

.item{
  min-width: 19em;
  height: 26.5em;
  background-position: left;
  background-repeat: no-repeat;
  background-size: contain;
  background-image: url(../assets/images/bg-item-top.png);
  margin: 1.6em 0 4em 0;
  position: relative;
}

.itemWeapon {
  min-width: 19em;
  height: 26.5em;
  background-position: left;
  background-repeat: no-repeat;
  background-size: 100% 100%;
  background-image: url(../assets/images/bg-item-top.png);
  position: relative;
}

.itemCareer {
  min-width: 19em;
  height: 26.5em;
  background-position: left;
  background-repeat: no-repeat;
  background-size: contain;
  margin-top: 1.5rem;
  margin-bottom: 2.5rem;
  position: relative;
}

.info {
  margin: 0 11px 30px 11px;
}

.info .property{
  /* content: url(../assets/elements/earth.png); */
  width: 30px;
  height: 30px;
  display: block;
  margin-top: 10px;
  /* position: relative;
  top: 30px;
  left: 20px; */
  position: relative;
  top: 0;
}

.element-container{
  position: relative;
  top: 0;
}

.info-head > div{
  font-size: 1.3em;
}

.item-id{
  position: absolute;
  right: 30px;
  top: 30px;
}

.item-id > div{
  text-align: end;
  font-size: 1em;
  line-height: 15px;
  color: #F2BE3E;
}


.info-head{
  /* display: flex; */
  position: relative;
  top: 30px;
  left: 15px;
  /* width: 245px; */
  /* justify-content: space-between; */
}

.info-head span:first-child{
  margin: 0;
}

.img-hero-around{
  width: 151px;
  height: 207px;
  background-repeat: no-repeat;
  background-size: contain;
  /* margin: 0 auto; */
  /* margin-top: -42px; */
  position: absolute;
  bottom: 150px;
  left: 80px;
  /* z-index: 1; */
}

.img-hero{
  width: 151px;
  height: 238px;
  background-repeat: no-repeat;
  background-size: 100%;
  margin: 0 auto;
  margin-top: 20px;
  position: relative;
  top: -25px;
}

.img-weapon{
  width: 190px;
  height: 214px;
  /* background-image: url(../assets/sword/sword-air-04.png); */
  background-repeat: no-repeat;
  background-size: 100%;
  margin: 0 auto;
  margin-top: 20px;
  position: relative;
  top: 35px;
}

.info-footer{
  position: absolute;
  bottom: 40px;
  width: 100%;
}

.info-footer div{
  font-weight: 600;
  text-align: center;
}

.info-footer .weapon-name{
  /* margin-top: 40px;
  margin-bottom: 10px; */
}

.info-footer .bar-xp-weapon{
  /* margin-top: 10px;
  margin-bottom: 40px; */
}

.info-footer > div > span{
  color: #f58b5b;
}

.cost{
  color: #D858F7;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  font-size: 1.3em;
}

.cost > div{
  background-image: url(../assets/v2/icon-crypto.svg);
  width: 20px;
  height: 19px;
  background-repeat: no-repeat;
  background-size: cover;
  margin-right: 6px;
}

.button-container{
  width: 100%;
  position: absolute;
  bottom: -70px;
}

.btn-request-fight{
  margin: 0 auto;
  display: block;
  background-color: transparent;
  border: none;
  background-image:  url(../assets/v2/btn-fight-big.svg);
  width: 190px;
  height: 42px;
  background-size: cover;
  background-repeat: no-repeat;
  color: #fff;
  font-weight: 600;
  font-size: 1em;
  margin-bottom: 20px;
}

.btn-request-fight:hover{
  background-image: url(../assets/v2/btn-fight-big-opcity.svg);
  transition: 0.9s;
}

.info-head-left{
  display: flex;

}

.star-weapon{
  background-image: url(../assets/v2/star.svg);
  width: 30px;
  height: 36px;
  display: block;
  margin-bottom: 10px;
}

.info-head-left > div > div{
  margin-left: 10px;
}

.bar-xp-weapon{
  background-color: #F2BE3E;
  width: 70%;
  height: 15px;
  margin: 0 auto;
  border-radius: 10px;
}

.info-head-right{
  position: absolute;
  right: 40px;
  top: 0;
}

.info-head > div{
  font-size: 1em;
}

.id-weapon{
  margin-bottom: 5px;
  display: block;
  font-size: 1em;
}

.requestSelect-head,
.listHeroToCareerModal-head,
.listHeroToChallengeModal-head{
  font-size: 1.8em;
  font-weight: 600;
  color: #F58B5B;
  text-align: center;
}

.requestSelect-body{
  margin: 50px 0;
}

.requestSelect-body > div{
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 1.3em;
  color: #fff;
}

.requestSelect-body > div > div{
  width: 315px;
  height: 50px;
  border: 1px solid #707070;
  padding: 0 16px;
  margin: 0 20px;
  display: flex;
  align-items: center;
}

.requestSelect-body > div > div > div{
  background-image: url(../assets/v2/icon-crypto.svg);
  width: 27px;
  height: 26px;
  background-repeat: no-repeat;
  background-size: cover;
  margin-right: 16px;
}

.requestSelect-body > div > div > span{
  display: block;
  border-left: 1px solid #707070;
  display: flex;
  align-items: center;
  height: 100%;
  padding-left: 16px;
  font-size: 1.3em;
  color: #F58B5B;
}

.requestSelect-btn,
.requestSelect-btn{
  background-color: transparent;
  border: none;
  background-image: url(../assets/v2/btn-fight.png);
  background-repeat: no-repeat;
  background-size: contain;
  width: 163px;
  height: 50px;
  margin: 0 10px;
  display: block;
  color: #fff;
  font-size: 1.3em;
  font-weight: 600;
}
.requestSelect-btn.reject{
  background-image: url(../assets/v2/Btn-blue.svg);
  height: 48px;
}

.requestSelect-btn.confirm{
  margin: 0 auto;
}

.requestSelect-btn{
  background-color: transparent;
  border: none;
  background-repeat: no-repeat;
  background-size: contain;
  width: 163px;
  margin: 0 10px;
  display: block;
  color: #fff;
  font-size: 1.3em;
  font-weight: 600;
}

.requestSelect-footer{
  display: flex;
  justify-content: center;
  align-items: center;
}

.background{
  background-image: linear-gradient(rgba(245, 111, 86, 0.3), rgba(86, 82, 219, 0.3));
  border: 1px solid #3CDE9B;
  margin-bottom: 3.5em;
  margin-top: 40px;
}

.item-selected{
  display: flex;
  margin-right: 1.5rem;
}

.info-user-footer{
  margin-top: 10px;
}
.headerModalCareer {
  padding: 1.8rem;
}

.info-user-footer-item{
  margin: 10px 0;
}

.info-user-footer-item > div{
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 1.3em;
  color: #fff;
}

.info-user-footer-item > div > div{
  width: 315px;
  height: 50px;
  border: 1px solid #707070;
  padding: 0 16px;
  margin: 0 20px;
  display: flex;
  align-items: center;
}

.info-user-footer-item > div > div > div{
  background-image: url(../assets/v2/icon-crypto.svg);
  width: 27px;
  height: 26px;
  background-repeat: no-repeat;
  background-size: cover;
  margin-right: 16px;
}

.info-user-footer-item > div > div > span{
  display: block;
  border-left: 1px solid #707070;
  display: flex;
  align-items: center;
  height: 100%;
  padding-left: 16px;
  font-size: 1.3em;
  color: #F58B5B;
}

.info-user-footer-item > div > span{
  width: 170px;
}
.info-user-footer-item > div > span > span{
  display: block;
  font-size: 0.8em;
}

.info-user-footer button{
  display: block;
  width: 100%;
  background-image: linear-gradient(#F3859C, #7F327C);
  border: none;
  margin-top: 20px;
  padding: 10px 0;
  border-radius: 6px;
  font-size: 1.3em;
  color: #fff;
}

.listHeroToCareerModal-body,
.listHeroToChallengeModal-body{
  text-align: center;
  margin: 20px 0;
  font-size: 1.3em;
  color: #fff;
}

.listHeroToCareerModal-body span,
.listHeroToChallengeModal-body span{
  color: #D858F7;
}

.listHeroToCareerModal-btn,
.listHeroToChallengeModal-btn{
  background-color: transparent;
  border: none;
  background-image: url(../assets/v2/btn-fight-big.svg);
  background-repeat: no-repeat;
  background-size: contain;
  width: 200px;
  height: 44px;
  margin: 20px auto;
  display: block;
  color: #fff;
  font-size: 1.3em;
  font-weight: 600;
}
.weaponShow-btn {
  background-color: transparent;
  border: none;
  background-image: url(../assets/v2/btn-fight-big.svg);
  background-repeat: no-repeat;
  background-size: contain;
  width: 200px;
  height: 44px;
  margin-bottom: 2.5rem;
  display: block;
  color: #fff;
  font-size: 1.3em;
  font-weight: 600;
}

@media (max-width: 767.98px) {
  .search-hero{
    margin-bottom: 10px;
    display: flex;
    justify-content: center;
  }
  .search-hero input{
    width: 100%;
  }

  .info-user-btn{
    display: flex;
    flex-direction: column;
    align-items: center;
  }
  .background{
    display: flex;
    flex-direction: column;
    align-items: center;
  }

  .item{
    margin-top: 70px;
    margin-bottom: 0;
  }

  .item-selected{
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-right: 0;
  }

  .info-user{
    width: 450px;
    padding: 20px;
  }

  .info-user-footer{
    width: 390px;
  }

    .info-user-btn button{
    font-size: 1em;
  }

  .btn-request-fight{
    font-size: 1em;
  }
}

@media (max-width: 575.98px) {
  .quantity-heroes {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: 1.4em;
}
.search-hero input{
  width: 100%;
}

.search-hero{
  margin-bottom: 10px;
  display: flex;
  justify-content: center;
}
.nav-option{
  display: flex;
  flex-direction: column;
  justify-content: center;
  /* width: 200px; */
}

.info-user-btn{
  display: flex;
  flex-direction: column;
  align-items: center;
}
.background{
  display: flex;
  flex-direction: column;
  align-items: center;
}

.item{
  margin-top: 70px;
  margin-bottom: 0;
}

.item-selected{
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-right: 0;
}

.info-user{
  width: 285px;
  padding: 20px;
}

.info-user-footer{
  width: 230px;
}

.info-user-title{
  font-size: 1em;
}

.info-user-body span{
  font-size: 1em;
  padding: 0;
}

.info-user-body > div{
  font-size: 1.3em;
  width: 140px;
}

.info-user-btn button{
  width: 140px;
  height: 42px;
  font-size: 0.8em;
  background-image: url(../assets/v2/btn-fight.png);
}

.info-user-footer-item > div{
  font-size: 1em;
}

.info-user-footer-item > div > div{
  width: 120px;
  height: 40px;
  margin: 0 5px;
  padding: 0 12px;
  margin-right: 12px;
}

.info-user-footer-item > div > div > div{
  width: 23px;
  height: 22px;
}

.info-user-footer-item > div > div > span{
  font-size: 1em;
}

.info-user-footer button{
  font-size: 1em;
}

.btn-request-fight{
  font-size: 0.8em;
}
}

@media (max-width: 376px) {
  #selectHeroOrWeaponModal .icon-close{
    margin-right: 10px;
  }
}

@media (max-width: 767px) {
  #selectHeroOrWeaponModal .icon-close{
    margin-right: 10px;
  }
}

@media (min-width: 768px) {

}
</style>
