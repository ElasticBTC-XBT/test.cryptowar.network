<template>
    <div class="col-sm-4">
                  <div class="panelInfor">
                    <span id="titleBox">Your Information</span>
                    <div class="container">
                      <span class="titleAmountHeroes">HEROES available</span>
                      <div class="boxText">
                        <span>4</span>
                      </div>
                    </div>
                    <div class="container">
                      <div class="selectButton">
                        <span>SELECT HERO</span>
                      </div>
                      <div class="selectButton">
                        <span>SELECT WEAPON</span>
                      </div>
                    </div>
                    <div class="containerAround">
                      <span>Amount a match</span>
                      <input type="text">
                    </div>
                    <div class="containerAround">
                      <span>Total deposit</span>
                      <input type="text">
                    </div>
                  </div>
    </div>
</template>

<style scoped>
    .selectButton {
        background-image: url("../../assets/images/bg-fight-button.png");
    background-size: 100% 100%;
    /* flex: 1; */
    background-repeat: no-repeat;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 47px;
    margin-left: 2rem;
    margin-bottom: 1.5rem;
    }
    .boxText {
      width: 196px;
      height: 59px;
      border: 1px solid #707070;
      display: flex;
      justify-content: center;
      align-items: center;
      margin-left: 2rem;
    }
    .boxText span {
      font-size: 33px;
      line-height: 39px;
      color:#f3bf2b;

    }
    .container {
      display: flex;
      align-items: center;
      justify-content: center;
      margin-top: 1.5rem;
    }
    .containerAround {
      display: flex;
      flex:1;
      align-items: center;
      justify-content: space-between;
      width: 100%;
      padding-left: 3.7rem;
      padding-right: 3.7rem;
    }
    .containerAround span {
      display: flex;
      flex: 1;
    }
    .containerAround input {
      display: flex;
      flex: 1;
      margin-left: 10px;
    }
    .titleAmountHeroes {
      margin-left: 2rem;
      font-size: 21px;
      line-height: 25px;
    }
</style>