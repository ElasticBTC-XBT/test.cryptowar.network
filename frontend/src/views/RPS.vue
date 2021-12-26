<template>
  <div class="body main-font">
    <CombatPVP :propCheckSelect = checkSelect v-if="checkSelect"/>
    <div v-if="!checkSelect" class="container">
      <div class="row">
        <div class="col-12">
          <div class="quantity-heroes">
            <div><span>123</span> Heroes In Chanllenge Mode</div>
            <div><span>456</span> Heroes In Career Mode</div>
          </div>
        </div>
      </div>
      <div class="row">
        <div :class="addClass" class="col-12 info-box">
          <div class="info-user">
            <div class="info-user-title">Your Information</div>
            <div class="info-user-body">
              <span>HEROES available</span>
              <div>4</div>
            </div>
            <div class="info-user-btn">
              <button @click="$bvModal.show('selectHeroOrWeaponModal'), selectHero = true">SELECT HERO</button>
              <button @click="checkCreateRoom = true, selectHero = false, console()">CREATEROOM</button>
            </div>
          </div>
        </div>
      </div>
      <b-modal id="selectHeroOrWeaponModal" class="modal-box" hide-footer>
        <div class="icon-close" @click="$bvModal.hide('selectHeroOrWeaponModal')"></div>
        <!-- <div class="title-results">{{titleResults}}</div>
        <CombatResults v-if="resultsAvailable" :results="fightResults" /> -->
        <div class="row list" v-if="selectHero">
          <div class="item-modal" v-for="i in 10" :key="i">
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
            <div>
                <button @click="checkSelect = true,
                $bvModal.hide('selectHeroOrWeaponModal')" class="btn-request-fight">SELECT</button>
            </div>
          </div>
        </div>
      </b-modal>
      <div class="row" v-if="!checkCreateRoom">
        <div class="col-xl-3 col-12 row-left">
          <div>
            <div class="search-hero">
                <input type="text" placeholder="Search Hero's ID" />
            </div>
            <label class="checkbox-hero">
                <input type="checkbox"> <span class="checkb"></span> <span class="checkbox-content">Browse Hroes</span>
            </label>
            <button class="reset-hero">RESET</button>
            <div class="hero-selected"><div class="bg-hero"></div></div>
            <button class="select-hero-to-fight">#SELECT HERO TO FIGHT</button>
          </div>
          <div class="nav-line boder"></div>
        </div>
        <div class="col-xl-9 col-12 nav-option-box">
          <div class="nav-option">
            <b-nav pills>
              <b-nav-item
                class="nav-item"
                :active="true"
                ><div>ROOM LIST<div>456</div></div></b-nav-item
              >
            </b-nav>
          </div>
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
                  <div class="remain-hero">Room Status: <span>1/2</span> or <span>2/2</span></div>
                </div>
              </div>
              <button @click="$bvModal.show('fightModal')" class="btn-request-fight">JOIN</button>
              <!-- <router-link :to="{ name: 'pvp-fight' }">
              </router-link> -->
          </div>
        </div>
      </div>
    </div>
    <div class="row container-create-room" v-if="checkCreateRoom">
        <div class="col-xl-12 col-12 nav-option-box create">
          <div class="nav-option">
            <b-nav pills>
              <b-nav-item
                class="nav-item"
                :active="true"
                ><div>ROOM LIST<div>456</div></div></b-nav-item
              >
            </b-nav>
          </div>
        </div>
      <div class="col-xl-12 create-room">
        <div>
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
                </div>
              </div>
            </div>
            <div class="create-room-body">
              <div>
                <div>
                  <div class="icon-drag"></div>
                </div>
                <div>
                  <div class="icon-punch"></div>
                </div>
                <div>
                  <div class="icon-hand"></div>
                </div>
              </div>
              <button>LOCK</button>
            </div>
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
                </div>
              </div>
              <div class="btn-leave-room"><button>LEAVE ROOM</button></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
// import Character from "../components/Character.vue";
// import { mapActions, mapGetters, mapState, mapMutations } from "vuex";
// import Events from "../events";
import CombatPVP from "../views/CombatPVP.vue";

