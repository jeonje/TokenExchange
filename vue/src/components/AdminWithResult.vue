<template>
<div>
  <div v-show="showAdminWithResultDisplay===0">
    <div id="spinner" class="spinner-border text-success" role="status">
      <span class="sr-only">Loading...</span>
    </div>
  </div>

  <table id="table1" class="table" v-show="showAdminWithResultDisplay===1">
    <thead>
      <tr>
        <th colspan="2" scope="colgroup">
          Token Exchange Contract
        </th>
      </tr>
      <tr>
        <th scope="col">Token Name</th>
        <th scope="col">Token Balance</th>
      </tr>
    </thead>

    <tbody>
      <tr v-for="key in param">
        <td>
          {{ key.tokenName }}
        </td>
        <td>
          {{key.tokenBalance}}
        </td>
      </tr>
    </tbody>

  </table>

  <img id="home_button" src="../assets/home_button.png" v-on:click="home" v-show="showAdminWithResultDisplay===1">
  <!-- modal -->
  <div>
    <app-admin-modal title="This is modal">
      <div id="modal_">
        {{this.$store.state.msg}}
      </div>
    </app-admin-modal>
  </div>
  <!--modal -->
</div>
</template>

<script>
import Web3 from 'web3';
import store from '../store';
import adminModal from './adminmodal.vue';

import {
  Admin_account_address,
  TokenExchange_address,
  TokenExchange_ABI,
  ERC20_ABI,
  EOS_tokenAddress,
  BNB_tokenAddress,
  VEN_tokenAddress,
  Token_ABI
} from './Contract'

let tokens = [EOS_tokenAddress, BNB_tokenAddress, VEN_tokenAddress]; // torken address

if (typeof web3 !== 'undefined') {
  web3 = new Web3(web3.currentProvider); //Read web3 current provider
} else {
  web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545")); //default Http provider
}

let walletAddress;
let accounts;

export default {
  data() {
    return {
      param: ''
    }
  },
  components: {
    appAdminModal: adminModal
  },
  created: function() {
    store.commit('adminWithResultInitialization');
    store.commit('changeAdminMsg', '출금이 완료되었습니다.');
    store.commit('changeAdminModal');

    web3.eth.getAccounts((err, res) => { //read the meta-mask accounts
      accounts = res;
    });
  },

  computed: {
    showAdminWithResultDisplay: function() {
      return this.$store.state.adminWithResultShowDisplay; //select display
    }
  },

  methods: {
    home: function(event) {
      store.commit('adminWithResultInitialization');
      store.commit('changeAdminWithResultDisplay', 0);
      this.$router.push('/admin/home');
    },

    showContract: function() {

      walletAddress = TokenExchange_address;

      function getEther(callback) { //get user's ether
        return new Promise((resolve, reject) => {
          web3.eth.getBalance(walletAddress, (error, balance) => {
            if (!error) {
              let ether = web3.utils.fromWei(balance, 'ether'); //convert wei to ether
              store.commit('setAdminWithResultInfo', { //commit the setAdminWithResultInfomation to vuex
                tokenName: "ETHER",
                tokenBalance: ether
              });
              resolve()
            } else {
              console.error("오류내용 : 계좌의 Ether 잔액을 가져오지 못했습니다 \n - 내부 실행 오류 (web3 문제 또는 잘못된 TokenExchange address 설정)");
              store.commit('changeAdminMsg', '계좌의 Ether 잔액을 가져오지 못했습니다 \n- 내부 실행 오류 (web3 문제 또는 잘못된 TokenExchange address 설정)');
              store.commit('changeAdminModal');
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

              contract.methods.balanceOf(walletAddress).call({ //get Token exchange's balance
                from: Admin_account_address
              }, (error, balance) => {

                contract.methods.decimals().call({ //get Token exchange's decimal
                  from: Admin_account_address
                }, (error, decimals) => {
                  if (!error) {
                    let calculatedResult = balance / (Math.pow(10, decimals)); //Toekn exchange's balance

                    contract.methods.name().call({ //get token name
                      from: Admin_account_address
                    }, (error, tokenName) => {
                      ctn++;

                      if (balance.toString() != '0') {
                        store.commit('setAdminWithResultInfo', { //commit the 'setAdminWithResultInfo' to vuex
                          tokenName: tokenName,
                          tokenBalance: calculatedResult
                        });
                      }
                      if (ctn == tokens.length) { // Check all tokens.
                        ctn = 0;
                        resolve()
                      }
                    }); //end of name
                  } else {
                    console.error("오류내용 : 계좌의 Token 잔액을 가져오지 못했습니다 \n - 내부 실행 오류 (잘못된 Token address 설정)");
                    store.commit('changeAdminMsg', '오류내용 : 계좌의 Token 잔액을 가져오지 못했습니다 \n- 내부 실행 오류 (잘못된 Token address 설정)');
                    store.commit('changeAdminModal');
                    console.log(error);
                  }
                }); //end of decimals
              }); //end of balanceof
            }); //end of tokens
          }); //end of promise

          getTokenBalance.then(result => { //get the admin withdraw information from vuex and commit display parameter
            this.param = store.state.adminWithResultInfo;
            store.commit('changeAdminWithResultDisplay', 1);
          });
        });
    }
  },

  mounted() {
    this.showContract();
  }

}
</script>

<style>
th {
  background-color: #29B6F6;
  color: #FFFFFF;
  text-align: center;
}

td {
  text-align: center;
}

#table1 {
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

#spinner {
  position: fixed;
  top: 50%;
  left: 50%;
}
</style>
