<template>
  <div>
    <div class="wheel-wrapper">
      <div class="wheel" ref="wheel">
        <div
          class="wheel-border-arrow"
          v-for="(reward, index) in rewards"
          :key="index"
        >
          <i class="fas fa-caret-up"></i>
        </div>
        <div class="wheel__inner">
          <div
            class="wheel__sec"
            v-for="(reward, index) in rewards"
            :key="index"
          >
            <div class="wheel_reward">
              <div :class="'reward-img reward-img-' + (index + 1)"></div>
              <span class="reward-name">{{ reward.name }}</span>
              <span class="reward-quantity">{{ reward.quantity }}</span>
            </div>
          </div>
        </div>
      </div>
      <div class="wheel__arrow"></div>
    </div>
    <div class="wheel-footer">
      <big-button
        :disabled="isSpinning"
        class="btn btn-blue-bg spin-btn"
        :mainText="`SPIN TO WIN`"
        @click="spin"
      />
      <div class="wheel__price-wrapper">
        Cost per spin
        <span class="wheel__price">100</span>
        xBlade
      </div>
    </div>

    <b-modal
      class="centered-modal text-center"
      ref="rewardModal"
      ok-only
      ok-title="Close"
      ok-variant="secondary btn-pink-bg"
      @ok="resetWheel"
      title="Congratulation!"
      title-class="text-white"
    >
      <div class="reward-modal-body">
        <span class="reward-text">
          <img src="../assets/v2/congrate-emoji.svg" class="congrate-emoji" />
          You recived
        </span>
        <div class="reward-container">
          <div :class="'reward-img-modal reward-img-' + rewardIndex"></div>
          <div class="reward-info">
            <span class="reward-modal-quantity"
              >{{ rewards[rewardIndex - 1].quantity }}
            </span>
            {{ rewards[rewardIndex - 1].name }}
          </div>
        </div>
      </div>
    </b-modal>

    <b-modal
      class="centered-modal text-center"
      ref="loadingModal"
      hide-footer
      hide-header
      no-close-on-backdrop
      no-close-on-esc
      style="justify-content: center"
    >
      <span class="loading-icon">
        Waiting for your approve
        <i class="fas fa-spinner fa-spin"></i>
      </span>
    </b-modal>
  </div>
</template>

<script>
import BigButton from '../components/BigButton.vue'
import { mapActions } from 'vuex'

export default {
  inject: ['web3'],

  components: {
    BigButton,
  },

  data: () => {
    return {
      isSpinning: false,
      rewards: [
        {
          name: 'Common Box',
          quantity: 1,
        },
        {
          name: 'Stamina',
          quantity: 20,
        },
        {
          name: 'Rare Box',
          quantity: 1,
        },
        {
          name: 'Stamina',
          quantity: 10,
        },
        {
          name: 'Epic Box',
          quantity: 1,
        },
        {
          name: 'Stamina',
          quantity: 5,
        },
        {
          name: 'xGem',
          quantity: 10,
        },
      ],
      rewardIndex: 1,
    }
  },

  methods: {
    ...mapActions(['spinLuckyWheel', 'fetchSkillBalance']),

    async spin() {
      // Check testnet or mainnet
      let networkId = 0
      this.web3.eth.net.getId().then((res) => {
        networkId = res
      })
      this.isSpinning = true
      let rewardPosition = 0
      this.$refs.loadingModal.show()
      const result = await this.spinLuckyWheel()
      this.$refs.loadingModal.hide()
      if (result === null) {
        this.$dialog.notify.error(`Failed to spin, please try again`)
        this.isSpinning = false
      } else {
        this.$dialog.notify.success(
          `Your transaction
            <a
              target="_blank"
              href='https://${
                networkId === '97' ? '' : 'testnet.'
              }bscscan.com/tx/
              ${result.transactionHash}'
              style="color: #f58c6e"
            >
              link
            </a>`
        )
        switch (result.reward) {
          case 0: // Get Epic box (5)
            rewardPosition = this.getRandomBetween(128, 177)
            this.rewardIndex = 5
            break
          case 1: // Get Rare box (3)
            rewardPosition = this.getRandomBetween(231, 281)
            this.rewardIndex = 3
            break
          case 2: {
            // Get Common box (1)
            const angle = this.getRandomBetween(0, 100)
            if (angle % 2 === 0) {
              rewardPosition = this.getRandomBetween(0, 22)
            } else {
              rewardPosition = this.getRandomBetween(337, 360)
            }
            this.rewardIndex = 1
            break
          }
          case 3: // Get 20 stamina (2)
            rewardPosition = this.getRandomBetween(285, 331)
            this.rewardIndex = 2
            break
          case 4: // Get 10 stamina (4)
            rewardPosition = this.getRandomBetween(181, 227)
            this.rewardIndex = 4
            break
          case 5: // Get 5 stamina (6)
            rewardPosition = this.getRandomBetween(79, 124)
            this.rewardIndex = 6
            break
          case 6: // Get 10 xGem (7)
            rewardPosition = this.getRandomBetween(28, 73)
            this.rewardIndex = 7
            break
        }

        this.$refs.wheel.style.transform = `rotate(${rewardPosition + 1800}deg)`

        setTimeout(() => {
          this.$refs.rewardModal.show()
          this.$refs.wheel.style.transition = `unset`
          this.$refs.wheel.style.transform = `rotate(0deg)`
          this.isSpinning = false
          this.fetchSkillBalance()
        }, 10000)
      }
    },

    getRandomBetween(min, max) {
      return Math.floor(Math.random() * (max - min + 1)) + min
    },

    resetWheel() {
      this.$refs.wheel.style.transition = `cubic-bezier(0.19, 1, 0.22, 1) 10s`
    },
  },
}
</script>

