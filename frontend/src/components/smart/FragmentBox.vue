<template>
    <div>
      <b-modal id="fragmentOpenBoxModal" hide-footer hide-header hide-header-close>
        <div class="notEnoughImage"></div>
        <span class="errorText" v-if="errorMessage">{{errorMessage}}</span>
        <div class="buttonFightFragment" @click="$bvModal.hide('fragmentOpenBoxModal')"><span>GO TO CHECK</span></div>
      </b-modal>
      <b-modal id="convertFragmentModal" hide-footer hide-header hide-header-close>
        <div class="buttonFightFragment" @click="$bvModal.hide('fragmentOpenBoxModal')"><span>GO TO CHECK</span></div>
      </b-modal>
       <b-modal id="successOpenBox" hide-footer hide-header hide-header-close>
         <div class="congratsText">Check your new weapon at Weapon Store</div>
        <div class="buttonFightFragment" @click="$bvModal.hide('successOpenBox')"><span>GO TO CHECK</span></div>
      </b-modal>
      <b-modal id="modal-buyitem">
          <span v-if="this.boxType.length>2" class="congratsText">You received a {{this.boxType[0].toUpperCase() + this.boxType.slice(1)}} Box</span>
          <div :class="this.boxType +'-box'"></div>
          <div>
            <div>
              <b-button class="mt-3" block @click="$bvModal.hide('modal-buyitem')">LATER</b-button>
            </div>
            <div>
              <b-button class="mt-2" block @click="$bvModal.hide('modal-buyitem'); buyItem('common')">OPEN NOW</b-button>
            </div>
          </div>
        </b-modal>
        <div class="col-lg-12 d-flex justify-content-end align-items-end">
            <div class="d-flex flex-column">
                <span class="fragmentAmountText">Your xGem</span>
                <span class="fragmentAmountNumber">{{xGemAmount}} 💎</span>
            </div>
        </div>
        <div class="dust-list row">
            <div
            class="col-lg-4 d-flex flex-column align-items-center"
            :class="isBlacksmith ? 'col-6' : 'col-12'"
            >
            <div v-if="isConvertingFragmentToBox" id="fight-overlay">
            <div class="waiting animation" v-if="isConvertingFragmentToBox" margin="auto">
                  <div class="fighting-img"></div>
                  <!-- <div class="waiting-text">
                    <i class="fas fa-spinner fa-spin"></i>
                    Waiting for fight results...
                  </div> -->
                </div>
            </div>
            <div
                class="character-item addnew dust-container"
                :class="isBlacksmith && 'no-corner'"
            >
                <div class="dust-image dust-image2"></div>
            </div>
            <div class="buttonFightFragment" @click="handleConvertBox">
                <!-- <div class="dust-quantity text-center"> -->
                <span>{{'OPEN ('+fragmentPerBox+'💎)'}}</span>
                <!-- </div> -->
            </div>
            </div>
        </div>
    </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  props: ['isBlacksmith'],

  data() {
    return {
      xGemAmount: 0,
      fragmentPerBox: 0,
      isConvertingFragmentToBox: false,
      errorMessage: '',
      boxId: -1,
      boxType: ''
    };
  },

  components: {
  },

  computed: {
    ...mapGetters(['getPowerfulDust', 'getGreaterDust', 'getLesserDust']),

  },

  async created() {
  },

  methods: {
    ...mapActions(["getFragmentAmount", "convertFragmentToBox", "openCommonBox", "getMyBoxes", "getBoxDetail"]),
    async handleConvertBox() {
      try{
        if(this.xGemAmount < this.fragmentPerBox) {
          this.errorMessage = "Not enough xGem!";
          this.$bvModal.show('fragmentOpenBoxModal');
          return;
        }
        this.isConvertingFragmentToBox =true;
        const response = await this.convertFragmentToBox();
        if(response) {
          this.boxId = response.boxId;
          const objectXGem = await this.getFragmentAmount();
          this.xGemAmount = objectXGem.fragmentAmount;
          this.fragmentPerBox = objectXGem.fragmentPerBox;
          const boxTypeReturn = await this.getBoxDetail({boxId:this.boxId});
          switch(boxTypeReturn) {
          case 1: {
            this.boxType= 'rare';
            break;
          }
          case 2: {
            this.boxType = 'epic';
            break;
          }
          default: {
            this.boxType = 'common';
          }
          }
          await this.getMyBoxes();
          setTimeout(() => {
            this.isConvertingFragmentToBox =false;
            this.$bvModal.show('modal-buyitem');
          }, 4000);
        }else {
          this.isConvertingFragmentToBox =false;
        }
      }catch(error) {
        this.isConvertingFragmentToBox =false;
      }
    },
    async buyItem(itemType) {
      switch(itemType) {
      case "common": {
        try{
          this.isConvertingFragmentToBox=true;
          await this.openCommonBox({boxId: this.boxId});
          this.isConvertingFragmentToBox=false;
          setTimeout(() => {
            this.$bvModal.show('successOpenBox');
          }, 1000);
        }catch(error) {
          this.isConvertingFragmentToBox=false;
        }
        break;
      }
      default: {
        break;
      }
      }
    }
  },
  async mounted() {
    setTimeout(async () => {
      const objectXGem = await this.getFragmentAmount();
      this.xGemAmount = objectXGem.fragmentAmount;
      this.fragmentPerBox = objectXGem.fragmentPerBox;
    }, 500);
  }
};
</script>

<style scoped>
.dust-list {
  max-width: 1200px;
  display: flex;
  align-items: center;
  /* margin: 0 auto !important; */
  justify-content: center;
  padding-top: 3rem;
}

#modal-buyitem .modal-body {
  margin: 0
}

