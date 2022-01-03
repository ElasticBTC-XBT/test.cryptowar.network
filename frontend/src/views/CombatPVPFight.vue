<template>
  <div class="body main-font">
    <div class="row combat">
      <b-modal id="cancelRequestModal" hide-footer centered>
          <div class="content-noti">Cancel Request Battle</div>
          <!-- <CombatResults v-if="resultsAvailable" :results="fightResults" /> -->
          <div class="cancelrequestmodal-btn">
              <button @click="$bvModal.hide('cancelRequestModal')" class="btn-no">NO</button>
              <button class="btn-confirm" block @click="$bvModal.hide('cancelRequestModal')">CONFIRM</button>
          </div>
      </b-modal>
      <b-modal id="fightResultsModal" hide-footer centered>
         <link rel="prefetch" as="image" href="/img/Congrats.5ac13bd5.gif">
          <img src="/img/Congrats.5ac13bd5.gif" class="background-win">
          <div class="title-results">{{titleResults}}</div>
          <CombatResults :results="fightResults" :propResultsFromPVP="resultsFromPVP" />
          <button class="mt-3 btn-buy btn-close-fight-results" block @click="$bvModal.hide('fightResultsModal'), cancelRequest= false">Close</button>
      </b-modal>
      <div class="col-xl-3 col-12">
      <div class="header-row">
        <div class="header-row-title">Stamina Cost Per Fight</div>
        <b-form-select v-model="fightMultiplier" :options='setStaminaSelectorValues()' @change="setFightMultiplier()" class="ml-3">
        </b-form-select>
        <div class="title-choose-weapon">Choose a Weapon</div>
        <div class="info-weapon">
          <div class="info-weapon-head">
            <div class="info-weapon-head-1">
              <div class="info-weapon-head-left"><span></span>
                <div class="info-weapon-star">
                  <div v-for="i in 5" :key="i"><svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" class="bi bi-star-fill" viewBox="0 0 16 16">
                  <path d="M3.612 15.443c-.386.198-.824-.149-.746-.592l.83-4.73L.173 6.765c-.329-.314-.158-.888.283-.95l4.898-.696L7.538.792c.197-.39.73-.39.927 0l2.184 4.327
                  4.898.696c.441.062.612.636.282.95l-3.522 3.356.83 4.73c.078.443-.36.79-.746.592L8 13.187l-4.389 2.256z"/>
                  </svg> </div>
                </div>
              </div>
              <div class="info-weapon-head-right">ID 456</div>
            </div>
            <div class="info-weapon-head-2">
              <div class="info-weapon-head-2-left"><span></span>
                <div>
                  STR +286
                </div>
              </div>
            </div>
          </div>
          <div class="info-weapon-body"></div>
          <div class="info-weapon-footer">
            <div class="can-use-weapon"></div>
            <div class="weapon-name">Wind-forged Doombade</div>
          </div>
        </div>
        <button class="choose-weapon">Choose new Weapon</button>
      </div>
    </div>
    <div class="nav-line boder"></div>
    <div class="enemy">
      <div class="row">
        <div class="enemy-box">
        <div class="property-icon"></div>
        <div class="list-enemy row">
          <div class="enemy-item-container" v-for="i in 4" :key="i">
            <div class="enemy-item">
              <div class="enemy-item-head">
                <span></span>
                <span>ID 10</span>
              </div>
              <div class="enemy-item-body">
                <div class="img-enemy"></div>
                <div class="around-enemy"></div>
              </div>
              <div class="enemy-item-footer">
                <div class="enemy-power">5109</div>
                <div class="enemy-xp">+14XP</div>
              </div>
            </div>
            <div class="Ability-win">Very Likely Victory</div>
            <button @click="$bvModal.show('fightResultsModal'), onClickEncounter()">FIGHT</button>
          </div>
        </div>
      </div>
      </div>
    </div>
    </div>
  </div>
</template>

<script>
import CombatResults from '../components/CombatResults.vue';
import { mapActions, mapGetters, mapState, mapMutations } from 'vuex';
// import CharacterBar from "../components/CharacterBar.vue";