<style scope>
.wheel-wrapper {
  width: 670px;
  height: 670px;
  margin: 200px auto 30px;
  position: relative;
  background-image: url('../assets/v2/luckyWheel-wrapper-bg.svg');
  background-repeat: no-repeat;
  background-position: center;
  background-size: contain;
  display: flex;
}

.wheel {
  width: 610px;
  height: 610px;
  border-radius: 50%;
  box-shadow: 0 4px 9px 0 rgba(0, 0, 0, 0.1);
  position: relative;
  background-color: #fff;
  margin: auto;
  transition: cubic-bezier(0.19, 1, 0.22, 1) 10s;
}
.wheel-border-arrow {
  position: absolute;
  color: #fff;
  font-size: 50px;
}
.wheel-border-arrow:nth-child(1) {
  top: -40px;
  right: 50%;
  transform: translateX(50%);
}
.wheel-border-arrow:nth-child(2) {
  transform: rotate(calc(360deg / 7));
  top: 10%;
  right: 58px;
}
.wheel-border-arrow:nth-child(3) {
  transform: rotate(calc(360deg / 7 * 2));
  top: 55%;
  right: -13px;
}
.wheel-border-arrow:nth-child(4) {
  transform: rotate(calc(360deg / 7 * 3));
  bottom: -1.5%;
  right: 25%;
}
.wheel-border-arrow:nth-child(5) {
  transform: rotate(calc(360deg / 7 * 4));
  bottom: -1.5%;
  left: 25%;
}
.wheel-border-arrow:nth-child(6) {
  transform: rotate(calc(360deg / 7 * 5));
  top: 55%;
  left: -13px;
}
.wheel-border-arrow:nth-child(7) {
  transform: rotate(calc(360deg / 7 * 6));
  top: 10%;
  left: 58px;
}
.wheel__inner {
  width: 590px;
  height: 590px;
  border-radius: 50%;
  position: relative;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  overflow: hidden;
}
.wheel__sec {
  position: absolute;
  top: 0;
  left: 154px;
  width: 0;
  height: 0;
  border-style: solid;
  border-width: 294px 140px 0;
  border-color: transparent;
  transform-origin: 50% 100%;
}
.wheel__sec:nth-child(1) {
  border-top-color: #2baafc;
}
.wheel__sec:nth-child(2) {
  border-top-color: #bf52fc;
  transform: rotate(calc(360deg / 7));
}
.wheel__sec:nth-child(3) {
  border-top-color: #e474fd;
  transform: rotate(calc(360deg / 7 * 2));
}
.wheel__sec:nth-child(4) {
  border-top-color: #db288b;
  transform: rotate(calc(360deg / 7 * 3));
}
.wheel__sec:nth-child(5) {
  border-top-color: #ea4f99;
  transform: rotate(calc(360deg / 7 * 4));
}
.wheel__sec:nth-child(6) {
  border-top-color: #f68c6e;
  transform: rotate(calc(360deg / 7 * 5));
}
.wheel__sec:nth-child(7) {
  border-top-color: #00bf56;
  transform: rotate(calc(360deg / 7 * 6));
}

