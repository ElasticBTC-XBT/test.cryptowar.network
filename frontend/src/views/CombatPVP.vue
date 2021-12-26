<template>
  <div class="body main-font">
    <CombatPVPFight :propCancelRequest = cancelRequest v-if="checkFight" />
    <div v-if="!checkFight" class="container">
      <div class="row">
        <div class="col-12">
          <div class="quantity-heroes">
            <div><span>123</span> Heroes In Chanllenge Mode{{this.select}}</div>
            <div><span>456</span> Heroes In Career Mode</div>
          </div>
        </div>
      </div>
      <b-modal id="listHeroToCareerModal" hide-footer>
        <div class="icon-close" @click="$bvModal.hide('listHeroToCareerModal')"></div>
        <div class="listHeroToCareerModal-head">CryptoWar Message</div>
        <div class="listHeroToCareerModal-body">Listing HERO to Career: <span>Done</span></div>
        <button @click="$bvModal.hide('listHeroToCareerModal')" class="listHeroToCareerModal-btn confirm">GO TO CHECK</button>
      </b-modal>
      <b-modal id="listHeroToChallengeModal" hide-footer>
        <div class="icon-close" @click="$bvModal.hide('listHeroToChallengeModal')"></div>
        <div class="listHeroToChallengeModal-head">CryptoWar Message</div>
        <div class="listHeroToChallengeModal-body">Listing HERO to Challenge: <span>Done</span></div>
        <button @click="$bvModal.hide('listHeroToChallengeModal')" class="listHeroToChallengeModal-btn confirm">GO TO CHECK</button>
      </b-modal>
      <div class="row">
        <div :class="addClass" class="col-12 info-box">
          <div v-if="checkSelectFromRPS || checkSelect" class="item-selected">
            <div class="item">
              <div class="info">
                <div class="info-head">
                  <span class="property"></span>
                  <div class="info-head-right">
                    <span>#123456</span>
                    <div class="leve">Lv.1</div>
                  </div>
                </div>
                <div class="img-hero-around">
                  <div class="img-hero"></div>
                </div>
                <div class="info-footer">
                  <div class="hero-name">Amiria Angurvidel</div>
                  <div class="orner-hero">Owner: <span>0x4933...44644</span></div>
                </div>
              </div>
            </div>
            <div class="item">
            <div class="info">
              <div class="info-head">
                <div class="info-head-left">
                  <span class="property"></span>
                  <div>
                    <span class="star-weapon"></span>
                    <div>STR+56</div>
                  </div>
                </div>
                <div>
                  <span class="id-weapon">ID426</span>
                  <div>6LB</div>
                </div>
              </div>
              <div class="img-weapon"></div>
              <div class="info-footer">
                <div class="weapon-name">Amiria Angurvidel</div>
                <div class="bar-xp-weapon"></div>
              </div>
            </div>
          </div>
          </div>
          <div class="info-user">
            <div class="info-user-title">Your Information</div>
            <div class="info-user-body">
              <span>HEROES available</span>
              <div>4</div>
            </div>
            <div class="info-user-btn">
              <button @click="$bvModal.show('selectHeroOrWeaponModal'), selectHero = true, selectWeapon = false">SELECT HERO</button>
              <button @click="$bvModal.show('selectHeroOrWeaponModal'), selectWeapon = true, selectHero = false">SELECT WEAPON</button>
            </div>
            <div v-if="checkSelectFromRPS || checkSelect" class="info-user-footer">
              <div class="info-user-footer-item">
                <div>Amount a match
                  <div><div></div><span>123</span></div>
                </div>
              </div>
              <div class="info-user-footer-item">
                <div>
                  <span>
                    Toal deposit
                    <span>Min = value * 150%</span>
                  </span>
                  <div><div></div><span>123</span></div>
                </div>
              </div>
              <button @click="$bvModal.show('listHeroToCareerModal')">List HERO to Career Mode</button>
              <button @click="$bvModal.show('listHeroToChallengeModal')">List HERO to Challenge Mode</button>
            </div>
          </div>
        </div>
      </div>
      <b-modal id="selectHeroOrWeaponModal" class="modal-box" hide-footer>
        <div class="icon-close" @click="$bvModal.hide('selectHeroOrWeaponModal')"></div>
        <!-- <div class="title-results">{{titleResults}}</div>
        <CombatResults v-if="resultsAvailable" :results="fightResults" /> -->
        <div class="row list" v-if="selectHero">
          <div class="item" v-for="i in 10" :key="i">
            <div class="info">
              <div class="info-head">
                <span class="property"></span>
                <div class="info-head-right">
                  <span>#123456</span>
                  <div class="leve">Lv.1</div>
                </div>
              </div>
              <div class="img-hero-around">
                <div class="img-hero"></div>
              </div>
              <div class="info-footer">
                <div class="hero-name">Amiria Angurvidel</div>
                <div class="orner-hero">Owner: <span>0x4933...44644</span></div>
                <div class="remain-hero">Remain: <span>345.9098</span></div>
                <div class="cost"><div></div> 100</div>
              </div>
            </div>
            <div><button @click="checkSelect = true, (changeMode = true), (careerMode = false), (requestChallenge = false),
              $bvModal.hide('selectHeroOrWeaponModal'), addClass = 'background'" class="btn-request-fight">SELECT</button></div>
          </div>
        </div>
        <div class="row list" v-if="selectWeapon">
          <div class="item" v-for="i in 10" :key="i">
            <div class="info">
              <div class="info-head">
                <div class="info-head-left">
                  <span class="property"></span>
                  <div>
                    <span class="star-weapon"></span>
                    <div>STR+56</div>
                  </div>
                </div>
                <div>
                  <span class="id-weapon">ID426</span>
                  <div>6LB</div>
                </div>
              </div>
              <div class="img-weapon"></div>
              <div class="info-footer">
                <div class="weapon-name">Amiria Angurvidel</div>
                <div class="bar-xp-weapon"></div>
              </div>
            </div>
            <div><button @click="checkSelect = true, (changeMode = true), (careerMode = false), (requestChallenge = false),
              $bvModal.hide('selectHeroOrWeaponModal'),  addClass = 'background'" class="btn-request-fight">SELECT</button></div>
          </div>
        </div>
      </b-modal>
      <div class="row">
        <div class="col-xl-4 col-12">
          <div class="search-hero">
            <input type="text" placeholder="Search Hero's ID" />
          </div>
        </div>
        <div class="col-xl-8 col-12 nav-option-box">
          <div class="nav-option">
            <b-nav pills>
              <b-nav-item
                class="nav-item"
                @click="
                  checkActive(),
                  (changeMode = true),
                    (careerMode = false),
                    (requestChallenge = false)
                "
                :active="changeMode"
                ><div>CHALLENGE MODE <div>123</div></div></b-nav-item
              >
              <b-nav-item
                class="nav-item"
                @click="
                  checkActive(),
                  (changeMode = false),
                    (careerMode = true),
                    (requestChallenge = false)
                "
                :active="careerMode"
                ><div>CAREER MODE <div>456</div></div></b-nav-item
              >
              <b-nav-item
                class="nav-item"
                @click="
                  checkActive(),
                  (changeMode = false),
                    (careerMode = false),
                    (requestChallenge = true)
                "
                :active="requestChallenge"
                ><div>REQUEST TO CHALLENGE <div>1</div></div></b-nav-item
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
          <div class="row list-heroes" style="margin-left: 0;">
        <div class="item" v-for="i in 10" :key="i">
            <div class="info">
              <div class="info-head">
                <span class="property"></span>
                <div>
                  <span>#123456</span>
                  <div class="leve">Lv.1</div>
                </div>
              </div>
              <div class="img-hero-around">
                <div class="img-hero"></div>
              </div>
              <div class="info-footer">
                <div class="hero-name">Amiria Angurvidel</div>
                <div class="orner-hero">Owner: <span>0x4933...44644</span></div>
                <div class="remain-hero">Remain: <span>345.9098</span></div>
                <div class="cost"><div></div> 100</div>
              </div>
            </div>
            <div><button @click="$bvModal.show('requestSelect')" class="btn-request-fight">REQUEST SELECT</button></div>
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
          <div class="item" v-for="i in 10" :key="i">
              <div class="info">
                <div class="info-head">
                  <span class="property"></span>
                  <div>
                    <span>#123456</span>
                    <div>Lv.1</div>
                  </div>
                </div>
                <div class="img-hero-around">
                  <div class="img-hero"></div>
                </div>
                <div class="info-footer">
                  <div class="hero-name">Amiria Angurvidel</div>
                  <div class="orner-hero">Owner: <span>0x4933...44644</span></div>
                  <div class="remain-hero">Remain: <span>345.9098</span></div>
                  <div class="cost"><div></div> 100</div>
                </div>
              </div>
              <button @click="$bvModal.show('fightModal')" class="btn-request-fight">FIGHT</button>
              <!-- <router-link :to="{ name: 'pvp-fight' }">
              </router-link> -->
          </div>
        </div>
      </div>
      <div v-if="requestChallenge">
          <div class="row list-heroes" style="margin-left: 0;">
        <div class="item">
            <div class="info">
              <div class="info-head">
                <span class="property"></span>
                <div>
                  <span>#123456</span>
                  <div>Lv.1</div>
                </div>
              </div>
              <div class="img-hero-around">
                <div class="img-hero"></div>
              </div>
              <div class="info-footer">
                <div class="hero-name">Amiria Angurvidel</div>
                <div class="orner-hero">Owner: <span>0x4933...44644</span></div>
                <div class="remain-hero">Remain: <span>345.9098</span></div>
                <div class="cost"><div></div> 100</div>
              </div>
            </div>
            <div><button @click="cancelRequest = true, checkFight =true" class="btn-request-fight">CANCEL REQUEST</button></div>
          </div>
        </div>
      </div>
    </div>
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
  CharacterTrait,
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
      changeMode: true,
      careerMode: false,
      requestChallenge: false,
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
    };
  },
  // created() {
  //   this.intervalSeconds = setInterval(() => (this.timeSeconds = new Date().getSeconds()), 5000);
  //   this.intervalMinutes = setInterval(() => (this.timeMinutes = new Date().getMinutes()), 20000);
  //   this.staminaPerFight = 40 * Number(localStorage.getItem('fightMultiplier'));
  // },
  // created(){
  //   // this.checkSelect = true;
  //   console.log("nam");
  //   Events.$on('hello', (i) => {
  //     if(i === "true"){
  //       this.select = true;
  //       this.a = true;
  //       console.log("nam");
  //     }
  //   });
  //   // console.log(this.str);
  // },
  // updated(){
  //   console.log("nam");
  //   Events.$on('hello', (i) => {
  //     if(i === "true"){
  //       this.select = true;
  //       console.log("nam");
  //     }
  //   });
  // },


  mounted(){
    if(this.checkSelectFromRPS){
      this.addClass = "background";
    }
  },

  computed: {
    ...mapState(["currentCharacterId"]),
    ...mapGetters([
      "getTargetsByCharacterIdAndWeaponId",
      "ownCharacters",
      "ownWeapons",
      "currentCharacter",
      "currentCharacterStamina",
      "getWeaponDurability",
      "fightGasOffset",
      "fightBaseline",
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
    ]),
    ...mapMutations(["setIsInCombat"]),
    checkActive(){
      if(this.changeMode || this.careerMode || this.requestChallenge){
        this.addClass = "";
        this.checkSelect = false;
      }
    },
    getEnemyArt,
    getEnemyArtAround,
    weaponHasDurability(id) {
      return this.getWeaponDurability(id) >= this.fightMultiplier * 3;
    },
    charHasStamina() {
      return this.currentCharacterStamina >= this.staminaPerFight;
    },
    getCharacterTrait(trait) {
      return CharacterTrait[trait];
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
  position: relative;
  right: -64em;
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

#listHeroToCareerModal .icon-close,
#listHeroToChallengeModal .icon-close{
  background-image: url(../assets/v2/icon-close.svg);
  width: 50px;
  height: 47px;
  position: relative;
  right: -25em;
  top: -5px;
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
  font-size: 1.2em;
  margin: 15px;
  font-weight: 600;
  color: #fff;
}

.list-heroes{
  display: flex;
  justify-content: center;
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
  font-size: 1.2em;
}

.nav-option {
  padding: 5px 20px;
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
  font-size: 1.7em;
  border-radius: 0;
  padding: 0.7rem 1rem;
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
}

.info {
  margin: 0 11px 30px 11px;
}

.info .property{
  content: url(../assets/elements/earth.png);
  width: 40px;
  height: 40px;
  /* position: relative;
  top: 30px;
  left: 20px; */
}

.info-head > div{
  font-size: 1.3em;
}

.info-head > div > div{
  text-align: end;
  font-size: 1em;
  line-height: 15px;
}

.info-head > div .leve{
  color: #F2BE3E;
}

.info-head{
  display: flex;
  position: relative;
  top: 32px;
  left: 20px;
  width: 245px;
  justify-content: space-between;
}

.img-hero-around{
  width: 151px;
  height: 227px;
  background-image: url(../assets/images/water.png);
  background-repeat: no-repeat;
  background-size: contain;
  margin: 0 auto;
  margin-top: 20px;
  position: relative;
  position: relative;
  top: 16px;
  /* z-index: 1; */
}

.img-hero{
  width: 151px;
  height: 238px;
  background-image: url(../assets/hero/hero-water-02.png);
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
  background-image: url(../assets/sword/sword-air-04.png);
  background-repeat: no-repeat;
  background-size: 100%;
  margin: 0 auto;
  margin-top: 20px;
  position: relative;
  top: 35px;
}

.info-footer div{
  font-weight: 600;
  text-align: center;
}

.info-footer .weapon-name{
  margin-top: 40px;
  margin-bottom: 10px;
}

.info-footer .bar-xp-weapon{
  margin-top: 10px;
  margin-bottom: 40px;
}

.info-footer > div > span{
  color: #f58b5b;
}

.info-footer .cost{
  color: #D858F7;
  display: flex;
  width: 100%;
  justify-content: center;
  align-items: center;
  font-size: 1.3em;
}

.info-footer .cost > div{
  background-image: url(../assets/v2/icon-crypto.svg);
  width: 20px;
  height: 19px;
  background-repeat: no-repeat;
  background-size: cover;
  margin-right: 6px;
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
  font-size: 1.2em;
  margin-bottom: 20px;
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

.id-weapon{
  margin-bottom: 5px;
  display: block;
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
  background-image: url(../assets/v2/Btn-fight.svg);
  background-repeat: no-repeat;
  background-size: contain;
  width: 163px;
  height: 66px;
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
  margin-right: 3.8em;
}

.info-user-footer{
  margin-top: 10px;
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
.listHeroToChallengeModal span{
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
  #selectHeroOrWeaponModal .icon-close{
  right: -41em;
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
  #selectHeroOrWeaponModal .icon-close{
  right: -25em;
}
}

@media (max-width: 376px) {
  #selectHeroOrWeaponModal .icon-close{
  right: -18em;
}

}

@media (max-width: 414px) {
  #selectHeroOrWeaponModal .icon-close{
  right: -17em;
  }
}

@media (min-width: 768px) {
}
</style>