export default {
  props: ['propCancelRequest'],
  data() {
    return {
      fightMultiplier: Number(localStorage.getItem('fightMultiplier')),
      staminaPerFight: 40,
      titleResults: "",
      cancelRequest: this.propCancelRequest,
      resultsFromPVP: false,
    };
  },

  created() {
    this.staminaPerFight = 40 * Number(localStorage.getItem('fightMultiplier'));
  },

  mounted(){
    if(this.cancelRequest){
      this.$bvModal.show('cancelRequestModal');
    }
  },

  computed: {
    // cancel(){
    //   console.log(this.cancelRequest);
    //   if(this.cancelRequest === true){
    //     console.log("hiep");
    //     this.$bvModal.show('fightResultsModal');
    //   }
    //   return 0;
    // },
    ...mapState(['currentCharacterId']),
    ...mapGetters([
      'getTargetsByCharacterIdAndWeaponId',
      'ownCharacters',
      'ownWeapons',
      'currentCharacter',
      'currentCharacterStamina',
      'getWeaponDurability',
      'fightGasOffset',
      'fightBaseline',
    ]),

    targets() {
      return this.getTargetsByCharacterIdAndWeaponId(this.currentCharacterId, this.selectedWeaponId);
    },

    isLoadingTargets() {
      return this.targets.length === 0 && this.currentCharacterId && this.selectedWeaponId;
    },

    selections() {
      return [this.currentCharacterId, this.selectedWeaponId];
    },

    updateResults() {
      return [this.fightResults, this.error];
    },
  },

  watch: {
    // async selections([characterId, weaponId]) {
    //   if (!this.ownWeapons.filter(Boolean).find((weapon) => weapon.id === weaponId)) {
    //     this.selectedWeaponId = null;
    //   }
    //   await this.fetchTargets({ characterId, weaponId });
    // },

    // async updateResults([fightResults, error]) {
    //   this.resultsAvailable = fightResults !== null;
    //   this.waitingResults = fightResults === null && error === null;
    //   this.setIsInCombat(this.waitingResults);
    //   if (this.resultsAvailable && error === null) this.$bvModal.show('fightResultsModal');
    // },
  },


  methods: {
    ...mapActions(['fetchTargets', 'doEncounter', 'fetchFightRewardSkill', 'fetchFightRewardXp', 'getXPRewardsIfWin']),
    ...mapMutations(['setIsInCombat']),
    weaponHasDurability(id) {
      return this.getWeaponDurability(id) >= this.fightMultiplier * 3;
    },
    charHasStamina(){
      return this.currentCharacterStamina >= this.staminaPerFight;
    },

    getElementAdvantage(playerElement, enemyElement) {
      if ((playerElement + 1) % 4 === enemyElement) return 1;
      if ((enemyElement + 1) % 4 === playerElement) return -1;
      return 0;
    },
    async onClickEncounter() {
      this.resultsFromPVP = true;
      console.log(this.resultsFromPVP);
      this.fightResults = Math.floor(Math.random() * (4 - 1)) + 1;
      if(this.fightResults === 1) this.titleResults = "Congratulation!";
      else if(this.fightResults === 2) this.titleResults = "Better luck Next Time";
      else if(this.fightResults === 3) this.titleResults = "Try again";
    },


    setFightMultiplier() {
      localStorage.setItem('fightMultiplier', this.fightMultiplier.toString());
    },

    setStaminaSelectorValues() {
      if(this.currentCharacterStamina < 40) {
        return [{ value: this.fightMultiplier, text: 'You need more stamina to fight!', disabled: true}];
      }

      const choices = [
        {value: null, text: 'Please select Stamina Cost per Fight', disabled: true},
      ];

      const addChoices = [];

      if(this.currentCharacterStamina >= 200) {
        addChoices.push({ value: 5, text: 200 });
      }

      if(this.currentCharacterStamina >= 160) {
        addChoices.push({ value: 4, text: 160 });
      }

      if(this.currentCharacterStamina >= 120) {
        addChoices.push({ value: 3, text: 120 });
      }

      if(this.currentCharacterStamina >= 80) {
        addChoices.push({ value: 2, text: 80 });
      }

      if(this.currentCharacterStamina >= 40) {
        addChoices.push({ value: 1, text: 40 });
      }

      choices.push(...addChoices.reverse());

      return choices;
    },
  },

  components: {
    CombatResults,
  },
};
</script>

<style scoped>
.header-row-title{
  font-size: 1.3em;
  text-align: center;
}

.custom-select{
  margin: 10px 0;
}

.title-choose-weapon{
    font-size: 1.9em;
    text-align: center;
    margin: 20px 0;
}

