<template>
<div>

  <div class="container-fluid">

    <div class="row" style="padding:10px">
      <div class="col align-self-center">
        <img src="@/assets/logo.png">
      </div>
      <div class="col align-self-center">
        <b-link id="admin_home1" to="/admin/home">Home</b-link>
      </div>
      <div class="col align-self-center">
        <b-link id="admin_deposit1" to="/admin/deposit">입금</b-link>
      </div>
      <div class="col align-self-center">
        <b-link id="admin_withdraw1" to="/admin/withdraw">출금</b-link>
      </div>
      <div class="col align-self-center">
        <b-link id="admin_balance1" to="/admin/balance">잔액 조회</b-link>
      </div>
    </div>

    <button id="check_btn" type="button" class="btn btn-info btn-lg" v-on:click="show" v-show="showAdminBalDisplay===0">잔액 조회</button>

    <table id="table1" class="table" v-show="showAdminBalDisplay===1">
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

  </div>

</div>
</template>

<script>
import Web3 from 'web3';
import store from '../store';

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

export default {
  data() {
    return {
      param: ''
    }
  },

  created: function() {
    store.commit('adminBalInitialization');
    store.commit('changeAdminBalDisplay', 0);
  },
  computed: {
    showAdminBalDisplay: function() {
      return this.$store.state.adminBalShowDisplay;   //select display
    }
  },

  methods: {
    show: function() {
      walletAddress = TokenExchange_address;
      function getEther(callback) {       //get user's ether
        return new Promise((resolve, reject) => {
          web3.eth.getBalance(walletAddress, (error, balance) => {
            if (!error) {
              let ether = web3.utils.fromWei(balance, 'ether'); //convert wei to ether
              store.commit('setAdminBalInfo', { //commit admin ether balance to vuex
                tokenName: "ETHER",
                tokenBalance: ether
              });
              resolve()
            } else {
              console.error("오류내용 : 계좌의 Ether 잔액을 가져오지 못했습니다 \n - 내부 실행 오류 (web3 문제 또는 잘못된 TokenExchange address 설정)");
              alert("오류내용 : 계좌의 Ether 잔액을 가져오지 못했습니다 \n - 내부 실행 오류 (web3 문제 또는 잘못된 TokenExchange address 설정)");
              reject()
            }
          }); //end of getBalance
        }); //end of Promise
      } //end of getEther

      getEther()
        .then(() => {    //then search ERC20 tokens

          const getTokenBalance = new Promise((resolve, reject) => {
            let ctn = 0;

            tokens.forEach((token) => {
              let contract = new web3.eth.Contract(ERC20_ABI, token);   // ERC20 token

              contract.methods.balanceOf(walletAddress).call({  //get Token exchange's balance
                from: Admin_account_address
              }, (error, balance) => {

                contract.methods.decimals().call({    //get Token exchange's decimal
                  from: Admin_account_address
                }, (error, decimals) => {
                  if (!error) {
                    let calculatedResult = balance / (Math.pow(10, decimals));  //Toekn exchange's balance

                    contract.methods.name().call({  //get token name
                      from: Admin_account_address
                    }, (error, tokenName) => {
                      ctn++;

                      if (balance.toString() != '0') {
                        store.commit('setAdminBalInfo', { //commit the admin ERC20 tokens balance to vuex
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
                    alert("오류내용 : 계좌의 Token 잔액을 가져오지 못했습니다 \n - 내부 실행 오류 (잘못된 Token address 설정)");
                    console.log(error);

                  }
                }); //end of decimals
              }); //end of balanceof
            }); //end of tokens
          }); //end of promise

          getTokenBalance.then(result => {  //get the admin balance information from vuex and commit display parameter
            this.param = store.state.adminBalInfo;
            store.commit('changeAdminBalDisplay', 1);
          });

        });
    }

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

#admin_home1,
#admin_deposit1,
#admin_withdraw1,
#admin_balance1 {
  font-size: 30px;
  color: green;
}

#check_btn {
  width: 10%;
  height: 5%;
  position: absolute;
  top: 20%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
