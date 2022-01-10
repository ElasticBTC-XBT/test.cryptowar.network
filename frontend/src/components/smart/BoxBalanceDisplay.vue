<template>
  <div>
    <div class="col-xl-12">
      <div class="box-list row">
        <div class="col-lg-3">
          <div class="character-item addnew box-container">
            <div class="box-image box-image1"></div>
            <h2 class="box-label text-center">Common Box</h2>
            <div class="box-quantity-wrap">
              <div class="box-quantity text-center">
                Quantity: <span>0</span>
                <!-- <span>{{getCommonBox()}}</span> -->
              </div>
            </div>
          </div>
          <div class="btn-open-wrap">
            <b-button
              class="gtag-link-others btn-blue-bg btn-open-box"
              v-html="`OPEN`"
            ></b-button>
          </div>
        </div>
         <div class="col-lg-3">
          <div class="character-item addnew box-container">
            <div class="box-image box-image2"></div>
            <h2 class="box-label text-center">Rare Box</h2>
            <div class="box-quantity-wrap">
              <div class="box-quantity text-center">
                Quantity: <span>0</span>
                <!-- <span>{{getRareBox()}}</span> -->
              </div>
            </div>
          </div>
          <div class="btn-open-wrap">
            <b-button
              class="gtag-link-others btn-blue-bg btn-open-box"
              v-html="`OPEN`"
            ></b-button>
          </div>
        </div>
         <div class="col-lg-3">
          <div class="character-item addnew box-container">
            <div class="box-image box-image3"></div>
            <h2 class="box-label text-center">Epic Box</h2>
            <div class="box-quantity-wrap">
              <div class="box-quantity text-center">
                Quantity: <span>0</span>
                <!-- <span>{{getEpicBox()}}</span> -->
              </div>
            </div>
          </div>
          <div class="btn-open-wrap">
            <b-button
              class="gtag-link-others btn-blue-bg  btn-open-box"
              v-html="`COMING SOON`"
              disabled
            ></b-button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { mapActions, mapGetters } from 'vuex';

export default {
  props: [],

  data() {
    return {
    };
  },

  components: {
  },

  computed: {
    ...mapGetters(['getCommonBox', 'getRareBox', 'getEpicBox']),

  },

  async created() {
  },

  methods: {
    ...mapActions([]),
  }
};
</script>

<style>
.box-list {
  justify-content: space-around;
}

.character-item.addnew.box-container {
  margin: 0 35px;
  cursor: pointer;
  align-items :center;
  flex-direction: column;
  justify-content: space-around;
  padding: 30px 0;
}

.box-image {
  width: 269px;
  height: 269px;
}

.box-image1 {
  content: url("../../assets/common-box.png");
}

.box-image2 {
  content: url("../../assets/rare-box.png");
}

.box-image3 {
  content: url("../../assets/epic-box.png");
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
    color: #F58B5B;
}

.btn-open-wrap {
  display: flex;
  align-items: center;
  justify-content: center;
  margin-top: 30px;
}

.btn-open-box {
  height: 48px !important;
  background-image: url("../../assets/v2/btn-bg-pink.png") !important;
  background-size: cover;
  margin-right: 0 !important;
}

@media (max-width: 576px) {
  .box-label {
    font-size: 21px !important;
  }

  .box-quantity {
    font-size: 18px;
  }
}

@media (max-width: 768px) {
  .box-list {
    justify-content: center
  }

  .box-label {
    margin: 0 0 16px;
  }
}

@media (max-width: 1024px) {
  .character-item.addnew.box-container {
    margin: 50px auto 0;
    height: 324px;
    width: 225px;
  }

  .box-image {
    max-width: 200px;
    max-height: 200px;
  }
}

</style>