<template>
<div>

  <div class="container-fluid">

    <div class="row" v-show="checkAdmin===0" style="padding:10px">

      <div class="col align-self-center">
        <img src="@/assets/logo.png">
      </div>
      <div class="col align-self-center">
        <b-link id="home1" to="/">Home</b-link>
      </div>
      <div class="col align-self-center">
        <b-link id="exchange1" to="/exchange">환전</b-link>
      </div>
      <div class="col align-self-center">
        <b-link id="send1" to="/send">송금</b-link>
      </div>
      <div class="col align-self-center">
        <b-link id="transaction1" to="/transaction">거래내역 조회</b-link>
      </div>
      <div class="col align-self-center">
        <b-link id="balance1" to="/balance">잔액 조회</b-link>
      </div>
    </div>

    <div class="row" v-show="checkAdmin===1" style="padding:10px">
      <div class="col align-self-center">
        <img src="@/assets/logo.png">
      </div>
      <div class="col align-self-center">
        <b-link id="home1" to="/">Home</b-link>
      </div>
      <div class="col align-self-center">
        <b-link id="exchange1" to="/exchange">환전</b-link>
      </div>
      <div class="col align-self-center">
        <b-link id="send1" to="/send">송금</b-link>
      </div>
      <div class="col align-self-center">
        <b-link id="transaction1" to="/transaction">거래내역 조회</b-link>
      </div>
      <div class="col align-self-center">
        <b-link id="balance1" to="/balance">잔액 조회</b-link>
      </div>
      <div class="col align-self-center">
        <b-link id="admin" to="/admin">관리자</b-link>
      </div>
    </div>

    <div class="row" style="padding:30px; height:800px;">

      <div class="col pull-left mr-2">
        <img id="token" src="../assets/token_image.png" />
      </div>
      <div class="col align-self-center" style="text-align:center">
        <span id="span1">ERC20 토큰을 환전해보세요</span><br />
        <span id="span2">Exchange ERC20 Token</span>
      </div>
    </div>



  </div>
</div>
</template>

<script>
import Web3 from 'web3';
import store from '../store';


import {
  Admin_account_address,
} from './Contract'

if (typeof Web3 !== 'undefined') {

  let web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io/v3/829a14a4e6a5475797232b2333cface6')); // connect ropsten test-net
  console.log('Web3 -> Current Provider');
} else {
  let web3 = new Web3(new Web3.providers.HttpProvider('https://ropsten.infura.io')); // default network is ropsten
}
export default {
  created: function() {
    store.commit('changeCheckAdmin', 0);

    web3.eth.getAccounts().then(res => {
      if (res) {
        let accounts = res;
        if (accounts[0] == Admin_account_address)
          store.commit('changeCheckAdmin', 1);  //Check whether it is a guest or an admin.

      }
    });
  },

  computed: {
    checkAdmin: function() {
      return this.$store.state.checkAdmin;
    }
  },
}
</script>

<style>
.container {
  position: absolute;  
  width: 200%;
}

#modalPopover___BV_modal_header_ {
  width: 100%;
}

#modalPopover___BV_modal_body_ {
  padding: 30px;
  width: 100%;
}

#modalPopover___BV_modal_footer_ {
  padding: 30px;
  width: 100%;
}

.btn.btn-primary {
  padding-top: 5px;
  padding-bottom: 30px;
  width: 20%;
}

#home1,
#exchange1,
#send1,
#transaction1,
#balance1,
#admin {
  font-size: 30px;
  color: green;
}

#span1 {
  font-size: 60px;
  font-weight: 800;
  line-height: 2;
}

#span2 {
  font-size: 50px;
  font-weight: 700;
}
</style>
