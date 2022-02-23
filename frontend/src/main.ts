import Vue from 'vue'
import Vuex from 'vuex'
import VueRouter from 'vue-router'
import VTooltip from 'v-tooltip'
import BootstrapVue from 'bootstrap-vue'
import { BootstrapVueIcons } from 'bootstrap-vue'
import BootstrapVueDialog from 'bootstrap-vue-dialog'
import VueObserveVisibility from 'vue-observe-visibility'

import Web3 from 'web3'

import { createStore } from './store'
import createRouter from './router'

// import 'bootstrap/dist/css/bootstrap.css';
import 'bootstrap-vue/dist/bootstrap-vue.css'

import '@/assets/scss/style.scss'
import '@/assets/scss/p2playout/p2pstyle.css'

import App from './App.vue'

import {
  raid as featureFlagRaid,
  stakeOnly as featureFlagStakeOnly,
  reforging as featureFlagReforging,
} from './feature-flags'

let expectedNetworkId: number | null = null
if (import.meta.env.VITE_EXPECTED_NETWORK_ID) {
  expectedNetworkId = parseInt(import.meta.env.VITE_EXPECTED_NETWORK_ID, 10)
}
const expectedNetworkName = import.meta.env.VITE_EXPECTED_NETWORK_NAME

const web3 = new Web3(
  Web3.givenProvider || import.meta.env.VITE_WEB3_FALLBACK_PROVIDER
)

let networkCurrent = 0
const checkNetwork = async () => {
  try {
    if(web3.currentProvider) {
      const networkId = await web3.eth.net.getId()
      if (networkCurrent !== 0 && networkId !== networkCurrent) {
        location.reload()
      }
      networkCurrent = networkId
    }
  } catch (e) {
    console.error(e)
  }
  setTimeout(checkNetwork, 500)
}

checkNetwork()

Vue.config.productionTip = false
Vue.use(Vuex)
Vue.use(VueRouter)
Vue.use(VTooltip)
Vue.use(BootstrapVue)
Vue.use(BootstrapVueDialog)
Vue.use(VueObserveVisibility)

Vue.use(BootstrapVueIcons)

const store = createStore(web3)
const router = createRouter()

new Vue({
  render: (h) => h(App),
  router,
  store,
  provide: {
    web3,
    // maybe feature flags should just reference the feature-flags.ts module directly?
    featureFlagStakeOnly,
    featureFlagRaid,
    featureFlagReforging,
    expectedNetworkId,
    expectedNetworkName,
  },
}).$mount('#app')
