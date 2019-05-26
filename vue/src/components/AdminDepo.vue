<template>
<div>
  <div v-show="showAdminDepoDisplay===0">
    <div id="spinner" class="spinner-border text-success" role="status">
      <span class="sr-only">Loading...</span>
    </div>

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

    <table id="table_depo" class="table" v-show="showAdminDepoDisplay===1">
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

    <div class="row" v-show="showAdminDepoDisplay===1">
      <form autocomplete="off">
        <span id="depo_account">보낼 지갑 주소</span>
        <span id="depo_tokenAmount">토큰 종류, 양</span>
        <input id="input_depo" type="text" class="form-control" v-model="fromAccountAddress" placeholder="계좌 주소를 입력하세요">
        <button id="admin_readAccount_button" type="button" class="btn btn-info" v-on:click="readCurrentAccount ">연동 계좌 불러오기</button>
        <input id="num_amount1" type="text" class="form-control" v-model="amountNum" placeholder="토큰의 양 입력">
      </form>
      <select id="token_select" class="form-control" v-model="tokenSelected">
        <option value="EOS">EOS</option>
        <option value="BNB">BNB</option>
        <option value="VEN">VEN</option>
      </select>
      <button type="button" class="btn btn-success btn-lg" v-on:click="next">입금하기</button>

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

    <table id="table_depo2" class="table" v-show="showAdminDepoDisplay===2">
      <thead>
        <tr>
          <th scope="col">정보</th>
          <th scope="col">값</th>
        </tr>
      </thead>

      <tbody>
        <tr>
          <td>
            보내는 사람 계좌 주소
          </td>
          <td>
            {{param3.from_account}}
          </td>
        </tr>
        <tr>
          <td>
            토큰 종류
          </td>
          <td>
            {{param3.tokenName}}
          </td>
        </tr>
        <tr>
          <td>
            토큰 양
          </td>
          <td>
            {{param3.input_num}}
          </td>
        </tr>


      </tbody>

    </table>

    <table id="table_depo3" class="table" v-show="showAdminDepoDisplay===2">
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

  <img id="depo_arrow_show" src="../assets/arrow_show.png" v-show="showAdminDepoDisplay===2">
  <img id="depo_back_button" src="../assets/before_button.png" v-on:click="back" v-show="showAdminDepoDisplay===2">
  <img id="depo_next_button" src="../assets/next_button.png" v-on:click="next2" v-show="showAdminDepoDisplay===2">

  <table id="table_depo4" class="table" v-show="showAdminDepoDisplay===3">
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

  <img id="depo_home_button" src="../assets/home_button.png" v-on:click="home" v-show="showAdminDepoDisplay===3">
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
let adminWalletAddress;
let adminAccountInfo;
let checkToken = false;
let depoAvailable = false;
let tokenIndex;
let accounts;

