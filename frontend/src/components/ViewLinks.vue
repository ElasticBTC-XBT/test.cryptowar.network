<template>
  <b-navbar-nav>
    <router-link
      :to="{ name: 'lobby' }"
      exact
      class="nav-link ml-2xl-4"
      v-if="!featureFlagStakeOnly"
    >
      <li @click="hideOption()" class="nav-item nav-top-links lobby">
        <span class="gtag-link-others" tagname="plaza_screen">Lobby</span>
      </li>
    </router-link>

    <li class="nav-line"></li>

    <router-link :to="{ name: 'arena' }" exact class="nav-link mr-xl-1 ml-xl-1 mr-2xl-4 ml-2xl-4"
    v-if="!featureFlagStakeOnly">
      <li @click="hideOption()" class="nav-item nav-top-links nav-icon-box">
        <img src="../assets/v2/arena_icon.svg" alt="" class="nav-icon" />
        <span class="gtag-link-others arena" tagname="plaza_screen">Arena</span>
      </li>
    </router-link>

    <li class="nav-line"></li>

    <div class="nav-link mr-2xl-4 ml-2xl-4 bond">
      <li class="nav-item nav-top-links">
        <a
          href="https://bond.cryptowar.network/"
          target="_blank"
          class="gtag-link-others nav-icon-box"
          tagname="shop_screen"
        >
          <img src="../assets/v2/ido_icon.svg" alt="" class="nav-icon" />
          <span class="gtag-link-others bond" tagname="plaza_screen"
            >xBlade BOND</span
          >
        </a>
      </li>
    </div>

    <li class="nav-line mr-2xl-4"></li>

    <router-link
      :to="{ name: 'referral' }"
      exact
      class="nav-link mr-xl-2 ml-xl-2 mr-2xl-3 ml-2xl-3"
    >
      <li @click="hideOption()" class="nav-item nav-top-links nav-img-item-box">
        <span class="nav-img-item">
          <img
            src="../assets/v2/refer_icon.svg"
            alt="Referral"
            class="nav-img"
          />
        </span>
        <div class="Referral">Referral</div>
        <span class="nav-item-hover">Referral</span>
      </li>
    </router-link>

    <li class="nav-line"></li>

    <router-link :to="{ name: 'inventory' }" exact class="nav-link mr-xl-2 ml-xl-2 mr-2xl-3 ml-2xl-3"   v-if="!featureFlagStakeOnly">
      <li @click="hideOption()" class="nav-item nav-top-links nav-img-item-box" >
        <span class="nav-img-item">
          <img
            src="../assets/v2/inventory.svg"
            alt="Inventory"
            class="nav-img"
          />
        </span>
        <div>Inventory</div>
        <span class="nav-item-hover">Inventory</span>
      </li>
    </router-link>

    <li class="nav-line"></li>

    <router-link
      :to="{ name: 'market' }"
      exact
      class="nav-link mr-xl-2 ml-xl-2 mr-2xl-3 ml-2xl-3"
      v-if="!featureFlagStakeOnly && featureFlagMarket"
    >
      <li @click="hideOption()" class="nav-item nav-top-links nav-img-item-box">
        <span class="nav-img-item">
          <img
            src="../assets/v2/marketplace_icon.svg"
            alt="Market Place"
            class="nav-img"
          />
        </span>
        <div>Marketplace</div>
        <span class="nav-item-hover">Marketplace</span>
      </li>
    </router-link>

    <li class="nav-line"></li>

    <router-link
      :to="{ name: 'shop' }"
      exact
      class="nav-link mr-xl-2 ml-xl-2 mr-2xl-3 ml-2xl-3"
    >
      <li @click="hideOption()" class="nav-item nav-top-links nav-img-item-box">
        <span class="nav-img-item">
          <img src="../assets/v2/shop_icon.svg" alt="Shop" class="nav-img" />
        </span>
        <div>Shop</div>
        <span class="nav-item-hover">Shop</span>
      </li>
    </router-link>

    <li class="nav-line"></li>

    <router-link
      :to="{ name: 'blacksmith' }"
      exact
      class="nav-link ml-xl-2 mr-2xl-3 ml-2xl-3"
    >
      <li @click="hideOption()" class="nav-item nav-top-links nav-img-item-box">
        <span class="nav-img-item">
          <img
            src="../assets/v2/blacksmith_icon.svg"
            alt="Black Smith"
            class="nav-img"
          />
        </span>
        <div>Black Smith</div>
        <span class="nav-item-hover">Black Smith</span>
      </li>
    </router-link>
  </b-navbar-nav>