export default {
  data() {
    return {
      changeMode: true,
      careerMode: false,
      requestChallenge: false,
      selectHero: false,
      selectWeapon: false,
      checkSelect: false,
      cancelRequest: false,
      checkCreateRoom: false,
    };
  },

  computed: {
  },

  methods: {
    // sendMessage(){
    //   Events.$emit('hello', "true");
    //   console.log("hiep");
    // },
    // checkActive(){
    //   if(this.changeMode || this.careerMode || this.requestChallenge){
    //     this.addClass = "";
    //     this.checkSelect = false;
    //   }
    // },


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
    CombatPVP,
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
  max-width: 1650px;
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
  margin-top: 40px;
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
  justify-content: center;
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
  width: 50em;
  margin: 0 auto;
  display: flex;
  justify-content: center;
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
  width: 18em;
  height: 25.5em;
  background-position: left;
  background-repeat: no-repeat;
  background-size: contain;
  background-image: url(/img/bg-item-top.9aaeb3bd.png);
  margin: 1.6em 0 4em 0;
}

.item-modal{
  width: 18.5em;
  height: 26.5em;
  background-position: left;
  background-repeat: no-repeat;
  background-size: contain;
  background-image: url(../assets/images/bg-item-top.png);
  margin: 1.6em 0 4em 0;
}

.info {
  margin: 0 11px 10px 11px;
  height: 100%;
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
  font-size: 1.2em;
  margin-right: 28px;
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
  color: #FEA829;
}

.info-footer .cost > div{
  background-image: url(../assets/v2/icon-crypto.svg);
  width: 20px;
  height: 19px;
  background-repeat: no-repeat;
  background-size: cover;
  margin-right: 6px;
}

.remain-hero span:first-child{
  color: #29FD2E;
}

.remain-hero span:last-child{
  color: #FD0D1B;
}
.cost{
  display: flex;
  align-items: center;
  justify-content: center;
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
  /* margin-top: 20px; */
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

.checkbox-hero{
    position: relative;
    margin: 20px 0;
    display: flex;
    align-items: center;
    cursor: pointer;
    padding: 0 5px;
}
.checkbox-hero input{
    position: absolute;
    opacity: 0;
    cursor: pointer;
    width: 30px;
    height: 30px;
    padding-top: 2px;
}
.checkb{
    position: absolute;
    top: 0;
    left: 4px;
    height: 25px;
    width: 25px;
    background-color: #000;
    border: solid 3px white;
    border-radius: 5px;
}
.checkb:after{
    content: "";
    position: absolute;
    display: none;
}
.checkbox-hero .checkb:after{
    left: 6px;
    top: 3px;
    width: 7px;
    height: 12px;
    border: solid white;
    border-width: 0 3px 3px 0;
    -webkit-transform: rotate(45deg);
    -ms-transform: rotate(45deg);
    transform: rotate(45deg);
}
.checkbox-hero span{
    display: block;
}
.checkbox-hero input:checked ~ .checkb:after{
    display: block;
}

.reset-hero{
  background-image: linear-gradient(#F3859C, #7F327C);
  border: none;
  padding: 5px 20px;
  font-size: 1.3em;
  font-weight: 600;
  color: #fff;
  border-radius: 6px;
  margin: 0 0 20px 5px;
}

.checkbox-content{
  margin-left: 32px;
  font-size: 1.3em;
}

.hero-selected{
  background-image: url(../assets/v2/bg-weapon.svg);
  background-repeat: no-repeat;
  background-size: cover;
  width: 300px;
  height: 400px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  margin-top: 20px;
}

.hero-selected .bg-hero{
  background-image: url(../assets/v2/bg-select-hero.svg);
  background-repeat: no-repeat;
  background-size: cover;
  width: 190px;
  height: 225px;
  margin: 0 auto;
}

.select-hero-to-fight{
  width: 17rem;
  height: 50px;
  background-color: transparent !important;
  border: none !important;
  background-image: url(../assets/v2/Choose-new-weapon.svg);
  background-repeat: no-repeat;
  background-size: cover;
  border-radius: 0;
  margin: 0 auto;
  margin-top: 30px;
  font-size: 1.2em;
  font-weight: 600;
  color: #fff;
  display: block;
}

.nav-line.boder{
  width: 2px;
  height: 668px;
  /* position: relative;
  left: -28px;
  top: -120px; */
  background-repeat: no-repeat;
  background-size: cover;
  background-image: url('../assets/v2/boder.png');
}

.row-left{
  display: flex;
  justify-content: space-between;
}

.nav-option-box{
  width: calc(100% - 405px);
}

.create-room{
  max-width: 80em;
  height: 40em;
  background-image: linear-gradient(rgba(245, 111, 86, 0.3), rgba(86, 82, 219, 0.3));
  border: 1px solid #3CDE9B;
  margin-top: 40px;
  margin-bottom: 15em;
  display: flex;
  justify-content: center;
  align-items: center;
}

.nav-option-box.create{
  max-width: 60em;
}

.row.container-create-room{
  display: flex;
  justify-content: center;
}

.create-room > div{
  display: flex;
  align-items: center;
}

.create-room-body > div{
  display: flex;
}

.create-room-body{
  margin: 0 30px;
}

.create-room-body > div > div{
  background-image: url(../assets/v2/bg.svg);
  width: 7em;
  height: 7em;
  margin: 0 10px;
  display: flex;
  justify-content: center;
  align-items: center;
}

.create-room-body > div > div > div{
  width: 3em;
  height: 4em;
  margin-right: 10px;
}

.create-room-body .icon-drag{
  background-image: url(../assets/v2/icon-drag.svg);
}

.create-room-body .icon-punch{
  background-image: url(../assets/v2/icon-punch.svg);
  background-repeat: no-repeat;
  width: 3.2em;
  height: 3.2em;
}

.create-room-body .icon-hand{
  background-image: url(../assets/v2/icon-hand.svg);
}

.create-room-body button{
  background-color: transparent;
  border: none;
  background-image: url(../assets/v2/Btn-blue.svg);
  background-repeat: no-repeat;
  background-size: cover;
  width: 163px;
  height: 48px;
  display: block;
  color: #fff;
  font-size: 1.3em;
  font-weight: 600;
  margin: 0 auto;
  margin-top: 20px;
}

.btn-leave-room{
  display: flex;
  justify-content: flex-end;
}

.btn-leave-room button{
  /* margin: 0 auto; */
  display: block;
  background-color: transparent;
  border: none;
  background-image: url(../assets/v2/Btn-fight.svg);
  width: 190px;
  height: 72px;
  background-size: cover;
  background-repeat: no-repeat;
  color: #fff;
  font-weight: 600;
  font-size: 1.2em;
  /* margin-top: 20px; */
  margin-right: 11px;
  margin-bottom: 20px;
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
  .nav-line.boder{
    height: 0;
  }
  .row-left{
  justify-content: center;
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
  .nav-line.boder{
    height: 0;
  }
    .row-left{
  justify-content: center;
}
}

@media (max-width: 375.98px) {
  #selectHeroOrWeaponModal .icon-close{
  right: -19em;
}
  .nav-line.boder{
    height: 0;
  }
    .row-left{
  justify-content: center;
}
}

@media (min-width: 768px) {
}
</style>
