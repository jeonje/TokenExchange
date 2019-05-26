<template>
<div>

  <div class="container-fluid">

    <div class="row" style="padding:10px">
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

    <table id="trans_table" class="table" v-show="showDisplay===2">
      <thead>
        <tr>
          <th scope="col">TxHash</th>
          <th scope="col">BlockNumber</th>
          <th scope="col">TimeStamp</th>
          <th scope="col">From</th>
          <th scope="col">To</th>
          <th scope="col">Value</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for="key in transactionInfo">
          <td>
            {{ key.txhash }}
          </td>
          <td>
            {{ key.blockNumber }}
          </td>
          <td>
            {{ key.time }}
          </td>
          <td>
            {{ key.from }}
          </td>
          <td>
            {{ key.to }}
          </td>
          <td>
            {{ key.value }}
          </td>
        </tr>
      </tbody>

    </table>

    <table id="noTransaction_table" class="table" v-show="showDisplay===3">
      <thead>
        <tr>
          <th scope="col">TxHash</th>
          <th scope="col">BlockNumber</th>
          <th scope="col">TimeStamp</th>
          <th scope="col">From</th>
          <th scope="col">To</th>
          <th scope="col">Value</th>
        </tr>
      </thead>
    </table>

    <p id="noTransaction_error" v-show="showDisplay===3">
      트랜잭션이 존재하지 않습니다
    </p>

    <div class="row" v-show="showDisplay===1">
      <p id="trans_msg"> 거래내역 조회 </p>
      <input id="input_trans" type="text" class="form-control" v-model="accountNumber" placeholder="계좌 주소를 입력하세요">
      <button id="trans_readAccount_button" type="button" class="btn btn-info" v-on:click="readCurrentAccount ">연동 계좌 불러오기</button>
      <button id="trans_button" type="button" class="btn btn-success btn-lg" v-on:click="next">조회</button>
      <!-- modal -->
      <div>
        <app-my-modal title="This is modal" :visible.sync="visible">
          <div id="modal_">
            {{message}}
          </div>
        </app-my-modal>
      </div>
      <!--modal -->
    </div>

    <img id="trans_before_button" v-on:click="before" src="../assets/before_button.png" v-show="showDisplay===2">
    <img id="trans_home_button" v-on:click="home" src="../assets/home_button.png" v-show="showDisplay===2">

    <img id="trans_before_button" v-on:click="before" src="../assets/before_button.png" v-show="showDisplay===3">
    <img id="trans_home_button" v-on:click="home" src="../assets/home_button.png" v-show="showDisplay===3">

  </div>

</div>
</template>

<script>
import Web3 from 'web3';
import store from '../store';
import myModal from './mymodal.vue';

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider); //Read web3 current provider
} else {
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545")); //default Http provider
}

let api = require('etherscan-api').init('412GSVQARW8T2HWV4DAPWNDFBZ87YN4Q9E', 'ropsten', '3000'); // set api key value for using ehter scan api