export default {

  data() {
    return {
      fromAccountAddress: '', //init
      amountNum: '',
      tokenSelected: "EOS",
    }
  },
  components: {
    appAdminModal: adminModal
  },
  created: function() {
    store.commit('adminDepoInitialization');
    store.commit('adminAccountInfoInitialization');
  },

  computed: {
    showAdminDepoDisplay: function() {
      return this.$store.state.adminDepoShowDisplay; //select display
    },

    param: function() {
      return this.$store.state.adminDepoInfo;
    },

    param3: function() {
      return this.$store.state.depo;
    }
  },

  methods: {
    readCurrentAccount: function() {
      function checkMetaMaskAccount(callback) {
        return new Promise((resolve, reject) => {
          web3.eth.getAccounts().then(res => { //get the accounts
            if (res) {
              let accounts = res;
              resolve(accounts)
            } else {
              this.message = "오류내용 : 메타마스크의 연동된 계좌 정보를 가져오지 못했습니다. (내부 실행 오류)"
              this.visible = !this.visible

              reject("오류내용 : 메타마스크의 연동된 계좌 정보를 가져오지 못했습니다 (내부 실행 오류)")
            }
          });
        });
      }
      checkMetaMaskAccount.call(this).then((result) => {
        this.fromAccountAddress = String(result);
      }); //Set the current account of the meta mask to fromAccountAddress
    },

    next: function(event) {

      if (this.fromAccountAddress && this.amountNum) //check parameters
      {
        let checkFromAccountAddress = this.fromAccountAddress.substring(0, 2);

        if (checkFromAccountAddress != "0x") {
          store.commit('changeAdminMsg', '올바른 주소 형식을 입력해주세요.');
          store.commit('changeAdminModal');
        } else if (this.fromAccountAddress.length != 42) {
          store.commit('changeAdminMsg', '올바른 주소 형식을 입력해주세요.');
          store.commit('changeAdminModal');
        } else {
          function checkMetaMaskAccount(callback) {
            return new Promise((resolve, reject) => {
              web3.eth.getAccounts().then(res => { //get the accounts
                if (res) {
                  accounts = res;
                  resolve()
                } else {
                  console.error("오류내용 : 메타마스크의 연동된 계좌 정보를 가져오지 못했습니다 (내부 실행 오류)");
                  store.commit('changeAdminMsg', '오류내용 : 메타마스크의 연동된 계좌 정보를 가져오지 못했습니다. (내부 실행 오류)');
                  store.commit('changeAdminModal');
                  reject()
                }
              });
            });
          }

          checkMetaMaskAccount().then(() => {

            if ("EOS" == this.tokenSelected) {

              store.commit('pollDepoInfo', { //commit the information about deposit
                from_account: this.fromAccountAddress,
                tokenName: "EOS",
                tokenSelected: this.tokenSelected,
                input_num: this.amountNum
              });

            }

            if ("BNB" == this.tokenSelected) {

              store.commit('pollDepoInfo', {
                from_account: this.fromAccountAddress,
                tokenName: "BNB",
                tokenSelected: this.tokenSelected,
                input_num: this.amountNum
              });

            }

            if ("VEN" == this.tokenSelected) {

              store.commit('pollDepoInfo', {
                from_account: this.fromAccountAddress,
                tokenName: "VEN",
                tokenSelected: this.tokenSelected,
                input_num: this.amountNum
              });

            }

            store.commit('changeAdminDepoDisplay', 0);
            this.checkAdminAccountBal();

            setTimeout(function() {
              store.commit('changeAdminDepoDisplay', 2);
            }, 3000);
          });
        }
      } else {
        store.commit('changeAdminMsg', '정보를 모두 입력하세요.');
        store.commit('changeAdminModal');
      }
    },

    next2: function(event) {

      if (this.fromAccountAddress != accounts[0]) {
        console.log("입금 승인 실패 \n입력하신 계좌 주소와 현재 연동되어 있는 메타마스크 계좌 주소가 일치하지 않습니다");

        store.commit('changeAdminMsg', '입력하신 계좌 주소와 현재 연동되어 있는 메타마스크 계좌 주소가 일치하지 않습니다.');
        store.commit('changeAdminModal');
      } else if (adminWalletAddress != Admin_account_address) {
        console.log(adminWalletAddress);
        console.log(Admin_account_address);
        console.log('입금 승인 실패 \n현재 연동되어 있는 메타마스크 계좌가 관리자 계좌인지 확인하세요');

        store.commit('changeAdminMsg', '현재 연동되어 있는 메타마스크 계좌가 관리자 계좌인지 확인하세요.');
        store.commit('changeAdminModal');

      } else {

        let selectedSendTokenAddress;
        let currentTokenSelected = this.$store.state.depo.tokenName; //get the tokenname from vuex
        let currentInputNum = web3.utils.toWei(this.$store.state.depo.input_num, 'ether'); //get the input num from vuex

        for (let k = 0; k < adminAccountInfo.length; k++) // Identify which token is
        {
          if (adminAccountInfo[k].tokenName == "EOS") {
            checkToken = true;
            tokenIndex = k;
          }

          if (adminAccountInfo[k].tokenName == "BNB") {
            checkToken = true;
            tokenIndex = k;
          }

          if (adminAccountInfo[k].tokenName == "VEN") {
            checkToken = true;
            tokenIndex = k;
          }
          1
        }

        if (currentTokenSelected === "EOS") {
          selectedSendTokenAddress = EOS_tokenAddress;

          if (!checkToken) // Exception handling
          {
            store.commit('changeAdminMsg', '선택하신 토큰과 입력하신 양에 대하여 관리자 계좌가 충분히 보유하고 있지 않습니다.');
            store.commit('changeAdminModal');
          } else if (this.amountNum > adminAccountInfo[tokenIndex].tokenBalance) {
            store.commit('changeAdminMsg', '선택하신 토큰과 입력하신 양에 대하여 관리자 계좌가 충분히 보유하고 있지 않습니다.');
            store.commit('changeAdminModal');
          } else {
            depoAvailable = true;
            store.commit('changeAdminMsg', '메타마스크를 통해 입금을 진행하세요.');
            store.commit('changeAdminModal');
            store.commit('changeAdminDepoDisplay', 0);
          }
        }

        if (currentTokenSelected === "BNB") {
          selectedSendTokenAddress = BNB_tokenAddress;

          if (!checkToken) // Exception handling
          {
            store.commit('changeAdminMsg', '선택하신 토큰과 입력하신 양에 대하여 관리자 계좌가 충분히 보유하고 있지 않습니다.');
            store.commit('changeAdminModal');
          } else if (this.amountNum > adminAccountInfo[tokenIndex].tokenBalance) {
            store.commit('changeAdminMsg', '선택하신 토큰과 입력하신 양에 대하여 관리자 계좌가 충분히 보유하고 있지 않습니다.');
            store.commit('changeAdminModal');
          } else {
            depoAvailable = true;
            store.commit('changeAdminMsg', '메타마스크를 통해 입금을 진행하세요.');
            store.commit('changeAdminModal');
            store.commit('changeAdminDepoDisplay', 0);
          }
        }

        if (currentTokenSelected === "VEN") {
          selectedSendTokenAddress = VEN_tokenAddress;

          if (!checkToken) // Exception handling
          {
            store.commit('changeAdminMsg', '선택하신 토큰과 입력하신 양에 대하여 관리자 계좌가 충분히 보유하고 있지 않습니다.');
            store.commit('changeAdminModal');
          } else if (this.amountNum > adminAccountInfo[tokenIndex].tokenBalance) {
            store.commit('changeAdminMsg', '선택하신 토큰과 입력하신 양에 대하여 관리자 계좌가 충분히 보유하고 있지 않습니다.');
            store.commit('changeAdminModal');
          } else {
            depoAvailable = true;
            store.commit('changeAdminMsg', '메타마스크를 통해 입금을 진행하세요.');
            store.commit('changeAdminModal');
            store.commit('changeAdminDepoDisplay', 0);
          }
        }

        if (depoAvailable == true) {
          let tokenContract = new web3.eth.Contract(Token_ABI, selectedSendTokenAddress);
          let TokenExchangeContract = new web3.eth.Contract(TokenExchange_ABI, TokenExchange_address);

          function setApprove(callback) {
            return new Promise((resolve, reject) => {
              tokenContract.methods.increaseApprove(TokenExchange_address, currentInputNum).send({
                from: accounts[0] // call 'increaseApprove' function for exchanging token
              }, (error, result) => {
                if (!error) {

                  store.commit('changeAdminMsg', '트랜잭션 펜딩이 완료 된 후 메타마스크를 통해 다음을 진행해주세요.');
                  store.commit('changeAdminModal');

                  // Continue to check if the transaction is complete every 5 seconds.
                  let depoIntervalFirst = setInterval(() => {
                    const receipt = web3.eth.getTransactionReceipt(result)
                      .then(depoIncreaseApproveResult => {
                        if (depoIncreaseApproveResult) {
                          console.log(depoIncreaseApproveResult);
                          if (depoIncreaseApproveResult.status == true) {
                            store.commit('changeAdminMsg', '입금 승인이 완료되었습니다. 메타마스크를 통해 다음을 진행해주세요.');
                            store.commit('changeAdminModal');
                            clearInterval(depoIntervalFirst);
                            resolve()
                          } else {
                            console.log("error!!!");
                          }
                        }
                      });
                  }, 5000);
                } else {
                  if (error.message.includes("User denied transaction signature")) {
                    console.log('입금 승인을 거부 하셨습니다');

                    store.commit('changeAdminMsg', '입금 승인을 거부 하셨습니다.');
                    store.commit('changeAdminModal');
                    store.commit('changeAdminDepoDisplay', 2);
                    reject()
                  } else {
                    console.log('입금 승인 실패 \n현재 연동되어 있는 메타마스크 계좌가 관리자 계좌인지 확인하세요');
                    store.commit('changeAdminDepoDisplay', 2);
                    reject()
                  }
                }
              });

            });
          }

          setApprove.call(this)
            .then(() => { //then

              function startDeposit(callback) {
                return new Promise((resolve, reject) => {

                  TokenExchangeContract.methods.deposit(selectedSendTokenAddress, currentInputNum).send({
                    from: accounts[0] // call 'deposit' function for exchanging token
                  }, (error, result) => {
                    if (!error) {

                      // Continue to check if the transaction is complete every 5 seconds.
                      let depoIntervalSecond = setInterval(() => {
                        const receipt = web3.eth.getTransactionReceipt(result)
                          .then(depoDepositResult => {
                            console.log(depoDepositResult);
                            if (depoDepositResult) {
                              console.log(depoDepositResult);
                              if (depoDepositResult.status == true) {
                                clearInterval(depoIntervalSecond);
                                console.log("입금 성공");
                                resolve()
                              } else {
                                console.log("error!!!");
                              }
                            }
                          });
                      }, 5000);
                    } else { // Exception handling
                      if (error.message.includes("User denied transaction signature")) {
                        store.commit('changeAdminMsg', '입금 진행을 거부하셨습니다.');
                        store.commit('changeAdminModal');
                        store.commit('changeAdminDepoDisplay', 2);
                        reject()
                      } else if (error.message.includes("rpc error with payload")) {
                        store.commit('changeAdminMsg', '입금하려고 하는 양만큼 계좌가 보유하고 있지 않습니다.');
                        store.commit('changeAdminModal');
                        store.commit('changeAdminDepoDisplay', 2);
                        reject()
                      } else {
                        store.commit('changeAdminMsg', '현재 연동되어 있는 메타마스크 계좌가 관리자 계좌인지 확인하세요.');
                        store.commit('changeAdminModal');
                        store.commit('changeAdminDepoDisplay', 2);
                        reject()
                      }
                    }
                  });
                }); //end of Promise
              } //end of function

              startDeposit()
                .then(function() {

                  store.commit('adminDepoInitialization');
                  walletAddress = TokenExchange_address;

                  function getEther(callback) { //get user's ether
                    return new Promise((resolve, reject) => {
                      web3.eth.getBalance(walletAddress, (error, balance) => {
                        if (!error) {
                          let ether = web3.utils.fromWei(balance, 'ether'); //convert wei to ether
                          store.commit('setAdminDepoInfo', { //commit the admin deposit information to vuex
                            tokenName: "ETHER",
                            tokenBalance: ether
                          });
                          resolve()
                        } else {
                          console.error("오류내용 : 계좌의 Ether 잔액을 가져오지 못했습니다 \n- 내부 실행 오류 (web3 문제 또는 잘못된 TokenExchange address 설정)");
                          store.commit('changeAdminMsg', '오류내용 : 계좌의 Ether 잔액을 가져오지 못했습니다 \n- 내부 실행 오류 (web3 문제 또는 잘못된 TokenExchange address 설정)');
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

                        tokens.forEach(function(token) {
                          let contract = new web3.eth.Contract(ERC20_ABI, token); // ERC20 token

                          contract.methods.balanceOf(walletAddress).call({ //get Token exchange's balance
                            from: walletAddress
                          }, (error, balance) => {
                            contract.methods.decimals().call({ //get Token exchange's decimal
                              from: walletAddress
                            }, (error, decimals) => {
                              if (!error) {
                                let calculatedResult = balance / (Math.pow(10, decimals)); //Toekn exchange's balance

                                contract.methods.name().call({ //get token name
                                  from: walletAddress
                                }, (error, tokenName) => {
                                  ctn++;

                                  if (balance.toString() != '0') {
                                    store.commit('setAdminDepoInfo', { //commit the admin deposit ERC20 token informaiton to vuex
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
                                console.error("오류내용 : 계좌의 Token 잔액을 가져오지 못했습니다 \n- 내부 실행 오류 (잘못된 Token address 설정)");
                                store.commit('changeAdminMsg', '오류내용 : 계좌의 Token 잔액을 가져오지 못했습니다 \n- 내부 실행 오류 (잘못된 Token address 설정)');
                                store.commit('changeAdminModal');
                                console.log(error);
                              }
                            }); //end of decimals
                          }); //end of balanceof
                        }); //end of tokens
                      }); //end of promise

                      getTokenBalance.then(result => {
                        setTimeout(function() {
                          store.commit('changeAdminDepoDisplay', 3); //select display
                        }, 10000);

                      });

                    });
                })
            })
        }
      }

    },

    show: function() {

      walletAddress = TokenExchange_address;

      function getEther(callback) { //get user's ether
        return new Promise((resolve, reject) => {
          web3.eth.getBalance(walletAddress, (error, balance) => {
            if (!error) {
              let ether = web3.utils.fromWei(balance, 'ether'); //convert wei to ether
              store.commit('setAdminDepoInfo', {
                tokenName: "ETHER",
                tokenBalance: ether
              });
              resolve()
            } else {
              console.error("오류내용 : 계좌의 Ether 잔액을 가져오지 못했습니다 \n- 내부 실행 오류 (web3 문제 또는 잘못된 TokenExchange address 설정)");
              store.commit('changeAdminMsg', '오류내용 : 계좌의 Ether 잔액을 가져오지 못했습니다 \n- 내부 실행 오류 (web3 문제 또는 잘못된 TokenExchange address 설정)');
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

            tokens.forEach(function(token) {
              let contract = new web3.eth.Contract(ERC20_ABI, token); // ERC20 token

              contract.methods.balanceOf(walletAddress).call({ //get Token exchange's balance
                from: walletAddress
              }, (error, balance) => {
                contract.methods.decimals().call({ //get Token exchange's decimal
                  from: walletAddress
                }, (error, decimals) => {
                  if (!error) {

                    let calculatedResult = balance / (Math.pow(10, decimals)); //Toekn exchange's balance

                    contract.methods.name().call({ //get token name
                      from: walletAddress
                    }, (error, tokenName) => {
                      ctn++;
                      if (balance.toString() != '0') {
                        store.commit('setAdminDepoInfo', {
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
                    console.error("오류내용 : 계좌의 Token 잔액을 가져오지 못했습니다 \n- 내부 실행 오류 (잘못된 Token address 설정)");
                    store.commit('changeAdminMsg', '오류내용 : 계좌의 Token 잔액을 가져오지 못했습니다 \n- 내부 실행 오류 (잘못된 Token address 설정)');
                    store.commit('changeAdminModal');
                    console.log(error);
                  }
                }); //end of decimals
              }); //end of balanceof
            }); //end of tokens
          }); //end of promise

          getTokenBalance.then(result => { // commit display parameter
            store.commit('changeAdminDepoDisplay', 1);
          });

        });

    },

    checkAdminAccountBal: function() {

      adminWalletAddress = this.fromAccountAddress;

      function getEther(callback) {
        return new Promise((resolve, reject) => {
          web3.eth.getBalance(adminWalletAddress, (error, balance) => {
            if (!error) {
              let ether = web3.utils.fromWei(balance, 'ether'); //convert wei to ether
              store.commit('setAdminAccountInfo', {
                tokenName: "ETHER",
                tokenBalance: ether
              });
              resolve()
            } else {
              console.error("오류내용 : 계좌의 Ether 잔액을 가져오지 못했습니다 \n- 내부 실행 오류 (web3 문제 또는 잘못된 TokenExchange address 설정)");
              store.commit('changeAdminMsg', '오류내용 : 계좌의 Ether 잔액을 가져오지 못했습니다 \n- 내부 실행 오류 (web3 문제 또는 잘못된 TokenExchange address 설정)');
              store.commit('changeAdminModal');
              reject()
            }
          }); //end of getBalance
        }); //end of Promise
      } //end of getEther

      getEther()
        .then(() => { //then search ERC20 tokens

          const getAdminTokenBalance = new Promise((resolve, reject) => {
            let ctn = 0;

            tokens.forEach(function(token) {
              let contract = new web3.eth.Contract(ERC20_ABI, token); // ERC20 token

              contract.methods.balanceOf(adminWalletAddress).call({ //get Token exchange's balance
                from: adminWalletAddress
              }, (error, balance) => {

                contract.methods.decimals().call({ //get Token exchange's decimal
                  from: adminWalletAddress
                }, (error, decimals) => {
                  if (!error) {
                    let calculatedResult = balance / (Math.pow(10, decimals)); //Toekn exchange's balance

                    contract.methods.name().call({ //get token name
                      from: adminWalletAddress
                    }, (error, tokenName) => {
                      ctn++;

                      if (balance.toString() != '0') {
                        store.commit('setAdminAccountInfo', {
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
                    console.error("오류내용 : 계좌의 Token 잔액을 가져오지 못했습니다 \n- 내부 실행 오류 (잘못된 Token address 설정)");
                    store.commit('changeAdminMsg', '오류내용 : 계좌의 Token 잔액을 가져오지 못했습니다 \n- 내부 실행 오류 (잘못된 Token address 설정)');
                    store.commit('changeAdminModal');
                    console.log(error);
                  }
                }); //end of decimals
              }); //end of balanceof
            }); //end of tokens
          }); //end of promise

          getAdminTokenBalance.then(result => {
            adminAccountInfo = store.state.adminAccountInfo;
            console.log("end");
          });

        });

    },

    back: function(event) {
      this.amountNum = '';
      this.fromAccountAddress = '';
      checkToken = false;
      store.commit('changeAdminDepoDisplay', 1);
      store.commit('adminDepoInitialization');
      store.commit('adminAccountInfoInitialization');

    },

    home: function(event) {
      store.commit('adminAccountInfoInitialization');
      store.commit('adminDepoInitialization');
      this.$router.push('/admin/home');
    }

  },

  mounted() {
    this.show();
  }
}
</script>

<style>
th {
  background-color: #29B6F6;
  color: #FFFFFF;
  text-align: center;
}

td,
tr {
  text-align: center;
}

#table_depo {
  width: 40%;
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
}

#depo_account {
  position: absolute;
  top: 65%;
  left: 35%;
  transform: translate(-50%, -50%);
  font-weight: 800;
}

#depo_tokenAmount {
  position: absolute;
  top: 75%;
  left: 35%;
  transform: translate(-50%, -50%);
  font-weight: 800;
}

#input_depo {
  position: absolute;
  top: 65%;
  left: 55%;
  transform: translate(-50%, -50%);
  width: 25%;
}

#admin_readAccount_button {
  font-size: 5;
  width: 10%;
  height: 4.5%;
  position: absolute;
  top: 65%;
  left: 75%;
  transform: translate(-50%, -50%);
}

#num_amount1 {
  width: 15%;
  position: absolute;
  top: 75%;
  left: 60%;
  transform: translate(-50%, -50%);
}

#token_amount {
  float: left;
  margin-left: -900px;
  margin-top: 300px;
  width: 170px;
  height: 40px;
  font-size: 20px;
  font-family: sans-serif;
}

#token_select {
  width: 8%;
  height: 4%;
  position: absolute;
  top: 75%;
  left: 46.5%;
  transform: translate(-50%, -50%);
}

#table_depo2 {
  width: 40%;
  position: fixed;
  top: 50%;
  left: 25%;
  transform: translate(-50%, -50%);
}

#table_depo3 {
  width: 40%;
  position: fixed;
  top: 50%;
  left: 75%;
  transform: translate(-50%, -50%);
}

#table_depo4 {
  width: 40%;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

#depo_home_button {
  position: absolute;
  top: 80%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10%;
}

#admin_home1,
#admin_deposit1,
#admin_withdraw1,
#admin_balance1 {
  font-size: 30px;
  color: green;
}

button {
  width: 8%;
  /* height: 6%; */
  position: absolute;
  top: 85%;
  left: 50%;
  transform: translate(-50%, -50%);
}

#depo_arrow_show {
  position: absolute;
  top: 49%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 6%;
}

#depo_back_button {
  position: absolute;
  top: 80%;
  left: 40%;
  transform: translate(-50%, -50%);
  width: 10%;
}

#depo_next_button {
  position: absolute;
  top: 80%;
  left: 60%;
  transform: translate(-50%, -50%);
  width: 10%;
}

#spinner {
  position: fixed;
  top: 50%;
  left: 50%;
}
</style>
