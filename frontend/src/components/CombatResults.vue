<template>
  <div class="results-panel">
    <div class="background-win"></div>
    <span v-if="checkResults && !propResultsFromPVP" class="outcome results">{{ getSuccessText() }}</span>
    <span v-if="!checkResults && !propResultsFromPVP" class="outcome results">{{ getSuccessText() }}</span>

    <span v-if="results === 1 && propResultsFromPVP" class="outcome"><div class="win-results"></div>{{ getSuccessText() }}</span>
    <span v-if="results === 2 && propResultsFromPVP" class="outcome"><div class="lose-results"></div>{{ getSuccessText() }}</span>
    <span v-if="results === 3" class="outcome">DRAW</span>
    <span v-if="!propResultsFromPVP" class="roll">{{ "You rolled "+results[1]+", Enemy rolled "+results[2] }}</span>
    <div v-if="!results[0] && !resultsPVP" class="rewardPve">
      <span class="reward-lose">
        {{ "You earned "+results[3]+" xp"}}
        <span v-tooltip="convertWei(results[4])+' xBlade'">{{"and "+formattedXBlade}}</span>
          <Hint text="xBlade earned is based on gas costs of the network plus a factor of your power" />
      </span>
      <br>
      <span v-if="results[6]">{{"You get " +results[6]+ " 💎"}}</span>
    </div>
    <div v-if="results[0] && !resultsPVP" class="rewardPve">
      {{ "You earned "+results[3]+" xp"}}
      <span v-if="!propResultsFromPVP" v-tooltip="convertWei(results[4])+' xBlade'">{{formattedXBlade}}
        <span v-if="results[6]">{{"and " +results[6]+ " 💎"}}</span>
      </span>
        <Hint text="xBlade earned is based on gas costs of the network plus a factor of your power" />
    </div>
    <span v-if="!propResultsFromPVP">
         {{ "You spent ~" + results[5]+" BNB with gas taxes"}}
    </span>
    <div v-if="propResultsFromPVP" class="results-body">
      Your Opponent Went: <span> 123</span>
    </div>
    <div v-if="propResultsFromPVP && results !== 3" class="results-footer">{{ getSuccessText() }}: <div><span></span> 100</div></div>
  </div>
</template>

<script>
import { toBN, fromWeiEther } from '../utils/common';
// import Hint from '../components/Hint.vue';

export default {
  props: ['results', 'propResultsFromPVP'],

  data(){
    return{
      checkResults: this.results[0],
      checkResultsFromPVP: false,
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
      if(this.propResultsFromPVP){
        this.checkResultsFromPVP = true;
        if(this.results === 1) return 'YOU WIN';
        else if(this.results === 2) return 'YOU LOST';
      }
      else
      {
        this.checkResultsFromPVP = false;
        return this.results[0] ? 'You won the fight!' : 'You lost the fight!';
      }
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
}

.outcome {
  font-size: 2em;
  font-weight: bold;
  padding: 0.5em;
  display: flex;
  align-items: center;
  padding-top: 0;
}

.outcome.results{
  color: #F58B5B;
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
  margin-top: 10px;
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
.rewardPve,
.reward-lose{
  width: 100%;
  font-size: 1.25rem;
  margin: 10px 0;
}
@media (max-width: 575.98px) {
  .outcome.results{
    font-size: 1.3em;
  }
  .results-panel .roll,
  .results-panel .reward,
  .rewardPve,
  .reward-lose{
    font-size: 1em;
  }
}
</style>
