<template>
  <div class="body main-font">
    <h1>Referral</h1>
    <p>🤝 Invite your friends to play Cryptowar when your friend mint new Heroes, both of you will share a reward as following:

      <ul style="text-align:left">
        <li>You get 10% bonus</li>
        <li>Your friend get 7% discount</li>
      </ul>
    </p>
    <b-input-group prepend="Your referral link:" class="mt-3">
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
    copyReferralLink: (defaultAccount: string) => {
      navigator.clipboard.writeText(
        `https://play.cryptowar.network/?r=${defaultAccount}`
      );
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

</style>