.fragmentAmountText {
  font-size: 1.5rem;
  font-weight: 600;
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

.errorText {
  font-size: 2rem;
  font-weight: bold;
  height: 2.5rem;
}

.animation{
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
}

.congratsText {
  font-size: 1.5rem;
  font-weight: bold;
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
.buttonFightFragment {
  border: none;
    height: 47px;
    background-image: url('../../assets/images/bg-fight-button.png');
    background-size: 100% 100%;
    background-repeat: no-repeat;
    background-color: transparent;
    margin-left: 0.8rem;;
    min-width: 190px;
    justify-content: center;
    align-items: center;
    display: flex;
    margin-top: 2rem;
    cursor: pointer;
}

.notEnoughImage {
  background-image: url('../../assets/images/iconLost.png');
  width: 4rem;
  height: 4rem;
  background-repeat: no-repeat;
  background-size: 100% 100%;
}

.buttonFightFragment span {
  font-size: 1.2rem;
  font-weight: bold;
}

.character-item.addnew.dust-container {
  max-width: 298px;
  cursor: pointer;
  align-items :center;
  flex-direction: column;
  justify-content: space-around;
  margin: 0 auto;
}

.btn-open-box {
  height: 48px !important;
  background-image: url("../../assets/v2/btn-bg-pink.png") !important;
  background-size: cover;
  margin-right: 0 !important;
  display: flex;
  align-items: center;
}

.character-item.addnew.dust-container.no-corner {
  max-width: 174px;
  height: 213px !important;
  margin: 0 auto;
}

.dust-burn-point {
  font-size: 32px;
  font-weight: bold;
  text-align: center;
}

.dust-power {
  font-size: 21px;
}

.no-corner .dust-power {
  font-size: 18px;
}

.dust-image {
  width: 269px;
  height: 269px;
}

.dust-container.no-corner .dust-image {
  width: 135px;
  height: 135px;
}

.dust-image1 {
  content: url("../../assets/dusts/lesserDust.svg");
}

.dust-image2 {
  content: url("../../assets/dusts/fragmentBox.png");
}

.dust-image3 {
  content: url("../../assets/dusts/powerfulDust.svg");
}

.dust-label {
  font-size: 34px !important;
  font-weight: 400 !important;
  margin: 16px 0;
}

.dust-quantity-wrap {
  display: flex;
  align-items: center;
  width: 100px;
  margin: 0 auto;
  margin-top: 2rem;
}

.dust-quantity {
  min-width: 100px;
  margin: auto;
  background-color: #000;
  width: 100%;
  border: 1px solid #1385B7;
  border-radius: 16px;
  font-size: 32px;
}

.blacksmith .dust-quantity-wrap {
  margin-top: 8px;
  padding: 0;
}

.blacksmith .dust-quantity {
  width: 100px;
  font-size: 24px;
}
.fragmentAmountNumber {
  font-size: 2rem;
  font-weight: bold;
}
#modal-buyitem .modal-body{
  margin: 0;
}


@media (max-width: 1024px) {
  .character-item.addnew.dust-container {
    margin: 50px auto 0;
    height: 324px;
    width: 225px;
  }

  /* .dust-quantity-wrap {
    padding: 0 50px;
  } */

  .dust-image {
    max-width: 200px;
    max-height: 200px;
  }
}

@media (max-width: 768px) {
  .dust-list {
    justify-content: center
  }

  .dust-image {
    max-width: 200px;
    max-height: 200px;
  }

  /* .dust-quantity-wrap {
    padding: 0 260px;
  } */

  .dust-label {
    margin: 0 0 16px;
  }
}

@media (max-width: 576px) {
  .character-item.addnew.dust-container.no-corner {
    width: 100% !important;
    padding: 5px;
  }
  .no-corner .dust-burn-point {
    font-size: 21px;
  }
  .no-corner .dust-power{
    font-size: 16px;
  }
  #modal-buyitem .modal-body {
    position: relative;
    top: -38%;
  }
  /* .dust-quantity-wrap {
    padding: 0 100px;
  } */
}
/* .slidecontainer {
  width: 100%;
}

.range{
  border-radius: 10px;
  padding: 0 65px 0 45px;
}
.range .sliderValue{
  position:relative;
  width:100%;
}
.range .sliderValue span{
  position: absolute;
  color: #9e8a57;
  font-weight: 500;
  top: -40px;
  transform: translateX(-50%) scale(0);
  transform-origin: bottom;
  transition: transform 0.3s ease-in-out;
  line-height: 55px;
  z-index: 2;
}
.range .sliderValue span.show{
  transform: translateX(-50%) scale(1);
}
.range .sliderValue span:after{
  position: absolute;
  content: "";
  height:45px;
  width:45px;
  background: red;
  left:50%;
  transform: translateX(-50%) rotate(45deg);
  border:solid 3px #9e8a57;
  z-index: -1;
  border-top-left-radius: 50%;
  border-top-right-radius: 50%;
  border-bottom-left-radius: 50%;
}
.range .field{
  position:relative;
  display:flex;
  align-items: center;
  justify-content: center;
  height: 100%;
}
.range .field .value{
  position:absolute;
  font-size:18px;
  font-weight:600;
  color: #9e8a57;
}
.range .field .value.left{
  left: -22px;
}
.range .field .value.right{
  right: -43px;
}
.range .field input{
  -webkit-appearance: none;
  height:3px;
  background:#9e8a57;
  border-radius: 5px;
  outline:none;
  border:none;
  width:100%;
}
.range .field input::-webkit-slider-thumb{
  -webkit-appearance: none;
  height: 20px;
  width: 20px;
  background: #9e8a57;
  border-radius: 50%;
  border: 1px solid white;
  cursor: pointer;
} */

</style>