.info-weapon{
  background-image: url(../assets/v2/bg-weapon.svg);
  background-repeat: no-repeat;
  background-size: cover;
  width: 300px;
  height: 400px;
  margin: 0 auto;
}

.info-weapon-head{
  position: relative;
  top: 20px;
}

.info-weapon-head-1{
  display: flex;
  justify-content: space-between;
}

.info-weapon-head-left,
.info-weapon-head-2-left{
  display: flex;
}

.info-weapon-head-left span,
.info-weapon-head-2-left span{
  content: url(../assets/elements/earth.png);
  /* background-color: #000; */
  display: block;
  width: 35px;
  height: 35px;
  margin-left: 20px;
}

.info-weapon-star{
  display: flex;
}

.info-weapon-star div{
  color: #FCF738;
  display: flex;
  align-items: center;
  margin-left: 5px;
}

.info-weapon-head-right{
  margin-right: 37px;
  font-size: 1.3em;
  display: flex;
  align-items: center;
}

.info-weapon-head-2{
  margin-top: 5px;
}

.info-weapon-head-2-left div{
  display: flex;
  align-items: center;
  margin-left: 10px;
}

.info-weapon-body{
  background-image: url(../assets/sword/sword-air-04.png);
  background-size: cover;
  width: 200px;
  height: 200px;
  margin: 0 auto;
  margin-top: 30px;
}

.info-weapon-footer{
margin-top: 20px;
}

.can-use-weapon{
  height: 16px;
  background-color: #FCF738;
  margin: 0 40px;
  border-radius: 10px;
}

.weapon-name{
  margin-top: 5px;
  font-size: 1.1em;
}

.choose-weapon{
  margin-top: 30px;
  width: 15rem;
  height: 44px;
  background-color: transparent;
  border: none;
  background-image: url(../assets/v2/Choose-new-weapon.svg);
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 0;
  font-size: 1.3em;
  color: #fff;
}

.property-icon{
  background-repeat: no-repeat;
  background-size: contain;
  background-image: url('../assets/v2/Property-system.svg');
  width: 360px;
  height: 80px;
  margin-bottom: 20px !important;
  margin: 0 auto;
}

.combat{
  display: flex;
  justify-content: center;
}

.enemy{
  /* max-width: calc(100% - 431px); */
  width: 74%;
  display: flex;
  justify-content: center;
}

.enemy-box{
  margin-top: 40px;
}

.enemy-box div{
  /* margin: 0 auto; */
  /* margin-bottom: 20px; */
}

.enemy-item{
    background-image: url(../assets/images/bg-item-top.png);
    background-repeat: no-repeat;
    background-size: cover;
    width: 280px;
    height: 380px;
}

.enemy-item-head{
  position: relative;
  top: 17px;
  display: flex;
  justify-content: space-between;
}

.enemy-item-head span:first-child{
  content: url(../assets/elements/fire.png);
  width: 35px;
  height: 35px;
  margin-left: 20px;
}

.enemy-item-head span:last-child{
  /* margin-left: 10px; */
  margin-right: 40px;
  display: flex;
  align-items: center;
  font-size: 1.2em;
}

.enemy-item-body {
    position: relative;
    width: 210px;
    height: 242px;
    margin: 0 auto;
}
.img-enemy{
  background-image: url(../assets/enemies/HumanMale_Bandit.png);
  width: 180px;
  height: 240px;
  background-size: cover;
  bottom: -5px;
  position: relative;
  margin: 0 auto;
}
.around-enemy{
  display: flex;
  background-image: url(../assets/images/fire.png);
  width: 180px;
  height: 240px;
  background-size: cover;
  position: relative;
  z-index: 1;
  top: -220px;
  margin: 0 auto;
}

.enemy-item .enemy-item-footer{
  margin-top: 30px;
}

.enemy-power,
.enemy-xp{
  text-align: center;
  font-size: 1.2em;
}

.Ability-win{
text-align: center;
font-size: 1.3em;
}

.enemy-item-container button{
  display: block;
  margin: 0 auto;
  margin-top: 20px;
  background-color: transparent;
  border: none;
  background-image: url(../assets/v2/btn-fight.png);
  background-size: contain;
  background-repeat: no-repeat;
  width: 150px;
  height: 45px;
  font-size: 1.4em;
  color: #fff;
}

.enemy-item-container button:hover{
  background-image: url(../assets/v2/Btn-fight-opcity.png);
  transition: 0.9s;
}

