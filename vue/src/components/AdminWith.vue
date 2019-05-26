<template>
<div>
  <div v-show="showAdminWithDisplay===0">
    <div id="spinner" class="spinner-border text-success" role="status">
      <span class="sr-only">Loading...</span>
    </div>

    <!-- modal -->
    <div>
        <app-admin-modal
          title="This is modal">
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

    <table id="table_with" class="table" v-show="showAdminWithDisplay===1">
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
    <div class="row" v-show="showAdminWithDisplay===1">
      <form autocomplete="off">
      <span id="with_account">받을 지갑 주소</span>
      <span id="with_tokenAmout">토큰 종류, 양</span>
      <input id="input_with" type="text" class="form-control" v-model="toAccountAddress" placeholder="계좌 주소를 입력하세요">
      <button id="admin_readAccount_button" type="button" class="btn btn-info" v-on:click="readCurrentAccount ">연동 계좌 불러오기</button>
      <input id="num_amount_with" type="text" class="form-control" v-model="amountNum" placeholder="토큰의 양 입력">
      </form>
      <select id="token_select_wtih" class="form-control" v-model="tokenSelected">
        <option value="Ether">Ether</option>
        <option value="EOS">EOS</option>
        <option value="BNB">BNB</option>
        <option value="VEN">VEN</option>
      </select>
      <button id="button_wtih" type="button" class="btn btn-primary btn-lg" v-on:click="next">출금하기</button>
  </div>

  <table id="table_with2" class="table" v-show="showAdminWithDisplay===2">
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
      <tr v-for="key in param_with">
        <td>
          {{ key.tokenName }}
        </td>
        <td>
          {{key.tokenBalance}}
        </td>
      </tr>
    </tbody>

  </table>

  <img id="with_home_button" src="../assets/home_button.png" v-on:click="home" v-show="showAdminWithDisplay===2">
  <!-- modal -->
  <div>
      <app-admin-modal
        title="This is modal">
        <div id="modal_">
          {{this.$store.state.msg}}
        </div>
      </app-admin-modal>
  </div>
    <!--modal -->
</div>

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

let tokens = [EOS_tokenAddress, BNB_tokenAddress, VEN_tokenAddress];

if (typeof web3 !== 'undefined') {
  // Mist/MetaMask의 프로바이더 사용
  web3 = new Web3(web3.currentProvider);
  // alert('web3가 주입되었습니다.');
} else {
  // 사용자가 Metamask를 설치하지 않은 경우에 대해 처리
  // 사용자들에게 Metamask를 설치하라는 등의 메세지를 보여줄 것
  alert("MetaMask is not installed")
  // web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));
}

let accounts;

let walletAddress;
let adminWalletAddress;

let checkToken = false;
let tokenIndex;

