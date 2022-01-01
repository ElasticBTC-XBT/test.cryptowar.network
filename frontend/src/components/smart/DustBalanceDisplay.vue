<template>
  <div>
    <div class="dust-list row">
      <div
        class="col-lg-4 d-flex flex-column align-items-center"
        :class="isBlacksmith ? 'col-6' : 'col-12'"
      >
        <div
          class="character-item addnew dust-container"
          :class="isBlacksmith && 'no-corner'"
        >
          <div class="dust-info">
            <div class="dust-burn-point">LB</div>
            <span class="dust-power">15 power per point</span>
          </div>
          <div class="dust-image dust-image1"></div>
        </div>
        <h2 class="dust-label text-center" v-if="!isBlacksmith">Lesser</h2>
        <div class="dust-quantity-wrap">
          <div class="dust-quantity text-center">
            <span>{{getLesserDust()}}</span>
          </div>
        </div>
      </div>
      <div
        class="col-lg-4 d-flex flex-column align-items-center"
        :class="isBlacksmith ? 'col-6' : 'col-12'"
      >
        <div
          class="character-item addnew dust-container"
          :class="isBlacksmith && 'no-corner'"
        >
          <div class="dust-info">
            <div class="dust-burn-point">4B</div>
            <span class="dust-power">30 power per point</span>
          </div>
          <div class="dust-image dust-image2"></div>
        </div>
        <h2 class="dust-label text-center" v-if="!isBlacksmith">Greater</h2>
        <div class="dust-quantity-wrap">
          <div class="dust-quantity text-center">
            <span>{{getGreaterDust()}}</span>
          </div>
        </div>
      </div>
      <div
        class="col-lg-4 d-flex flex-column align-items-center"
          :class="isBlacksmith ? 'col-6' : 'col-12'"
      >
        <div
          class="character-item addnew dust-container"
          :class="isBlacksmith && 'no-corner'"
        >
          <div class="dust-info">
            <div class="dust-burn-point">5B</div>
            <span class="dust-power">75 power per point</span>
          </div>
          <div class="dust-image dust-image3"></div>
        </div>
        <h2 class="dust-label text-center" v-if="!isBlacksmith">Powerful</h2>
        <div class="dust-quantity-wrap">
          <div class="dust-quantity text-center">
            <span>{{getPowerfulDust()}}</span>
          </div>
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
    ...mapActions([]),
  }
};
</script>

<style>
.dust-list {
  justify-content: space-around;
}

.character-item.addnew.dust-container {
  margin: 0 90px;
  cursor: pointer;
  align-items :center;
  flex-direction: column;
  justify-content: space-around;
}

.character-item.addnew.dust-container.no-corner {
  height: 213px !important;
  margin: 0;
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
  content: url("../../assets/dusts/greaterDust.svg");
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
  padding: 0 160px;
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

@media (max-width: 1024px) {
  .character-item.addnew.dust-container {
    margin: 50px auto 0;
    height: 324px;
    width: 225px;
  }

  .dust-quantity-wrap {
    padding: 0 50px;
  }

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

  .dust-quantity-wrap {
    padding: 0 260px;
  }

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
  .dust-quantity-wrap {
    padding: 0 100px;
  }
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
