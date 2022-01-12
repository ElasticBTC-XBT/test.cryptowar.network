<template>
  <div class="results-panel">
      <span class="outcome">{{ getHeaderText() }}</span>
      <div class="containerText">
          <div :class="getImageSource()"></div>
        <span class="successText">{{ getSuccessText() }}</span>
    </div>
    <div class="containerText">
        <span class="roll">{{ "Your Opponent went:" }}</span>
        <span class="opponentScore">{{results[2]}}</span>
    </div>
    <div class="containerText" v-if="this.results[3]>= this.results[2]">
        <span class="roll">{{ "Fight Tax:" }}</span>
        <span class="opponentScore">5%</span>
    </div>
    <div class="rowView">
      <span v-if="results[0]" class="reward">
          {{this.results[3]>= this.results[2]? 'Win:': 'Lost:'}}
      </span>
      <img class="iconCW" src="../../assets/images/iconCW.png"/>
      <span class="incomeCW">{{getIncome()}}</span>
    </div>
  </div>
</template>

<script>
import { toBN, fromWeiEther } from '../../utils/common';

export default {
  props: ['results'],

  computed: {
    formattedXBlade() {
      const xBladeBalance = fromWeiEther(this.results[4]);
      return `${toBN(xBladeBalance).toFixed(2)} xBlade`;
    }
  },

  methods: {
    getSuccessText() {
      if(this.results[3]>= this.results[2]) {
        return 'YOU WIN!';
      }else {
        return 'YOU LOST';
      }
    },
    getHeaderText() {
      if(this.results[3]>= this.results[2]) {
        return 'Congratulation!';
      }else {
        return 'Better luck next time';
      }
    },

    getImageSource() {
      if(this.results[3]>= this.results[2]) {
        return 'iconFightWin';
      }else {
        return "iconFightLost";
      }
    },
    convertWei(wei) {
      return fromWeiEther(wei);
    },
    getIncome() {
      if(this.results[3]>= this.results[2]) {
        return this.convertWei(this.results.matchReward *0.95);
      }else {
        const lostNumber = toBN(fromWeiEther(this.results[4])).toFixed(2);
        return Number(lostNumber)/0.95;
      }
    }
  },

  mounted() {
    console.log('results', this.results);
  },

  components: {
  },
};
</script>

<style>
.results-panel {
  width: 25em;
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 4px #ffffff38;
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
  color: #fff;
}
.successText {
  font-size: 46px;
  font-weight: bold;
  color: #F58B5B;
  margin-left: 0.5rem;
}
.opponentScore {
  font-size: 1.5em;
  color: #F58B5B;
  padding-left: 0.5rem;
}
.victory {
  color:greenyellow;
}
.loss {
  color: red;
}
.roll {
  font-size: 1.25em;
  color: #fff;
}
.reward {
  font-size: 1.25em;
  color: #fff;
  flex: 0.4;
}
.containerText {
    display: flex;
    align-items: center;
    padding-bottom: 0.5rem;
}
.iconFightWin {
    background-image: url('../../assets/images/iconWin.png');
    width: 73px;
    height: 73px;
}
.iconFightLost {
    background-image: url('../../assets/images/iconLost.png');
    width: 73px;
    height: 73px;
}
.rowView {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    flex: 1;
}
.iconCW {
    width: 30px;
    height: 30px;
    margin-right: 0.1rem;
}
.incomeCW {
    font-size: 1.5rem;
    color: #D858F7;
    font-weight: bold;
    margin-left: 0.2rem;
}
.rowText {
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
