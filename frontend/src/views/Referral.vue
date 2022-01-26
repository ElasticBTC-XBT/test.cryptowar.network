<template>
  <div class="body main-font container">
    <h1>Referral</h1>
    <p>🤝 Invite your friends to play Cryptowar when your friend mint new Heroes, both of you will share a reward as following:

      <ul style="text-align:left; padding-left: 10px;">
        <li>You get 10% bonus</li>
        <li>Your friend get 7% discount</li>
      </ul>
    </p>
    <b-input-group prepend="Your referral link:" class="mt-3 referal-link">
      <b-form-input
        class="referral-input"
        disabled
        :value="`https://play.cryptowar.network/?r=${defaultAccount}`"
      ></b-form-input>
      <b-input-group-append>
        <b-button  @click="copyReferralLink(defaultAccount)"
          >Copy</b-button
        >
      </b-input-group-append>
    </b-input-group>
  </div>
</template>

<script lang='ts'>
import { mapState } from "vuex";

export default {
  props: {},

  computed: {
    ...mapState(["defaultAccount"]),
  },
  methods: {
    copyReferralLink(defaultAccount: string) {
      const dummy = document.createElement("textarea");
      document.body.appendChild(dummy);
      dummy.value = `https://play.cryptowar.network/?r=${defaultAccount}`;
      if (navigator.userAgent.match(/ipad|ipod|iphone/i)) {
        dummy.contentEditable = 'true';
        dummy.readOnly = true;
        const range = document.createRange();
        range.selectNodeContents(dummy);
        const selection = window.getSelection();
        selection?.removeAllRanges();
        selection?.addRange(range);
      } else {
        dummy.select();
      }
      document.execCommand("copy");
      document.body.removeChild(dummy);
      alert("Referral link copied to clipboard");
    },
  },
};
</script>

<style scoped>
.body {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.referral-input:disabled {
  color: #fff;
}
.form-control:disabled {
  background-color: #ffffff44;
}

@media (max-width: 576px) {
  html {
    overscroll-behavior: auto;
    overflow: hidden;
    height: 100%;
  }

  body {
    overscroll-behavior: auto;
    overflow: auto;
    height: 100%;
  }
  .referal-link {
    flex-direction: column;
    align-items: center;
    justify-content: space-between;
    height: 150px;
  }
  .input-group-text {
    color: #fff;
    font-weight: bold;
  }
  .referral-input {
    flex: unset !important;
    width: 100% !important;
    min-width: none !important;
  }
  .btn {
    border-radius: 16px !important;
  }
}

</style>
