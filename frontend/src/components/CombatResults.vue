<template>
  <div class="results-panel">
    <div class="background-win"></div>
    <span v-if="checkResults" class="outcome"><div class="win-results"></div>YOU {{ getSuccessText() }}</span>
    <span v-if="!checkResults" class="outcome"><div class="lose-results"></div>YOU {{ getSuccessText() }}</span>
    <!-- <span class="roll">{{ "You rolled "+results[1]+", Enemy rolled "+results[2] }}</span> -->
    <!-- <span v-if="results[0]" class="reward">
      {{ "You earned "+results[3]+" xp"}}
      <br>
      <span v-tooltip="convertWei(results[4])+' xBlade'">{{"and "+formattedXBlade}}</span>
        <Hint text="xBlade earned is based on gas costs of the network plus a factor of your power" />
    </span> -->
    <!-- <span>
         {{ "You spent ~" + results[5]+" BNB with gas taxes"}}
    </span> -->
    <div class="results-body">
      Your Opponent Went: <span> 123</span>
    </div>
    <div class="results-footer">{{ getSuccessText() }}: <div><span></span> 100</div></div>
  </div>
</template>

<script>
import { toBN, fromWeiEther } from '../utils/common';
// import Hint from '../components/Hint.vue';

export default {
  props: ['results'],

  data(){
    return{
      checkResults: this.results[0],
    };
  },

  computed: {
    formattedXBlade() {
      const xBladeBalance = fromWeiEther(this.results[4]);
      return `${toBN(xBladeBalance).toFixed(2)} xBlade`;
    }
  },

  methods: {
    getSuccessText() {
      return this.results[0] ? 'Win' : 'Lost';
    },
    convertWei(wei) {
      return fromWeiEther(wei);
    }
  },

  components: {
    // Hint,
  },
};
</script>

<style>
.results-panel {
  width: 25em;
  /* background: rgba(255, 255, 255, 0.1); */
  /* box-shadow: 0 2px 4px #ffffff38; */
  border-radius: 5px;
  padding: 0.5em;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  margin: auto;
  text-align: center;
  /* background-color: #fff; */
}

/* .background-win{
  background-image: url(../assets/shield1.png);
  background-size: 100%;
  background-repeat: no-repeat;
  width: 400px;
  height: 500px;
  position: fixed;
  top: 25em;
  z-index: 5;
  left: 655px;
} */

.outcome {
  font-size: 2em;
  font-weight: bold;
  padding: 0.5em;
  display: flex;
  align-items: center;
  color: #F58B5B;
  text-transform: uppercase;
}

.outcome .win-results{
  background-image: url('../assets/v2/icon-win.svg');
  background-repeat: no-repeat;
  background-size: cover;
  width: 50px;
  height: 50px;
  margin-right: 20px;
}

.outcome .lose-results{
  background-image: url('../assets/v2/icon-lose.svg');
  background-repeat: no-repeat;
  background-size: cover;
  width: 50px;
  height: 50px;
  margin-right: 20px;
}

.results-body,
.results-footer{
  font-size: 1.3em;
}

.results-footer{
  font-size: 1.3em;
  display: flex;
}

.results-body span{
  color: #F58B5B;
}

.results-footer div{
  display: flex;
  align-items: center;
  color: #D858F7;
  font-weight: 600;
}

.results-footer span{
  background-image: url(../assets/v2/icon-crypto.svg);
  width: 23px;
  height: 22px;
  background-repeat: no-repeat;
  background-size: cover;
  margin: 0 10px;
  display: block;
}

.victory {
  color:greenyellow;
}
.loss {
  color: red;
}
.roll {
  font-size: 1.25em;
}
.reward {
  font-size: 1.5em;
}
</style>