.btn-confirm{
  margin: 0 20px;
  display: block;
  background-color: transparent;
  border: none;
  background-image: url(../assets/v2/btn-fight.png);
  background-size: contain;
  background-repeat: no-repeat;
  width: 168px;
  height: 50px;
  font-size: 1.4em;
  color: #fff;
}

.btn-no{
  margin: 0 20px;
  background-color: transparent;
  border: none;
  background-image: url(../assets/v2/Btn-blue.svg);
  background-repeat: no-repeat;
  background-size: contain;
  width: 163px;
  height: 48px;
  display: block;
  color: #fff;
  font-size: 1.3em;
  font-weight: 600;
}

.cancelrequestmodal-btn{
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  margin: 50px 0 10px 0;
}

.custom-select{
  background-color: #000;
  border: 1px solid #5bc7f5;
  width: 300px;
  height: 60px;
  border-radius: 10px;
}

.nav-line.boder{
  width: 2px;
  height: 668px;
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url('../assets/v2/boder.png');
  position: relative;
  right: 35px;
}

.content-noti,
.fight-results{
  text-align: center;
  font-size: 1.8em;
  font-weight: 600;
  color: #F58B5B;
  margin: 10px 0;
}

.background-win{
  background-size: 100%;
  background-repeat: no-repeat;
  width: 473px;
  height: 180px;
  position: fixed;
}
.content-results{
  text-align: center;
  font-size: 1.3em;
}

.content-results span{
  color: #F58B5B;
}


.title-results{
  font-size: 1.3em;
  color: #fff;
  text-align: center;
  margin-top: 30px;
}

.btn-close-fight-results{
  border-radius: 0;
  border: none;
  background-image: url(../assets/v2/btn-fight.png);
  width: 130px;
  height: 42px;
  background-size: contain;
  background-repeat: no-repeat;
  margin: 0 auto;
  background-color: transparent;
  margin: 0 auto;
  display: block;
  margin-bottom: 20px;
}


@media (max-width: 1334px) {
  .enemy-list {
    flex-flow: row wrap;
    align-items: center;
  }
  .enemy-list > .enemy-list-child{
     flex-basis: 50%;
  }
  .encounter-button {
    margin-top: 1.35em;
  }
  .nav-line.boder{
    height: 0;
  }
}

/* Needed to asjust image size, not just image column-size and other classes to accommodate that */
@media all and (max-width: 767.98px) {
  /* .encounter img {
    width: calc(100% - 60px);
  } */
  .enemy-list{
    flex-direction:column;
    align-items:center;
  }
  .combat-enemy-container {
    flex-direction: column;
    align-items: center;
  }
  .weapon-selection {
    border-right: none;
  }
  .results-panel {
    width: 100%;
  }
  .nav-line.boder{
    height: 0;
  }
}
.hint.has-tooltip {
  font-size: 1.8rem;
  display: inline-block;
  margin-left: 10px;
}
.dark-bg-text {
  width: 100% !important;
}
.content {
  padding: 0 !important;
}

/* - */
.combat-hints {
  margin-top: 30px;
}
#gtag-link-others {
  margin-top: 30px;
}
.ml-3 {
  margin-left: 0px !important;
}
.header-row {
  display: block;
  text-align: center;
}
.weapon-icon-wrapper {
  margin: 0 auto;
  width: 14em;
  height: 26em;
}

.modal-content {
  border-radius: 20px;
  width: 500px;
}

.list-enemy{
  display: flex;
  justify-content: center;
}

@media (max-width: 767.98px){
  .button.encounter-button{
    top: 10vw;
  }
  .small-durability-bar{
    top: 35px
  }
  .nav-line.boder{
    height: 0;
  }
  .content{
    padding: 0;
  }
}

@media (max-width: 575.98px) {
  .show-reforged {
    width: 100%;
    justify-content: center;
    display: block;
  }
  .row{
    margin: 0;
  }
  .nav-line.boder{
    height: 0;
  }
  .enemy{
    width: 100%;
  }
}
.element-icon {
  width: 3em;
  height: 3em;
}
@media (min-width: 768px){
  .offset-md-3 {
    margin: 0;
  }
  .col-md-6 {
    max-width: 100%;
  }
  .col-md-2 {
    max-width: 100%;
  }
  .offset-md-5 {
    margin-left: 0;
  }
}

.circle-element {
  width: 3.3rem;
  height: 3.3rem;
  border-radius: 50%;
  padding: 0.5rem;
}
</style>