export default {
  data() {
    return {
      param: '',
      toAccountAddress: '',
      amountNum: '',
      tokenSelected: 'Ether'
    }
  },
  components: {
    appAdminModal: adminModal
  },
  created: function() {
    store.commit('adminWithInitialization');
  },

  computed: {
    showAdminWithDisplay: function() {
     return this.$store.state.adminWithShowDisplay;
   },

   param_with:function() {
     return this.$store.state.adminWithInfo;
   },
 },

  methods: {
    readCurrentAccount: function() {
      function checkMetaMaskAccount(callback) {
        return new Promise((resolve, reject) => {
          web3.eth.getAccounts().then(res => {
            if (res) {
              let accounts = res;
              resolve(accounts)
            } else {
              this.message = "오류내용 : 메타마스크의 연동된 계좌 정보를 가져오지 못했습니다. (내부 실행 오류)"
              this.visible = !this.visible

              // alert("오류내용 : 메타마스크의 연동된 계좌 정보를 가져오지 못했습니다 (내부 실행 오류)");
              reject("오류내용 : 메타마스크의 연동된 계좌 정보를 가져오지 못했습니다 (내부 실행 오류)")
            }
          });
        });
      }
      checkMetaMaskAccount.call(this).then((result) => {
        this.toAccountAddress = String(result);
      });
    },

    next: function(event) {

      if (this.toAccountAddress && this.amountNum)
      {
        let checkToAccountAddress = this.toAccountAddress.substring(0, 2);

        if (checkToAccountAddress != "0x") {
          store.commit('changeAdminMsg','올바른 주소 형식을 입력해주세요.');
          store.commit('changeAdminModal');

          // alert("올바른 계좌 주소 형식을 입력해주세요.")
        }
        else if (this.toAccountAddress.length != 42) {
          store.commit('changeAdminMsg','올바른 주소 형식을 입력해주세요.');
          store.commit('changeAdminModal');

          // alert("올바른 계좌 주소 형식을 입력해주세요.")
        }
        else {

          function checkMetaMaskAccount(callback) {
            return new Promise((resolve, reject) => {
              web3.eth.getAccounts().then(res => {
                if(res)
                {
                  accounts = res;
                  resolve()
                }
                else {
                  console.error("오류내용 : 메타마스크의 연동된 계좌 정보를 가져오지 못했습니다 (내부 실행 오류)");

                  store.commit('changeAdminMsg','오류내용 : 메타마스크의 연동된 계좌 정보를 가져오지 못했습니다. (내부 실행 오류)');
                  store.commit('changeAdminModal');
                  // alert("오류내용 : 메타마스크의 연동된 계좌 정보를 가져오지 못했습니다 (내부 실행 오류)");
                  reject()
                }
              });
            });
          }

          checkMetaMaskAccount().then(()=> {

            adminWalletAddress = accounts[0];

            if(this.toAccountAddress != adminWalletAddress)
            {
              console.log("출금 승인 실패 \n입력하신 계좌 주소와 현재 연동되어 있는 메타마스크 계좌 주소가 일치하지 않습니다");
              store.commit('changeAdminMsg','입력하신 계좌 주소와 현재 연동되어 있는 메타마스크 계좌 주소가 일치하지 않습니다.');
              store.commit('changeAdminModal');
              // alert("출금 승인 실패 \n입력하신 계좌 주소와 현재 연동되어 있는 메타마스크 계좌 주소가 일치하지 않습니다");
            }

            else if(adminWalletAddress != Admin_account_address)
            {
              console.log(adminWalletAddress);
              console.log(Admin_account_address);

              console.log('출금 승인 실패 \n현재 연동되어 있는 메타마스크 계좌가 관리자 계좌인지 확인하세요');

              store.commit('changeAdminMsg','현재 연동되어 있는 메타마스크 계좌가 관리자 계좌인지 확인하세요.');
              store.commit('changeAdminModal');
              // alert("출금 승인 실패 \n현재 연동되어 있는 메타마스크 계좌가 관리자 계좌인지 확인하세요");
            }
            else {

          let TokenExchangeContract = new web3.eth.Contract(TokenExchange_ABI, TokenExchange_address)

          let inputNum = web3.utils.toWei(this.amountNum, 'ether');

          if (this.tokenSelected == "Ether") {

            if(this.amountNum > this.param[0].tokenBalance){
            store.commit('changeAdminMsg','선택하신 토큰과 입력하신 양에 대하여 환전소가 충분히 보유하고 있지 않습니다.');
            store.commit('changeAdminModal');

            // alert("선택하신 토큰과 입력하신 양에 대하여\n환전소가 충분히 보유하고 있지 않습니다");
            }
            else {
            store.commit('changeAdminMsg','메타마스크를 통해 출금을 진행하세요.');
            store.commit('changeAdminModal');

            // alert("메타마스크를 통해 출금을 진행하세요");
            store.commit('changeAdminWithDisplay', 0);

            TokenExchangeContract.methods.withdrawEther(inputNum).send({
              from: accounts[0]
            }, (error, result) => {
              if (!error)
              {
                let tokenInterval = setInterval(() => {
                  const receipt = web3.eth.getTransactionReceipt(result)
                            .then(withdrawTokenResult => {
                              if(withdrawTokenResult)
                              {
                                console.log(withdrawTokenResult);
                                if(withdrawTokenResult.status == true)
                                {
                                  // store.commit('changeAdminMsg','출금이 완료되었습니다.');
                                  // store.commit('changeAdminModal');
                                  // alert("출금이 완료되었습니다.")
                                  clearInterval(tokenInterval);

                                  store.commit('adminWithInitialization');

                                  walletAddress = TokenExchange_address;

                                  function getEther(callback) {
                                    return new Promise((resolve, reject) => {
                                      web3.eth.getBalance(walletAddress, (error, balance) => {
                                        if (!error) {
                                          let ether = web3.utils.fromWei(balance, 'ether'); //Push Ether : balance  to array

                                          store.commit('setAdminWithInfo',{
                                          tokenName : "ETHER",
                                          tokenBalance : ether
                                        });
                                          resolve()
                                        } else {
                                          console.error("오류내용 : 계좌의 Ether 잔액을 가져오지 못했습니다 \n- 내부 실행 오류 (web3 문제 또는 잘못된 TokenExchange address 설정)");
                                          store.commit('changeAdminMsg','오류내용 : 계좌의 Ether 잔액을 가져오지 못했습니다 \n- 내부 실행 오류 (web3 문제 또는 잘못된 TokenExchange address 설정)');
                                          store.commit('changeAdminModal');

                                          // alert("오류내용 : 계좌의 Ether 잔액을 가져오지 못했습니다 \n- 내부 실행 오류 (web3 문제 또는 잘못된 TokenExchange address 설정)");
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
                                          let contract = new web3.eth.Contract(ERC20_ABI, token);

                                          contract.methods.balanceOf(walletAddress).call({
                                            from: walletAddress
                                          }, (error, balance) => {
                                            contract.methods.decimals().call({
                                              from: walletAddress
                                            }, (error, decimals) => {
                                              if (!error) {

                                                let calculatedResult = balance / (Math.pow(10, decimals));

                                                contract.methods.name().call({
                                                  from: walletAddress
                                                }, (error, tokenName) => {

                                                  ctn++;

                                                  if (balance.toString() != '0') {
                                                    store.commit('setAdminWithInfo',{
                                                    tokenName : tokenName,
                                                    tokenBalance : calculatedResult
                                                  });
                                                  }
                                                  if (ctn == tokens.length) {
                                                    ctn = 0;
                                                    resolve()
                                                  }
                                                }); //end of name
                                              } else {
                                                console.error("오류내용 : 계좌의 Token 잔액을 가져오지 못했습니다 \n- 내부 실행 오류 (잘못된 Token address 설정)");
                                                store.commit('changeAdminMsg','오류내용 : 계좌의 Token 잔액을 가져오지 못했습니다 \n- 내부 실행 오류 (잘못된 Token address 설정)');
                                                store.commit('changeAdminModal');

                                                // alert("오류내용 : 계좌의 Token 잔액을 가져오지 못했습니다 \n- 내부 실행 오류 (잘못된 Token address 설정)");
                                                console.log(error);
                                              }
                                            }); //end of decimals
                                          }); //end of balanceof
                                        }); //end of tokens

                                      });

                                      getTokenBalance.then(result => {
                                        // this.param = store.state.adminDepoInfo;
                                        setTimeout(function() {
                                          store.commit('changeAdminWithDisplay', 2);
                                        }, 10000);

                                      });

                                    });

                                  // resolve()
                                }
                                else {
                                  console.log("error!!!");
                                }
                              }


                            });

                  }, 5000);
                // this.$router.push('/admin/withdraw/withdrawresult');
              }
              else
              {
                if (error.message.includes("User denied transaction signature")) {
                  store.commit('changeAdminMsg','출금을 거부하였습니다.');
                  store.commit('changeAdminModal');

                  // alert("출금을 거부하였습니다.")
                  store.commit('changeAdminWithDisplay', 1);
                } else {
                  store.commit('changeAdminMsg','Smart Contract 함수 호출 실패 (내부 실행 오류).');
                  store.commit('changeAdminModal');

                  // alert("출금 실패 \nSmart Contract 함수 호출 실패 (내부 실행 오류)");
                  store.commit('changeAdminWithDisplay', 1);
                }
              }
            });
          }
          }

          if (this.tokenSelected == "EOS") {

            for(let k=0; k < this.param.length; k++)
            {
              if(this.param[k].tokenName == "EOS")
              {
                checkToken = true;
                tokenIndex = k;
              }
            }

            if(!checkToken){
            store.commit('changeAdminMsg','선택하신 토큰과 입력하신 양에 대하여 환전소가 충분히 보유하고 있지 않습니다.');
            store.commit('changeAdminModal');
            // alert("선택하신 토큰과 입력하신 양에 대하여\n환전소가 충분히 보유하고 있지 않습니다");
            }
            else if(this.amountNum > this.param[tokenIndex].tokenBalance){
            store.commit('changeAdminMsg','선택하신 토큰과 입력하신 양에 대하여 환전소가 충분히 보유하고 있지 않습니다.');
            store.commit('changeAdminModal');
            // alert("선택하신 토큰과 입력하신 양에 대하여\n환전소가 충분히 보유하고 있지 않습니다");
            }
            else {
            store.commit('changeAdminMsg','메타마스크를 통해 출금을 진행하세요.');
            store.commit('changeAdminModal');

            // alert("메타마스크를 통해 출금을 진행하세요");
            store.commit('changeAdminWithDisplay', 0);

            TokenExchangeContract.methods.withdrawToken(EOS_tokenAddress, inputNum).send({
              from: accounts[0]
            }, (error, result) => {
              if (!error)
              {
                let tokenInterval = setInterval(() => {
                  const receipt = web3.eth.getTransactionReceipt(result)
                            .then(withdrawTokenResult => {
                              if(withdrawTokenResult)
                              {
                                console.log(withdrawTokenResult);
                                if(withdrawTokenResult.status == true)
                                {
                                  // store.commit('changeAdminMsg','출금이 완료되었습니다.');
                                  // store.commit('changeAdminModal');

                                  // alert("출금이 완료되었습니다.")
                                  clearInterval(tokenInterval);

                                  store.commit('adminWithInitialization');

                                  walletAddress = TokenExchange_address;

                                  function getEther(callback) {
                                    return new Promise((resolve, reject) => {
                                      web3.eth.getBalance(walletAddress, (error, balance) => {
                                        if (!error) {
                                          let ether = web3.utils.fromWei(balance, 'ether'); //Push Ether : balance  to array

                                          store.commit('setAdminWithInfo',{
                                          tokenName : "ETHER",
                                          tokenBalance : ether
                                        });
                                          resolve()
                                        } else {
                                          console.error("오류내용 : 계좌의 Ether 잔액을 가져오지 못했습니다 \n- 내부 실행 오류 (web3 문제 또는 잘못된 TokenExchange address 설정)");
                                          store.commit('changeAdminMsg','오류내용 : 계좌의 Ether 잔액을 가져오지 못했습니다 \n- 내부 실행 오류 (web3 문제 또는 잘못된 TokenExchange address 설정)');
                                          store.commit('changeAdminModal');

                                          // alert("오류내용 : 계좌의 Ether 잔액을 가져오지 못했습니다 \n- 내부 실행 오류 (web3 문제 또는 잘못된 TokenExchange address 설정)");
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
                                          let contract = new web3.eth.Contract(ERC20_ABI, token);

                                          contract.methods.balanceOf(walletAddress).call({
                                            from: walletAddress
                                          }, (error, balance) => {
                                            contract.methods.decimals().call({
                                              from: walletAddress
                                            }, (error, decimals) => {
                                              if (!error) {

                                                let calculatedResult = balance / (Math.pow(10, decimals));

                                                contract.methods.name().call({
                                                  from: walletAddress
                                                }, (error, tokenName) => {

                                                  ctn++;

                                                  if (balance.toString() != '0') {
                                                    store.commit('setAdminWithInfo',{
                                                    tokenName : tokenName,
                                                    tokenBalance : calculatedResult
                                                  });
                                                  }
                                                  if (ctn == tokens.length) {
                                                    ctn = 0;
                                                    resolve()
                                                  }
                                                }); //end of name
                                              } else {
                                                console.error("오류내용 : 계좌의 Token 잔액을 가져오지 못했습니다 \n- 내부 실행 오류 (잘못된 Token address 설정)");
                                                store.commit('changeAdminMsg','오류내용 : 계좌의 Token 잔액을 가져오지 못했습니다 \n- 내부 실행 오류 (잘못된 Token address 설정)');
                                                store.commit('changeAdminModal');

                                                // alert("오류내용 : 계좌의 Token 잔액을 가져오지 못했습니다 \n- 내부 실행 오류 (잘못된 Token address 설정)");
                                                console.log(error);
                                              }
                                            }); //end of decimals
                                          }); //end of balanceof
                                        }); //end of tokens

                                      });

                                      getTokenBalance.then(result => {
                                        // this.param = store.state.adminDepoInfo;
                                        setTimeout(function() {
                                          store.commit('changeAdminWithDisplay', 2);
                                        }, 10000);

                                      });

                                    });
                                  // resolve()
                                }
                                else {
                                  console.log("error!!!");
                                }
                              }


                            });

                  }, 5000);
              }
              else {
                if (error.message.includes("User denied transaction signature")) {
                  store.commit('changeAdminMsg','출금을 거부하였습니다.');
                  store.commit('changeAdminModal');

                  // alert("출금을 거부하였습니다.")
                  store.commit('changeAdminWithDisplay', 1);
                } else {
                  store.commit('changeAdminMsg','Smart Contract 함수 호출 실패 (내부 실행 오류)');
                  store.commit('changeAdminModal');

                  // alert("출금 실패 \nSmart Contract 함수 호출 실패 (내부 실행 오류)");
                  store.commit('changeAdminWithDisplay', 1);
                }
              }
            });
          }
          }

          if (this.tokenSelected == "BNB") {

            for(let k=0; k < this.param.length; k++)
            {
              if(this.param[k].tokenName == "BNB")
              {
                checkToken = true;
                tokenIndex = k;
              }
            }

            if(!checkToken){
            store.commit('changeAdminMsg','선택하신 토큰과 입력하신 양에 대하여 환전소가 충분히 보유하고 있지 않습니다');
            store.commit('changeAdminModal');

            // alert("선택하신 토큰과 입력하신 양에 대하여\n환전소가 충분히 보유하고 있지 않습니다");
            }
            else if(this.amountNum > this.param[tokenIndex].tokenBalance){
            store.commit('changeAdminMsg','선택하신 토큰과 입력하신 양에 대하여 환전소가 충분히 보유하고 있지 않습니다');
            store.commit('changeAdminModal');

            // alert("선택하신 토큰과 입력하신 양에 대하여\n환전소가 충분히 보유하고 있지 않습니다");
            }
            else {
            store.commit('changeAdminMsg','메타마스크를 통해 출금을 진행하세요');
            store.commit('changeAdminModal');

            // alert("메타마스크를 통해 출금을 진행하세요");
            store.commit('changeAdminWithDisplay', 0);

            TokenExchangeContract.methods.withdrawToken(BNB_tokenAddress, inputNum).send({
              from: accounts[0]
            }, (error, result) => {
              if (!error)
              {
                let tokenInterval = setInterval(() => {
                  const receipt = web3.eth.getTransactionReceipt(result)
                            .then(withdrawTokenResult => {
                              if(withdrawTokenResult)
                              {
                                console.log(withdrawTokenResult);
                                if(withdrawTokenResult.status == true)
                                {
                                  // store.commit('changeAdminMsg','출금이 완료되었습니다.');
                                  // store.commit('changeAdminModal');
                                  // alert("출금이 완료되었습니다.")
                                  clearInterval(tokenInterval);

                                  store.commit('adminWithInitialization');

                                  walletAddress = TokenExchange_address;

                                  function getEther(callback) {
                                    return new Promise((resolve, reject) => {
                                      web3.eth.getBalance(walletAddress, (error, balance) => {
                                        if (!error) {
                                          let ether = web3.utils.fromWei(balance, 'ether'); //Push Ether : balance  to array

                                          store.commit('setAdminWithInfo',{
                                          tokenName : "ETHER",
                                          tokenBalance : ether
                                        });
                                          resolve()
                                        } else {
                                          console.error("오류내용 : 계좌의 Ether 잔액을 가져오지 못했습니다 \n- 내부 실행 오류 (web3 문제 또는 잘못된 TokenExchange address 설정)");
                                          store.commit('changeAdminMsg','오류내용 : 계좌의 Ether 잔액을 가져오지 못했습니다 \n- 내부 실행 오류 (web3 문제 또는 잘못된 TokenExchange address 설정)');
                                          store.commit('changeAdminModal');

                                          // alert("오류내용 : 계좌의 Ether 잔액을 가져오지 못했습니다 \n- 내부 실행 오류 (web3 문제 또는 잘못된 TokenExchange address 설정)");
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
                                          let contract = new web3.eth.Contract(ERC20_ABI, token);

                                          contract.methods.balanceOf(walletAddress).call({
                                            from: walletAddress
                                          }, (error, balance) => {
                                            contract.methods.decimals().call({
                                              from: walletAddress
                                            }, (error, decimals) => {
                                              if (!error) {

                                                let calculatedResult = balance / (Math.pow(10, decimals));

                                                contract.methods.name().call({
                                                  from: walletAddress
                                                }, (error, tokenName) => {

                                                  ctn++;

                                                  if (balance.toString() != '0') {
                                                    store.commit('setAdminWithInfo',{
                                                    tokenName : tokenName,
                                                    tokenBalance : calculatedResult
                                                  });
                                                  }
                                                  if (ctn == tokens.length) {
                                                    ctn = 0;
                                                    resolve()
                                                  }
                                                }); //end of name
                                              } else {
                                                console.error("오류내용 : 계좌의 Token 잔액을 가져오지 못했습니다 \n- 내부 실행 오류 (잘못된 Token address 설정)");
                                                store.commit('changeAdminMsg','오류내용 : 계좌의 Token 잔액을 가져오지 못했습니다 \n- 내부 실행 오류 (잘못된 Token address 설정)');
                                                store.commit('changeAdminModal');

                                                // alert("오류내용 : 계좌의 Token 잔액을 가져오지 못했습니다 \n- 내부 실행 오류 (잘못된 Token address 설정)");
                                                console.log(error);
                                              }
                                            }); //end of decimals
                                          }); //end of balanceof
                                        }); //end of tokens

                                      });

                                      getTokenBalance.then(result => {
                                        // this.param = store.state.adminDepoInfo;
                                        setTimeout(function() {
                                          store.commit('changeAdminWithDisplay', 2);
                                        }, 10000);

                                      });

                                    });

                                  // resolve()
                                }
                                else {
                                  console.log("error!!!");
                                }
                              }


                            });

                  }, 5000);
              }
              else {
                if (error.message.includes("User denied transaction signature")) {
                  store.commit('changeAdminMsg','출금을 거부하였습니다.');
                  store.commit('changeAdminModal');

                  // alert("출금을 거부하였습니다.")
                  store.commit('changeAdminWithDisplay', 1);
                } else {
                  store.commit('changeAdminMsg','Smart Contract 함수 호출 실패 (내부 실행 오류)');
                  store.commit('changeAdminModal');

                  // alert("출금 실패 \nSmart Contract 함수 호출 실패 (내부 실행 오류)");
                  store.commit('changeAdminWithDisplay', 1);
                }
              }
            });
          }
          }

          if (this.tokenSelected == "VEN") {

            for(let k=0; k < this.param.length; k++)
            {
              if(this.param[k].tokenName == "VEN")
              {
                checkToken = true;
                tokenIndex = k;
              }
            }

            if(!checkToken){
            store.commit('changeAdminMsg','선택하신 토큰과 입력하신 양에 대하여 환전소가 충분히 보유하고 있지 않습니다');
            store.commit('changeAdminModal');

            // alert("선택하신 토큰과 입력하신 양에 대하여\n환전소가 충분히 보유하고 있지 않습니다");
            }
            else if(this.amountNum > this.param[tokenIndex].tokenBalance){
            store.commit('changeAdminMsg','선택하신 토큰과 입력하신 양에 대하여 환전소가 충분히 보유하고 있지 않습니다');
            store.commit('changeAdminModal');

            // alert("선택하신 토큰과 입력하신 양에 대하여\n환전소가 충분히 보유하고 있지 않습니다");
            }
            else {
            store.commit('changeAdminMsg','메타마스크를 통해 출금을 진행하세요.');
            store.commit('changeAdminModal');

            // alert("메타마스크를 통해 출금을 진행하세요");
            store.commit('changeAdminWithDisplay', 0);

            TokenExchangeContract.methods.withdrawToken(VEN_tokenAddress, inputNum).send({
              from: accounts[0]
            }, (error, result) => {
              if (!error)
              {
                let tokenInterval = setInterval(() => {
                  const receipt = web3.eth.getTransactionReceipt(result)
                            .then(withdrawTokenResult => {
                              if(withdrawTokenResult)
                              {
                                console.log(withdrawTokenResult);
                                if(withdrawTokenResult.status == true)
                                {
                                  // store.commit('changeAdminMsg','출금이 완료되었습니다.');
                                  // store.commit('changeAdminModal');

                                  // alert("출금이 완료되었습니다.")
                                  clearInterval(tokenInterval);

                                  store.commit('adminWithInitialization');

                                  walletAddress = TokenExchange_address;

                                  function getEther(callback) {
                                    return new Promise((resolve, reject) => {
                                      web3.eth.getBalance(walletAddress, (error, balance) => {
                                        if (!error) {
                                          let ether = web3.utils.fromWei(balance, 'ether'); //Push Ether : balance  to array

                                          store.commit('setAdminWithInfo',{
                                          tokenName : "ETHER",
                                          tokenBalance : ether
                                        });
                                          resolve()
                                        } else {
                                          console.error("오류내용 : 계좌의 Ether 잔액을 가져오지 못했습니다 \n- 내부 실행 오류 (web3 문제 또는 잘못된 TokenExchange address 설정)");
                                          store.commit('changeAdminMsg','오류내용 : 계좌의 Ether 잔액을 가져오지 못했습니다 \n- 내부 실행 오류 (web3 문제 또는 잘못된 TokenExchange address 설정)');
                                          store.commit('changeAdminModal');

                                          // alert("오류내용 : 계좌의 Ether 잔액을 가져오지 못했습니다 \n- 내부 실행 오류 (web3 문제 또는 잘못된 TokenExchange address 설정)");
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
                                          let contract = new web3.eth.Contract(ERC20_ABI, token);

                                          contract.methods.balanceOf(walletAddress).call({
                                            from: walletAddress
                                          }, (error, balance) => {
                                            contract.methods.decimals().call({
                                              from: walletAddress
                                            }, (error, decimals) => {
                                              if (!error) {

                                                let calculatedResult = balance / (Math.pow(10, decimals));

                                                contract.methods.name().call({
                                                  from: walletAddress
                                                }, (error, tokenName) => {

                                                  ctn++;

                                                  if (balance.toString() != '0') {
                                                    store.commit('setAdminWithInfo',{
                                                    tokenName : tokenName,
                                                    tokenBalance : calculatedResult
                                                  });
                                                  }
                                                  if (ctn == tokens.length) {
                                                    ctn = 0;
                                                    resolve()
                                                  }
                                                }); //end of name
                                              } else {
                                                console.error("오류내용 : 계좌의 Token 잔액을 가져오지 못했습니다 \n- 내부 실행 오류 (잘못된 Token address 설정)");
                                                store.commit('changeAdminMsg','오류내용 : 계좌의 Token 잔액을 가져오지 못했습니다 \n- 내부 실행 오류 (잘못된 Token address 설정)');
                                                store.commit('changeAdminModal');

                                                // alert("오류내용 : 계좌의 Token 잔액을 가져오지 못했습니다 \n- 내부 실행 오류 (잘못된 Token address 설정)");
                                                console.log(error);
                                              }
                                            }); //end of decimals
                                          }); //end of balanceof
                                        }); //end of tokens

                                      });

                                      getTokenBalance.then(result => {
                                        // this.param = store.state.adminDepoInfo;
                                        setTimeout(function() {
                                          store.commit('changeAdminWithDisplay', 2);
                                        }, 10000);

                                      });

                                    });

                                  // resolve()
                                }
                                else {
                                  console.log("error!!!");
                                }
                              }


                            });

                  }, 5000);
              }
              else {
                if (error.message.includes("User denied transaction signature")) {
                  store.commit('changeAdminMsg','출금을 거부하였습니다.');
                  store.commit('changeAdminModal');

                  // alert("출금을 거부하였습니다.")
                  store.commit('changeAdminWithDisplay', 1);
                } else {
                  store.commit('changeAdminMsg','Smart Contract 함수 호출 실패 (내부 실행 오류)');
                  store.commit('changeAdminModal');
                  // alert("출금 실패 \nSmart Contract 함수 호출 실패 (내부 실행 오류)");
                  store.commit('changeAdminWithDisplay', 1);
                }
              }
            });
          }
          }
        }
        });

        }
      }
      else
      {
        store.commit('changeAdminMsg','정보를 모두 입력하세요.');
        store.commit('changeAdminModal');
        // alert("정보를 모두 입력하세요")
      }



    },

    home: function(event) {
      store.commit('adminWithInitialization');
      store.commit('changeAdminWithDisplay',0);
      this.$router.push('/admin/home');
    },

    show: function() {

      walletAddress = TokenExchange_address;

      function getEther(callback) {
        return new Promise((resolve, reject) => {
          web3.eth.getBalance(walletAddress, (error, balance) => {
            if (!error) {
              let ether = web3.utils.fromWei(balance, 'ether'); //Push Ether : balance  to array

              store.commit('setAdminWithInfo',{
              tokenName : "ETHER",
              tokenBalance : ether
            });
              resolve()
            } else {
              console.error("오류내용 : 계좌의 Ether 잔액을 가져오지 못했습니다 \n- 내부 실행 오류 (web3 문제 또는 잘못된 TokenExchange address 설정)");
              store.commit('changeAdminMsg','계좌의 Ether 잔액을 가져오지 못했습니다 \n- 내부 실행 오류 (web3 문제 또는 잘못된 TokenExchange address 설정)');
              store.commit('changeAdminModal');

              // alert("오류내용 : 계좌의 Ether 잔액을 가져오지 못했습니다 \n- 내부 실행 오류 (web3 문제 또는 잘못된 TokenExchange address 설정)");
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
              let contract = new web3.eth.Contract(ERC20_ABI, token);

              contract.methods.balanceOf(walletAddress).call({
                from: Admin_account_address
              }, (error, balance) => {
                contract.methods.decimals().call({
                  from: Admin_account_address
                }, (error, decimals) => {
                  if (!error) {

                    let calculatedResult = balance / (Math.pow(10, decimals));

                    contract.methods.name().call({
                      from: Admin_account_address
                    }, (error, tokenName) => {

                      ctn++;

                      if (balance.toString() != '0') {
                        store.commit('setAdminWithInfo',{
                        tokenName : tokenName,
                        tokenBalance : calculatedResult
                      });
                      }
                      if (ctn == tokens.length) {
                        ctn = 0;
                        resolve()
                      }
                    }); //end of name
                  } else {
                    console.error("오류내용 : 계좌의 Token 잔액을 가져오지 못했습니다 \n- 내부 실행 오류 (잘못된 Token address 설정)");
                    store.commit('changeAdminMsg','오류내용 : 계좌의 Token 잔액을 가져오지 못했습니다 \n- 내부 실행 오류 (잘못된 Token address 설정)');
                    store.commit('changeAdminModal');

                    // alert("오류내용 : 계좌의 Token 잔액을 가져오지 못했습니다 \n- 내부 실행 오류 (잘못된 Token address 설정)");
                    console.log(error);
                  }
                }); //end of decimals
              }); //end of balanceof
            }); //end of tokens

          });

          getTokenBalance.then(result => {
            this.param = store.state.adminWithInfo;
            store.commit('changeAdminWithDisplay', 1);
          });

        });

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

td {
  text-align: center;
}

#admin_home1,
#admin_deposit1,
#admin_withdraw1,
#admin_balance1 {
  font-size: 30px;
  color: green;
}

#table_with {
  width: 40%;
  position: fixed;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
}

#table_with2 {
  width: 40%;
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

#with_account {
  position: absolute;
  top: 65%;
  left: 35%;
  transform: translate(-50%, -50%);
  font-weight: 800;
}

#with_tokenAmout {
  position: absolute;
  top: 75%;
  left: 35%;
  transform: translate(-50%, -50%);
  font-weight: 800;
}

#input_with {
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

#num_amount_with {
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

#token_select_wtih {
  width: 8%;
  height: 4%;
  position: absolute;
  top: 75%;
  left: 46.5%;
  transform: translate(-50%, -50%);
}

#button_wtih {
  width: 8%;
  height: 6%;
  position: absolute;
  top: 85%;
  left: 50%;
  transform: translate(-50%, -50%);
  line-height: 6%;
}

#with_home_button {
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
