import VueRouter, { RouteConfig } from 'vue-router';

import Plaza from './views/Plaza.vue';
import Blacksmith from './views/Blacksmith.vue';
import Combat from './views/Combat.vue';
import Stake from './views/Stake.vue';
import SelectStakeType from './views/SelectStakeType.vue';
import Raid from './views/Raid.vue';
import Market from './views/Market.vue';
import Leaderboard from './views/Leaderboard.vue';
import Options from './views/Options.vue';
import Shop from './views/Shop.vue';
import Referral from './views/Referral.vue';
import P2PLayout from './views/P2PLayout.vue';
import Lobby from './views/Lobby.vue';
import CombatPVP from './views/CombatPVP.vue';
import Arena from './views/Arena.vue';
import CombatPVPFight from './views/CombatPVPFight.vue';
import RPS from './views/RPS.vue';
import {
  raid as featureFlagRaid,
  stakeOnly as featureFlagStakeOnly,
  market as featureFlagMarket,
} from './feature-flags';

function createRouter() {
  if (featureFlagStakeOnly) {
    return new VueRouter({
      routes: [
        { path: '/', redirect: 'stake' },
        { path: '/stake', name: 'select-stake-type', component: SelectStakeType },
        { path: '/stake/:stakeType', name: 'stake', component: Stake, props: true },
      ]
    });
  }

  let marketRoutes: RouteConfig[] = [];
  if(featureFlagMarket) {
    marketRoutes = [
      { path: '/market', name: 'market', component: Market }
    ];
  }

  const router = new VueRouter({
    mode: 'history',
    routes: [
      { path: '/', name: 'plaza', component: Plaza },
      { path: '/blacksmith', name: 'blacksmith', component: Blacksmith },
      { path: '/combat', name: 'combat', component: Combat },
      { path: '/combat-pvp', name: 'pvp', component: CombatPVP },
      { path: '/combat-pvp-fight', name: 'pvp-fight', component: CombatPVPFight },
      { path: '/arena', name: 'arena', component: Arena },
      { path: '/rps', name: 'rps', component: RPS },
      { path: '/leaderboard', name: 'leaderboard', component: Leaderboard },
      ...marketRoutes,
      // { path: '/stake', name: 'select-stake-type', component: SelectStakeType },
      // { path: '/stake/:stakeType', name: 'stake', component: Stake, props: true },
      { path: '/options', name: 'options', component: Options },
      { path: '/shop', name: 'shop', component: Shop },
      { path: '/referral', name: 'referral', component: Referral},
      { path: '/p2playout', name: 'P2P', component: P2PLayout },
      { path: '/lobby', name: 'lobby', component: Lobby }
    ]
  });

  if(featureFlagRaid) {
    router.addRoute({ path: '/raid/', name: 'raid', component: Raid });
  }


  return router;
}

export default createRouter;
