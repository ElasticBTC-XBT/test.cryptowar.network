<template>
  <div class="body main-font">
    <div v-if="isMaintenance" id="modal-maintenance">
      <div class="modal-content">
        <div class="modal-content-header">
          <div @click="getMaintenance()" class="close-btn"></div>
        </div>
        <div class="modal-content-body">
          <div class="avartar"></div>
          <div>Server Maintenance</div>
        </div>
        <div class="modal-content-footer">
          <button @click="getMaintenance()">CONFIRM</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isMaintenance: false,
    }
  },
  methods: {
    getMaintenance() {
      this.isMaintenance =
        import.meta.env.VITE_MAINTAINANCE &&
        import.meta.env.VITE_MAINTAINANCE === 'true'
          ? true
          : false
    },
  },
  created() {
    this.isMaintenance =
      import.meta.env.VITE_MAINTAINANCE &&
      import.meta.env.VITE_MAINTAINANCE === 'true'
        ? true
        : false
  },
}
</script>

<style scoped>
#modal-maintenance {
  position: fixed;
  z-index: 1000;
  left: 0;
  top: 0;
  width: 100%;
  height: 100%;
  overflow: auto;
  background-color: rgba(0, 0, 0, 0.4);
}
#modal-maintenance .modal-content {
  margin-top: 150px;
}
#modal-maintenance .modal-content .modal-content-header {
  display: flex;
  justify-content: flex-end;
}
#modal-maintenance .modal-content .modal-content-header .close-btn {
  background: url('../assets/v2/shop-icon-close-box-confirm.svg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  width: 80px;
  height: 80px;
  margin-right: 2%;
  cursor: pointer;
}

#modal-maintenance .modal-content .modal-content-body {
  width: 100%;
}
#modal-maintenance .modal-content .modal-content-body .avartar {
  background: url('../assets/v2/avartar-maintenance.svg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  height: 150px;
  margin: auto;
}
#modal-maintenance .modal-content .modal-content-body div:last-child {
  margin: auto;
  text-align: center;
  color: rgb(244, 138, 90);
  font-size: 40px;
  font-weight: bold;
  margin-top: 3%;
}
#modal-maintenance .modal-content .modal-content-footer {
  display: flex;
  justify-content: center;
  margin: 8% 0;
}
#modal-maintenance .modal-content .modal-content-footer button {
  background: url('../assets/v2/shop_nft_btn.svg');
  background-position: center;
  background-repeat: no-repeat;
  background-size: contain;
  width: 216px;
  height: 50px;
  color: white;
  font-size: 22px;
  font-weight: bold;
  border: none;
  cursor: pointer;
}

@media (max-width: 767.98px) {
  #modal-maintenance .modal-content .modal-content-body .avartar {
    height: 120px !important;
  }
  #modal-maintenance .modal-content .modal-content-body div:last-child {
    font-size: 35px !important;
  }
  #modal-maintenance .modal-content {
    height: 410px !important;
  }
}

@media (max-width: 575.98px) {
}

@media (min-width: 768px) {
}
</style>