export default {
  name: 'transaction',

  data() {
    return {
      accountNumber: "",
      transactionInfo: "",
      visible: false,
      message: '',
    }
  },
  components: {
    appMyModal: myModal
  },
  computed: {
    showDisplay: function() {
      return this.$store.state.transShowDisplay; //select display
    }
  },

  created: function() {
    this.pageLoad()
  },

  methods: {
    pageLoad: function() {
      store.commit('initialization');
      store.commit('changeTransDisplay', 1);
    },

    home: function(event) {
      this.accountNumber = '';
      store.commit('initialization');
      store.commit('changeTransDisplay', 1);
      this.$router.push('/');
    }, // end of home event function

    before: function(event) {
      this.accountNumber = '';
      store.commit('initialization');
      store.commit('changeTransDisplay', 1);
    },

    readCurrentAccount: function() {
      function checkMetaMaskAccount(callback) {
        return new Promise((resolve, reject) => {
          web3.eth.getAccounts().then(res => { //get the metamask accounts
            if (res) {
              let accounts = res;
              resolve(accounts)
            } else {
              this.message = "오류내용 : 메타마스크의 연동된 계좌 정보를 가져오지 못했습니다 (내부 실행 오류)"
              this.visible = !this.visible
              reject("오류내용 : 메타마스크의 연동된 계좌 정보를 가져오지 못했습니다 (내부 실행 오류)")
            }
          });
        });
      }
      checkMetaMaskAccount.call(this).then((result) => {
        this.accountNumber = String(result);
      }); //Set the current account of the meta mask to accountNumber
    },

    next: function(event) {

      if (!this.accountNumber) {
        this.message = "계좌 주소를 입력하세요."
        this.visible = !this.visible
      } else { //check parameters

        let checkAccountAddress = this.accountNumber.substring(0, 2);

        if (checkAccountAddress != "0x") {
          this.message = "올바른 주소 형식을 입력해주세요."
          this.visible = !this.visible
        } else if (this.accountNumber.length != 42) {
          this.message = "올바른 주소 형식을 입력해주세요."
          this.visible = !this.visible
        } else {

          let txlist = api.account.txlist(this.accountNumber, 1, 'latest', 1, 5, 'desc'); //read the transaction list using ether scan api

          txlist.then(result => {

              for (let index = 0; index < result.result.length; index++) {

                let date = new Date(result.result[index].timeStamp * 1000);  //parsing data
                let year = date.getFullYear();
                let month = date.getMonth() + 1;
                let day = date.getDate();
                let hour = date.getHours();
                let min = date.getMinutes();
                let sec = date.getSeconds();

                let convertedTimeStamp = year + "-" + (month < 10 ? "0" + month : month) + "-" +
                  (day < 10 ? "0" + day : day) + " " +
                  (hour < 10 ? "0" + hour : hour) + ":" +
                  (min < 10 ? "0" + min : min) + ":" +
                  (sec < 10 ? "0" + sec : sec);

                convertedTimeStamp = convertedTimeStamp.toString();

                let convertedValue = parseFloat(result.result[index].value) / 1000000000000000000;
                convertedValue = convertedValue.toString() + " Ether";

                if (result.result[index].contractAddress == "") {

                  store.commit('setBlockInfo', { //commit balck information to vuex
                    txhash: result.result[index].hash,
                    blockNumber: result.result[index].blockNumber,
                    time: convertedTimeStamp,
                    from: result.result[index].from,
                    to: result.result[index].to,
                    value: convertedValue
                  });
                } else {

                  let contractAccount = result.result[index].contractAddress;
                  contractAccount = contractAccount.replace(/"/gi, "");
                  contractAccount = "[Contract Creation] " + contractAccount;

                  store.commit('setBlockInfo', {
                    txhash: result.result[index].hash,
                    blockNumber: result.result[index].blockNumber,
                    time: convertedTimeStamp,
                    from: result.result[index].from,
                    to: contractAccount,
                    value: convertedValue
                  });
                }
              }

              store.commit('changeTransDisplay', 2);
              this.transactionInfo = store.state.transactions;
            })
            .catch((error) => {
              store.commit('changeTransDisplay', 3);
            });
        }
      }
    } // end of next event function
  } // end of methods
} // end of default
</script>

<style>
#home1,
#exchange1,
#send1,
#transaction1,
#balance1 {
  font-size: 30px;
  color: green;
}

#row1 {

  padding: 10px;
  width: 100%;
  resize: both;
  overflow: auto;
  left: 0;
  right: 0;
  position: absolute;
}

.form-control {
  width: 50%;
}

th {
  background-color: #29B6F6;
  color: #FFFFFF;
  text-align: center;
}

td {
  text-align: center;
}

#trans_msg {
  font-size: 30px;
  font-weight: 700;
  position: absolute;
  top: 50%;
  left: 26%;
  transform: translate(-50%, -50%);
}

#input_trans {
  position: absolute;
  width: 30%;
  top: 50%;
  left: 48%;
  transform: translate(-50%, -50%);
}

#trans_readAccount_button {
  font-size: 5;
  width: 10%;
  height: 5%;
  position: absolute;
  top: 50%;
  left: 71%;
  transform: translate(-50%, -50%);
}

#trans_button {
  font-size: 5;
  width: 5%;
  height: 5%;
  position: absolute;
  top: 50%;
  left: 80%;
  transform: translate(-50%, -50%);
}

#trans_before_button {
  position: absolute;
  top: 80%;
  left: 40%;
  transform: translate(-50%, -50%);
  width: 10%;

}

#trans_home_button {
  position: absolute;
  top: 80%;
  left: 60%;
  transform: translate(-50%, -50%);
  width: 10%;
}

#trans_table {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

#noTransaction_table {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

#noTransaction_error {
  font-size: 30px;
  font-weight: 700;
  position: absolute;
  top: 57%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
