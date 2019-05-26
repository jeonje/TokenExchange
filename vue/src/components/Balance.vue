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

    <div class="row" v-show="showBalDisplay===0">
      <p id="bal_msg"> 잔액 조회 </p>
      <input id="input_bal" type="text" class="form-control" v-model="accountNumber" placeholder="계좌 주소를 입력하세요">
      <button id="bal_readAccount_button" type="button" class="btn btn-info" v-on:click="readCurrentAccount ">연동 계좌 불러오기</button>
      <button id="bal_button" type="button" class="btn btn-success btn-lg" v-on:click="next">조회</button>

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

    <table id="bal_table" class="table" v-show="showBalDisplay===1">
      <thead>
        <tr>
          <th scope="col">Token Name</th>
          <th scope="col">Token Balance</th>
        </tr>
      </thead>

      <tbody>
        <tr v-for=" key in param">
          <td>
            {{key.tokenName}}
          </td>
          <td>
            {{key.tokenBalance}}
          </td>
        </tr>
      </tbody>

    </table>
    <img id="home_button" src="../assets/home_button.png" v-on:click="home" v-show="showBalDisplay===1">
  </div>
</div>
</template>


<script>
import Web3 from 'web3';
import store from '../store';
import myModal from './mymodal.vue';

import {
  TokenExchange_address,
  TokenExchange_ABI,
  ERC20_ABI,
  Token_ABI,
  EOS_tokenAddress,
  BNB_tokenAddress,
  VEN_tokenAddress,

} from './Contract'

let tokens = [EOS_tokenAddress, BNB_tokenAddress, VEN_tokenAddress]; // torken address

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider); //Read web3 current provider
} else {
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545")); //default Http provider
}

let accounts;
web3.eth.getAccounts((err, res) => { //get the metamask accounts
  accounts = res;
});

export default {
  name: 'balance',
  data() {
    return {
      accountNumber: '',
      param: '',
      visible: false,
      message: '',
    }
  },
  components: {
    appMyModal: myModal
  },
  created: function() {
    this.accountNumber = '';
    store.commit('balInitialization');
    store.commit('changeBalDisplay', 0);
  },

  computed: {
    showBalDisplay: function() {
      return this.$store.state.balShowDisplay; //select display
    }
  },

  methods: {
    home: function(event) {
      this.accountNumber = '';
      store.commit('balInitialization');
      store.commit('changeBalDisplay', 0);
      this.$router.push('/');
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

    next: function(event) { // next button method

      let walletAddress = this.accountNumber;
      if (!walletAddress) //check parameters
      {
        this.message = "계좌 주소를 입력하세요."
        this.visible = !this.visible
      } else {
        let checkAccountAddress = walletAddress.substring(0, 2);

        if (checkAccountAddress != "0x") {
          this.message = "올바른 주소 형식을 입력해주세요."
          this.visible = !this.visible
        } else if (walletAddress.length != 42) {
          this.message = "올바른 주소 형식을 입력해주세요."
          this.visible = !this.visible
        } else {

          function getEther(callback) {
            return new Promise((resolve, reject) => {
              web3.eth.getBalance(walletAddress, (error, balance) => {
                if (!error) {
                  let ether = web3.utils.fromWei(balance, 'ether'); //convert wei to ether

                  store.commit('setBalInfo', {
                    tokenName: "ETHER",
                    tokenBalance: ether
                  });
                  resolve()
                } else {
                  console.error("오류내용 : 계좌의 Ether 잔액을 가져오지 못했습니다 \n - 내부 실행 오류 (web3 문제)");

                  alert("오류내용 : 계좌의 Ether 잔액을 가져오지 못했습니다 \n - 내부 실행 오류 (web3 문제)");
                  reject()
                }
              }); //end of getBalance
            }); //end of Promise
          } //end of getEther

          getEther()
            .then(() => { //then search ERC20 tokens

              const getTokenBalance = new Promise((resolve, reject) => {
                let ctn = 0;

                tokens.forEach((token) => {
                  let contract = new web3.eth.Contract(ERC20_ABI, token); // ERC20 token

                  contract.methods.balanceOf(walletAddress).call({ //get Token walletAddress's balance
                    from: accounts[0]
                  }, (error, balance) => {

                    contract.methods.decimals().call({ //get Token walletAddress's decimal
                      from: accounts[0]
                    }, (error, decimals) => {
                      if (!error) {
                        let calculatedResult = balance / (Math.pow(10, decimals)); //Toekn walletAddress's balance

                        contract.methods.name().call({
                          from: accounts[0]
                        }, (error, tokenName) => {
                          ctn++;
                          if (balance.toString() != '0') {

                            store.commit('setBalInfo', {
                              tokenName: tokenName,
                              tokenBalance: calculatedResult
                            });
                          }
                          if (ctn == tokens.length) { //Check all token
                            ctn = 0;
                            resolve()
                          }
                        }); //end of name
                      } else {
                        console.error("오류내용 : 계좌의 잔액을 가져오지 못했습니다 \n - 내부 실행 오류 (잘못된 Token address 설정)");

                        alert("오류내용 : 계좌의 잔액을 가져오지 못했습니다 \n - 내부 실행 오류 (잘못된 Token address 설정)");
                        console.log(error);
                      }
                    }); //end of decimals
                  }); //end of balanceof
                }); //end of foreach
              }); //end of promise

              getTokenBalance.then(result => { //get the balance information frm vuex anda commit display parameter
                this.param = store.state.balInfo;
                store.commit('changeBalDisplay', 1);
              });

            })
        }
      }
    } // end of next
  }
}
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

#bal_msg {
  font-size: 30px;
  font-weight: 700;
  position: absolute;
  top: 50%;
  left: 26%;
  transform: translate(-50%, -50%);
}

#input_bal {
  position: absolute;
  width: 30%;
  top: 50%;
  left: 48%;
  transform: translate(-50%, -50%);
}

#bal_readAccount_button {
  font-size: 5;
  width: 10%;
  height: 5%;
  position: absolute;
  top: 50%;
  left: 71%;
  transform: translate(-50%, -50%);
}

#bal_button {
  font-size: 5;
  width: 5%;
  height: 5%;
  position: absolute;
  top: 50%;
  left: 80%;
  transform: translate(-50%, -50%);
}

#bal_error {
  font-size: 50px;
  font-weight: 700;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

#bal_table {
  width: 40%;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

#home_button {
  position: absolute;
  top: 80%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10%;
}
</style>
