import Vue from 'vue';
import Vuex from 'vuex';
import VueRouter from 'vue-router';
import VTooltip from 'v-tooltip';
import BootstrapVue from 'bootstrap-vue';
import { BootstrapVueIcons } from 'bootstrap-vue';
import BootstrapVueDialog from 'bootstrap-vue-dialog';
import VueObserveVisibility from 'vue-observe-visibility';
import WalletConnectProvider from '@walletconnect/web3-provider';

import Web3 from 'web3';

import { createStore } from './store';
import createRouter from './router';

// import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css';

import '@/assets/scss/style.scss';
import '@/assets/scss/p2playout/p2pstyle.css';

import App from './App.vue';


import {
  raid as featureFlagRaid,
  stakeOnly as featureFlagStakeOnly,
  reforging as featureFlagReforging
} from './feature-flags';

let expectedNetworkId: number | null = null;
if(process.env.VUE_APP_EXPECTED_NETWORK_ID) {
  expectedNetworkId = parseInt(process.env.VUE_APP_EXPECTED_NETWORK_ID, 10);
}
const expectedNetworkName = process.env.VUE_APP_EXPECTED_NETWORK_NAME;

const walletConnectProvider = new WalletConnectProvider({
  rpc: {
    97: "https://data-seed-prebsc-1-s1.binance.org:8545/",
    56: "https://bsc-dataseed.binance.org/"
  }
});


const web3 = new Web3(Web3.givenProvider || process.env.VUE_APP_WEB3_FALLBACK_PROVIDER);

Vue.config.productionTip = false;

Vue.use(Vuex);
Vue.use(VueRouter);
Vue.use(VTooltip);
Vue.use(BootstrapVue);
Vue.use(BootstrapVueDialog);
Vue.use(VueObserveVisibility);

Vue.use(BootstrapVueIcons);

const store = createStore(web3);
const router = createRouter();

new Vue({
  render: h => h(App),
  router, store,
  provide: {
    web3,
    walletConnectProvider,
    // maybe feature flags should just reference the feature-flags.ts module directly?
    featureFlagStakeOnly, featureFlagRaid, featureFlagReforging,
    expectedNetworkId, expectedNetworkName
  }
}).$mount('#app');