</template>

<script>
import {
  market as featureFlagMarket,
  portal as featureFlagPortal,
} from '../feature-flags'
import Events from '../events'

export default {
  inject: ['featureFlagStakeOnly', 'featureFlagRaid'],

  computed: {
    featureFlagMarket() {
      return featureFlagMarket
    },
    featureFlagPortal() {
      return featureFlagPortal
    },
  },
  methods: {
    hideOption() {
      Events.$emit('hide-option', false)
    },
  },
}
</script>

<style>
a {
  font-weight: bold;
  color: #ffffff;
}
a:hover {
  color: #f58b5b;
}

.nav-top-links > span {
  color: #ffffff;
  font-size: 1.1em;
  padding: 0px 5px 0px 5px;
  margin-right: 0px;
  margin-top: -4px;
}
.lobby {
  background: url('../assets/v2/lobby.svg') no-repeat center;
  background-size: contain;
  display: flex;
  justify-content: center;
  align-items: center;
  text-transform: uppercase;
  width: 210px;
  height: 65px;
}

.lobby:hover {
  background: url('../assets/v2/lobby_hover.svg') no-repeat center;
  background-size: contain;
}

a.router-link-active .lobby .gtag-link-others {
  color: #fff;
  margin-right: 0px;
  margin-top: -4px;
}
.nav-icon-box {
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-icon-box .nav-icon {
  height: 1.1em;
}
.nav-icon-box .gtag-link-others {
  padding-left: 5px;
  margin-right: 0;
}

.nav-img-item-box {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.nav-img-item {
  display: flex;
  width: 47px;
  height: 47px;
  background-image: linear-gradient(
    to bottom,
    #f56f56,
    #f56f56,
    #f26b65,
    #eb618e,
    #e151d0,
    #dd4bec
  );
  align-items: center;
  border-radius: 14px;
  justify-content: center;
}
.nav-img-item img {
  max-width: 100%;
}

.nav-img-item-box .nav-item-hover {
  position: absolute;
  display: none;
  width: 135px;
  height: 50px;
  background: url('../assets/v2/nav-hover.svg') no-repeat 50% 50%;
  background-size: cover;
  top: 100%;
  justify-content: center;
  align-items: center;
  font-size: 0.8em;
  z-index: 2;
}
.nav-img-item-box:hover .nav-item-hover {
  display: flex;
}
.nav-line {
  width: 2px;
  height: 60px;
  background-image: linear-gradient(to bottom, #000000ff, #a9a9a9, #000000ff);
}

.nav-item.nav-top-links div {
  display: none;
}

.nav-link.disabled {
  cursor: not-allowed;
}

.nav-link.disabled span {
  cursor: not-allowed;
  color: rgb(140, 136, 136) !important;
}

@media (min-width: 1400px) {
  .lobby {
    width: 160px;
    height: 65px;
    font-size: 0.8rem;
    padding-left: 0 !important;
  }

  .nav-link.bond {
    padding-right: 0 !important;
  }
}

@media (min-width: 1677px) {
  .ml-2xl-3 {
    margin-left: 1rem !important;
  }
  .mr-2xl-3 {
    margin-right: 1rem !important;
  }
  .ml-2xl-4 {
    margin-left: 1.5rem !important;
  }
  .mr-2xl-4 {
    margin-right: 1.5rem !important;
  }
  .lobby {
    width: 210px;
    height: 65px;
    font-size: 1.1rem;
  }
}

@media (max-width: 1400px) {
  .view-links .nav-line {
    height: 0;
  }
  .nav-item.nav-top-links.lobby {
    margin-right: 0 !important;
  }

  .nav-item.nav-top-links div {
    width: 120px;
    font-size: 1.4em;
    margin: 10px 20px;
    display: block;
  }
  .nav-img-item-box:hover .nav-item-hover {
    display: none;
  }

  .nav-item.nav-top-links .nav-icon {
    width: 25px;
    height: 25px;
  }

  .nav-item.nav-top-links .arena,
  .nav-item.nav-top-links .bond {
    width: 130px;
    font-size: 1.4em;
    margin: 10px 20px;
  }

  .nav-link.ml-4 {
    margin-left: 1rem !important;
  }

  .nav-img-item-box {
    justify-content: flex-start;
  }

  .nav-icon-box {
    justify-content: flex-start;
  }

  .comming-soon {
    padding-left: 50px;
  }
}
</style>