.reward-img-1 {
  background-image: url('../assets/common-box.png');
}
.reward-img-2 {
  background-image: url('../assets/stamina-point.png');
}
.reward-img-3 {
  background-image: url('../assets/rare-box.png');
}
.reward-img-4 {
  background-image: url('../assets/stamina-point.png');
}
.reward-img-5 {
  background-image: url('../assets/epic-box.png');
}
.reward-img-6 {
  background-image: url('../assets/stamina-point.png');
}
.reward-img-7 {
  background-image: url('../assets/xgem-luckywheel.svg');
  background-size: auto !important;
}
.wheel__arrow {
  width: 125px;
  height: 150px;
  background-image: url('../assets/v2/luckyWheel-arrow.svg');
  background-repeat: no-repeat;
  background-position: center;
  position: absolute;
  top: 48.5%;
  left: 49.7%;
  transform: translate(-50%, -50%);
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
}
.wheel_reward {
  position: absolute;
  z-index: 1;
  top: -280px;
  left: -120px;
  right: -120px;
  display: flex;
  flex-direction: column;
  align-items: center;
}
.reward-img-modal,
.reward-img {
  width: 71px;
  height: 71px;
  background-color: #fff;
  background-position: center;
  background-repeat: no-repeat;
  border-radius: 50%;
  background-size: contain;
}
.reward-name {
  font-size: 20px;
}
.reward-quantity {
  color: #ebd744;
  font-size: 40px;
}
.wheel-footer {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.spin-btn {
  width: 300px;
  height: 70px;
  background-size: contain !important;
}
.wheel__price-wrapper {
  font-size: 24px;
}
.wheel__price {
  color: #f2be3e;
}
.reward-modal-body {
  display: flex;
  flex-direction: column;
  align-items: center;
}
.reward-text {
  display: flex;
  align-items: center;
  font-size: 46px;
  text-transform: uppercase;
  color: #f58b5b;
  font-weight: 700;
  margin-top: -20px;
}
.reward-modal-body .reward-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  font-size: 30px;
  margin-top: 30px;
}
.reward-modal-quantity {
  color: #f58b5b;
}
.congrate-emoji {
  margin-right: 15px;
}
.loading-icon {
  font-size: 40px;
  min-width: 305px;
}

@media (max-width: 768px) {
  .wheel__inner {
    width: 290px;
    height: 290px;
  }
  .wheel__sec {
    position: absolute;
    top: 0;
    left: 77px;
    width: 0;
    height: 0;
    border-style: solid;
    border-width: 145px 68px 0;
    border-color: transparent;
    transform-origin: 50% 100%;
  }
  .wheel__arrow {
    top: 48.8%;
    left: 50.3%;
    width: 62px;
    height: 75px;
    background-size: contain;
  }
  .wheel_reward {
    top: -130px;
    left: -60px;
    right: -60px;
  }
  .reward-img {
    width: 40px;
    height: 40px;
  }
  .reward-img-7 {
    background-size: 30px 30px !important;
  }
  .reward-name {
    font-size: 10px;
  }
  .reward-quantity {
    color: #ebd744;
    font-size: 20px;
  }
  .spin-btn {
    width: 200px;
    height: 50px;
  }
  .modal-title {
    font-size: 30px !important;
  }
  .reward-text {
    font-size: 20px;
    margin-top: -80px;
  }
  .congrate-emoji {
    width: 40px;
  }
  .reward-modal-body .reward-container {
    margin-top: 60px;
  }
  .wheel-border-arrow {
    font-size: 40px;
  }
  .wheel-border-arrow:nth-child(1) {
    top: -32px;
  }
  .wheel-border-arrow:nth-child(2) {
    right: 14px;
  }
  .wheel-border-arrow:nth-child(4),
  .wheel-border-arrow:nth-child(5) {
    bottom: -19px;
  }
  .wheel-border-arrow:nth-child(6) {
    left: -9px;
  }
  .wheel-border-arrow:nth-child(7) {
    left: 14px;
  }
}
</style>
