
<template>
<div>

  <div v-show="showDisplay===0">

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

      <div class="row">
        <template>
          <div id="showProgress">
            <div class="container">
              <ul class="progressbar">
                <li class="active">환전 신청</li>
                <li>입금 대기</li>
                <li>입금 완료</li>
                <li>송금 진행</li>
                <li>환전 완료</li>
              </ul>
            </div>
          </div>
        </template>
      </div>

      <table id="showRate" class="table table-bordered">
        <thead>
          <tr>
            <th scope="col">토큰 이름</th>
            <th scope="col">환율</th>

          </tr>
        </thead>

        <tbody>

          <tr v-for="(value,key) in calculatedShowRate">
            <td>
              {{key}}
            </td>
            <td v-if="isNaN(value) === true">
              환율을 읽고 있습니다.
            </td>
            <td v-else>
              {{value}}
            </td>
          </tr>

        </tbody>

      </table>

      <div id="input_row" class="row">
        <form autocomplete="off">
          <span id="send_account_ex">환전 지갑 주소</span>
          <span id="send_token_ex">환전 전 토큰</span>
          <input id="input_exchange_ex" type="text" class="form-control" v-model="sendAccountAddress" placeholder="계좌 주소를 입력하세요">
          <input id="sendAmount_ex" type="text" class="form-control" v-model="sendAmount" placeholder="토큰의 양 입력">
        </form>
        <select id="send_token_select_ex" class="form-control" v-model="sendSelected">
          <option value="EOS">EOS</option>
          <option value="BNB">BNB</option>
          <option value="VEN">VEN</option>
        </select>

        <span id="receive_token_ex">환전 후 토큰</span>
        <input id="receiveAmount_ex" type="text" class="form-control" :value="calculatedRate">
        <select id="receive_token_select_ex" class="form-control" v-model="receiveSelected">
          <option value="EOS">EOS</option>
          <option value="BNB">BNB</option>
          <option value="VEN">VEN</option>
        </select>
      </div>
    </div>

    <button type="button" id="ex_readAccount_btn" class="btn btn-info" v-on:click="readCurrentAccount ">연동 계좌 불러오기</button>
    <img id="exchange_before_button" v-on:click="before" src="../assets/before_button.png">
    <img id="exchange_next_button" v-on:click="confirm" src="../assets/next_button.png">

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
  <!-- showDisplay 0   환전 신청  -->

  <div v-show="showDisplay===1">
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

    <div id="showProgress">
      <div class="container">
        <ul class="progressbar">
          <li class="active">환전 신청</li>
          <li class="active">입금 대기</li>
          <li>입금 완료</li>
          <li>송금 진행</li>
          <li>환전 완료</li>
        </ul>
      </div>
    </div>
    <table class="table table-bordered">
      <thead>
        <th scope="col"> 정보</th>
        <th scope="col">값</th>
      </thead>
      <tbody>
        <tr>
          <td> 환전 지갑 주소 </td>
          <td> {{exchangeInfoParam.sendAccountAddress}} </td>
        </tr>
        <tr>
          <td> 보내는 토큰 </td>
          <td> {{exchangeInfoParam.sendAmount}} {{exchangeInfoParam.sendSelected}} </td>
        </tr>
        <tr>
          <td> 환전 받는 토큰<br>( 추정치 )</td>
          <td align=center valign=middle>
            {{exchangeInfoParam.receiveAmount }} {{exchangeInfoParam.receiveSelected}} <br>
            <span id="estimatedMessage">* 환전 받는 토큰의 양은 스마트컨트랙트 내
              환전 비율에 따라 달라질 수 있습니다.</span>
          </td>
        </tr>
        <tr>
          <td> 수수료 </td>
          <td> {{exchangeInfoParam.fee}} {{exchangeInfoParam.receiveSelected}} </td>
        </tr>
        <tr>
          <td> 환율 </td>
          <td> 1 {{exchangeInfoParam.sendSelected}} : {{exchangeInfoParam.rateIndex/10**8}} {{exchangeInfoParam.receiveSelected}} </td>
        </tr>
      </tbody>
    </table>

    <img id="exchange_before_button" v-on:click="before" src="../assets/before_button.png">
    <img id="exchange_next_button" v-on:click="exchange" src="../assets/next_button.png">

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
  <!-- showDisplay 1  -->

  <div v-show="showDisplay===2">
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

    <div>
      <div id="showProgress">
        <div class="container">
          <ul class="progressbar">
            <li class="active">환전 신청</li>
            <li class="active">입금 대기</li>
            <li>입금 완료</li>
            <li>송금 진행</li>
            <li>환전 완료</li>
          </ul>
        </div>
      </div>
      <div id="spinner" class="spinner-border text-success" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>

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
  <!-- showDisplay 2  입금 대기-->

  <div v-show="showDisplay===3">
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

    <div>
      <div id="showProgress">
        <div class="container">
          <ul class="progressbar">
            <li class="active">환전 신청</li>
            <li class="active">입금 대기</li>
            <li class="active">입금 완료</li>
            <li>송금 진행</li>
            <li>환전 완료</li>
          </ul>
        </div>
      </div>
      <div id="spinner" class="spinner-border text-success" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>


  </div>
  <!-- showDisplay 3  입금완료 -->

  <div v-show="showDisplay===4">
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

    <div>
      <div id="showProgress">
        <div class="container">
          <ul class="progressbar">
            <li class="active">환전 신청</li>
            <li class="active">입금 대기</li>
            <li class="active">입금 완료</li>
            <li class="active">송금 진행</li>
            <li>환전 완료</li>
          </ul>
        </div>
      </div>
      <div id="spinner" class="spinner-border text-success" role="status">
        <span class="sr-only">Loading...</span>
      </div>
    </div>
  </div>


  <div v-show="showDisplay===7">
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

    <div>
      <table id="ex_table1" class="table">
        <thead>
          <tr>
            <th scope="col">정보</th>
            <th scope="col">값</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>
              환전 지갑 주소
            </td>
            <td>
              {{exchangeInfoParam.sendAccountAddress}}
            </td>
          </tr>
          <tr>
            <td>
              보낸 토큰 종류
            </td>
            <td>
              {{exchangeInfoParam.sendSelected}}
            </td>
          </tr>
          <tr>
            <td>
              보낸 토큰 양
            </td>
            <td>
              {{exchangeInfoParam.sendAmount}}
            </td>

          </tr>
          <tr>
            <td>
              수수료
            </td>
            <td>
              {{exchangeInfoParam.fee}} {{exchangeInfoParam.receiveSelected}}
            </td>
          </tr>
        </tbody>

      </table>

      <table id="ex_table2" class="table">
        <thead>
          <tr>
            <th scope="col">정보</th>
            <th scope="col">값</th>
          </tr>
        </thead>

        <tbody>
          <tr>
            <td>
              받는 계좌 주소
            </td>
            <td>
              {{exchangeInfoParam.sendAccountAddress}}
            </td>
          </tr>
          <tr>
            <td>
              받은 토큰 종류
            </td>
            <td>
              {{exchangeInfoParam.receiveSelected}}
            </td>
          </tr>
          <tr>
            <td>
              받은 토큰 양
            </td>
            <td>
              {{exchangeInfoParam.receiveAmount}}
            </td>
          </tr>
        </tbody>

      </table>
      <img id="arrow_show" src="../assets/arrow_show.png">
      <img id="home_button" v-on:click="home" src="../assets/home_button.png">

    </div>

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
  <!-- showDisplay 7  환전 결과 화면 -->


</div>
</template>

<script>
import Web3 from 'web3';
import store from '../store';
import myModal from './mymodal.vue';

import {
  TokenExchange_address,
  TokenExchange_ABI,
  EOS_tokenAddress,
  BNB_tokenAddress,
  VEN_tokenAddress,
  ERC20_ABI,
  Token_ABI,
} from './Contract'

let tokens = [EOS_tokenAddress, VEN_tokenAddress, BNB_tokenAddress]; // torken address
let checkToken = false;
let exchangeAvailable = false;
let selTokenIndex;
let userAccountInfo;
let userWalletAddress;

let show_decimal = 10 ** 8;
let fee_rate = 0.003; //fee

export default {
  name: 'Exchange',
  beforeCreate() {
    console.log('registerWeb3 Action dispatched from exchange component');
    this.$store.dispatch('registerWeb3');
  },
  data() {
    return {
      sendSelected: "",
      receiveSelected: "",
      sendAmount: "",
      receiveAmount: "",
      sendAccountAddress: "",
      tokenRate: "",
      tokenIndex: "",
      subFee: "",
      showDisplay: 0,
      showTokenRate: {},
      approvePending: true,
      exchangePending: true,
      visible: false,
      message: '',
    }
  },
  components: {
    appMyModal: myModal
  },
  computed: {

    calculatedRate: function() { //calculate recevice amount
      if (this.sendSelected === 'EOS' && this.receiveSelected === 'BNB') {
        this.tokenIndex = 0;
        this.fee = (this.sendAmount * this.tokenRate[0] * fee_rate) / show_decimal;
        this.subFee = (this.sendAmount * this.tokenRate[0] / show_decimal) - this.fee;
        return (this.sendAmount * this.tokenRate[0]) / show_decimal - this.fee
      } else if (this.sendSelected === 'EOS' && this.receiveSelected === 'VEN') {
        this.tokenIndex = 1;
        this.fee = (this.sendAmount * this.tokenRate[1] * fee_rate) / show_decimal;
        this.subFee = (this.sendAmount * this.tokenRate[1] / show_decimal) - this.fee;
        return (this.sendAmount * this.tokenRate[1]) / show_decimal - this.fee
      } else if (this.sendSelected === 'BNB' && this.receiveSelected === 'EOS') {
        this.tokenIndex = 2;
        this.fee = (this.sendAmount * this.tokenRate[2] * fee_rate) / show_decimal;
        this.subFee = (this.sendAmount * this.tokenRate[2] / show_decimal) - this.fee;
        return (this.sendAmount * this.tokenRate[2]) / show_decimal - this.fee
      } else if (this.sendSelected === 'BNB' && this.receiveSelected === 'VEN') {
        this.tokenIndex = 3;
        this.fee = (this.sendAmount * this.tokenRate[3] * fee_rate) / show_decimal;
        this.subFee = (this.sendAmount * this.tokenRate[3] / show_decimal) - this.fee;
        return (this.sendAmount * this.tokenRate[3]) / show_decimal - this.fee
      } else if (this.sendSelected === 'VEN' && this.receiveSelected === 'EOS') {
        this.tokenIndex = 4;
        this.fee = (this.sendAmount * this.tokenRate[4] * fee_rate) / show_decimal;
        this.subFee = (this.sendAmount * this.tokenRate[4] / show_decimal) - this.fee;
        return (this.sendAmount * this.tokenRate[4]) / show_decimal - this.fee
      } else if (this.sendSelected === 'VEN' && this.receiveSelected === 'BNB') {
        this.tokenIndex = 5;
        this.fee = (this.sendAmount * this.tokenRate[5] * fee_rate) / show_decimal;
        this.subFee = (this.sendAmount * this.tokenRate[5] / show_decimal) - this.fee;
        return (this.sendAmount * this.tokenRate[5]) / show_decimal - this.fee
      } else return (this.sendAmount * 1)
    },
    calculatedShowRate: function() { //show the token rate in the table
      this.showTokenRate = {};
      if (this.sendSelected === 'EOS') {
        this.showTokenRate.BNB = this.tokenRate[0] / show_decimal;
        this.showTokenRate.VEN = this.tokenRate[1] / show_decimal;
        return this.showTokenRate;
      }
      if (this.sendSelected === 'BNB') {

        this.showTokenRate.EOS = this.tokenRate[2] / show_decimal;
        this.showTokenRate.VEN = this.tokenRate[3] / show_decimal;
        return this.showTokenRate;
      }
      if (this.sendSelected === 'VEN') {
        this.showTokenRate.EOS = this.tokenRate[4] / show_decimal;
        this.showTokenRate.BNB = this.tokenRate[5] / show_decimal;
        return this.showTokenRate;
      }
    },
    exchangeInfoParam: function() {
      return this.$store.state.exchangeInfo;
    },
    errorInfoParam: function() {
      return this.$store.state.errorInfo;
    },


  },
  mounted() {
    let tokenExchangeContract = new web3.eth.Contract(TokenExchange_ABI, TokenExchange_address);
    tokenExchangeContract.methods.getRate().call({ //get the token rate from smart contract
    }, (error, result) => {
      if (error) {
        console.error();
      } else {
        console.log("처음 가져온 환율 : " + String(result));
        this.tokenRate = result;
        console.log(this.tokenRate);
      }
      console.log("\n");
    });
    this.watchSetRate()
  },
  methods: {
    readCurrentAccount: function() {
      function checkMetaMaskAccount(callback) {
        return new Promise((resolve, reject) => {
          web3.eth.getAccounts().then(res => {
            if (res) { //get the account from meta mask
              let accounts = res;
              resolve(accounts)
            } else {
              this.message = "오류내용 : 메타마스크의 연동된 계좌 정보를 가져오지 못했습니다. (내부 실행 오류)"
              this.visible = !this.visible
              reject("오류내용 : 메타마스크의 연동된 계좌 정보를 가져오지 못했습니다. (내부 실행 오류)")
            }
          });
        });
      }
      checkMetaMaskAccount.call(this).then((result) => {
        this.sendAccountAddress = String(result);
      }); //Set the current account of the meta mask to fromAccountAddress
    },
    watchSetRate: function() {

      let tokenExchangeContract = new web3.eth.Contract(TokenExchange_ABI, TokenExchange_address);
      tokenExchangeContract.events.ResultForsetRate({}, (error, event) => { //watch smart contract set rate event
        if (!error) {
          console.log(event.returnValues._rate);
          this.tokenRate = event.returnValues._rate //update token rate
        } else {
          this.message = "Smart Contract에서 환전비를 확인 할 수 없습니다."
          this.visible = !this.visible
          console.log("watch setRate error :", error);
        }
      });
    },

    checkUserAccountBal: function() {

      userWalletAddress = this.sendAccountAddress;

      function getEther(callback) {
        return new Promise((resolve, reject) => {
          web3.eth.getBalance(userWalletAddress, (error, balance) => {
            if (!error) {
              let ether = web3.utils.fromWei(balance, 'ether'); //convert wei to ether

              store.commit('setBalInfo', {
                tokenName: "ETHER",
                tokenBalance: ether
              });

              resolve()
            } else {
              console.error("오류내용 : 계좌의 Ether 잔액을 가져오지 못했습니다 \n- 내부 실행 오류 (web3 문제 또는 잘못된 TokenExchange address 설정)");
              this.message = "오류내용 : 계좌의 Ether 잔액을 가져오지 못했습니다 \n- 내부 실행 오류 (web3 문제 또는 잘못된 TokenExchange address 설정)"
              this.visible = !this.visible
              reject()
            }
          }); //end of getBalance
        }); //end of Promise
      } //end of getEther

      getEther()
        .then(() => { //then search ERC20 tokens

          const getUserTokenBalance = new Promise((resolve, reject) => {
            let ctn = 0;

            tokens.forEach(function(token) {
              let contract = new web3.eth.Contract(ERC20_ABI, token); //get user's token balance

              contract.methods.balanceOf(userWalletAddress).call({
                from: userWalletAddress
              }, (error, balance) => {
                contract.methods.decimals().call({
                  from: userWalletAddress
                }, (error, decimals) => {
                  if (!error) {

                    let calculatedResult = balance / (Math.pow(10, decimals));

                    contract.methods.name().call({
                      from: userWalletAddress
                    }, (error, tokenName) => {

                      ctn++;

                      if (balance.toString() != '0') {
                        store.commit('setBalInfo', {
                          tokenName: tokenName,
                          tokenBalance: calculatedResult
                        });
                      }
                      if (ctn == tokens.length) { //check all tokens
                        ctn = 0;
                        resolve()
                      }
                    }); //end of name
                  } else {
                    console.error("오류내용 : 계좌의 Token 잔액을 가져오지 못했습니다 \n- 내부 실행 오류 (잘못된 Token address 설정)");
                    this.message = "오류내용 : 계좌의 Token 잔액을 가져오지 못했습니다 \n- 내부 실행 오류 (잘못된 Token address 설정)"
                    this.visible = !this.visible
                    console.log(error);
                  }
                }); //end of decimals
              }); //end of balanceof
            }); //end of tokens
          }); //end of promise

          getUserTokenBalance.then(result => {
            userAccountInfo = store.state.balInfo;
          });

        });

    },

    confirm: function(event) { // next button method
      if (this.sendAccountAddress && this.sendAmount &&
        this.calculatedRate && this.sendSelected && this.receiveSelected) { //check parameters
        let check_sendAccountAddress = this.sendAccountAddress.substring(0, 2);
        if (check_sendAccountAddress != "0x") {
          this.message = "올바른 주소 형식을 입력해주세요."
          this.visible = !this.visible
        } else if (this.sendAccountAddress.length != 42) {
          this.message = "올바른 주소 형식을 입력해주세요."
          this.visible = !this.visible

        } else if (parseFloat(this.sendAmount) < 0.00001) {
          this.message = "보내는 양을 0.00001 이상이고 소수점 5번째 까지 입력해주세요."
          this.visible = !this.visible

        } else {
          let check;
          let decallowed = 5; // Number of decimal places

          if (this.sendAmount.indexOf('.') == -1) this.sendAmount += ".";
          let dectext = this.sendAmount.substring(this.sendAmount.indexOf('.') + 1, this.sendAmount.length);

          if (dectext.length > decallowed) {
            check = false;
          } else {
            check = true;
          }

          if (!check) {
            this.message = "보내는 양을 소수점 " + decallowed + " 자리 까지 입력해주세요."
            this.visible = !this.visible
          }

          if (check === true) {
            store.commit('pollExchangeInfo', { //commit token exchange information to vuex
              sendSelected: this.sendSelected,
              receiveSelected: this.receiveSelected,
              sendAmount: this.sendAmount,
              receiveAmount: this.calculatedRate,
              sendAccountAddress: this.sendAccountAddress,
              rateIndex: this.tokenRate[this.tokenIndex],
              tokenIndex: this.tokenIndex,
              fee: this.fee,
              subFee: this.subFee
            });

            this.checkUserAccountBal();
            this.showDisplay = 1;
          }
        }
      } else {
        this.message = "정보를 모두 입력하세요."
        this.visible = !this.visible
      }
    }, // end of next
    exchange: function(event) {

      for (let k = 0; k < userAccountInfo.length; k++) // Identify which token is
      {
        if (userAccountInfo[k].tokenName == this.sendSelected) {
          checkToken = true;
          selTokenIndex = k;
        }

        if (userAccountInfo[k].tokenName == this.sendSelected) {
          checkToken = true;
          selTokenIndex = k;
        }

        if (userAccountInfo[k].tokenName == this.sendSelected) {
          checkToken = true;
          selTokenIndex = k;
        }
      }

      this.showDisplay = 2;
      let selectedSendToken = this.$store.state.exchangeInfo.sendSelected;
      let selectedReceiveToken = this.$store.state.exchangeInfo.receiveSelected;
      let selectedSendAmount = this.$store.state.exchangeInfo.sendAmount;
      let selectedReceiveAmount = this.$store.state.exchangeInfo.receiveAmount;
      let selectedSendAccountAddress = this.$store.state.exchangeInfo.sendAccountAddress;
      let selectedTokenIndex = this.$store.state.exchangeInfo.tokenIndex;
      let selectedRateIndex = this.$store.state.exchangeInfo.rateIndex; //get the exchange information from vuex

      console.log("show" + selectedRateIndex)
      let selectedSendTokenAddress;
      let selectedReceiveTokenAddress;
      if (selectedSendToken === 'EOS') {
        selectedSendTokenAddress = EOS_tokenAddress;

        if (!checkToken) //exception handling
        {
          this.message = "선택하신 토큰과 입력하신 양에 대하여\n사용자 계좌가 충분히 보유하고 있지 않습니다"
          this.visible = !this.visible
          exchangeAvailable = false;
          store.commit('balInitialization');
          this.showDisplay = 1;
        } else if (selectedSendAmount > userAccountInfo[selTokenIndex].tokenBalance) {
          this.message = "선택하신 토큰과 입력하신 양에 대하여\n사용자 계좌가 충분히 보유하고 있지 않습니다"
          this.visible = !this.visible
          exchangeAvailable = false;
          store.commit('balInitialization');
          this.showDisplay = 1;
        } else {
          this.message = "메타마스크를 통해 환전을 진행하세요."
          this.visible = !this.visible
          exchangeAvailable = true;
          store.commit('balInitialization');
        }
      }

      if (selectedSendToken === 'BNB') {
        selectedSendTokenAddress = BNB_tokenAddress;

        if (!checkToken) {
          this.message = "선택하신 토큰과 입력하신 양에 대하여\n사용자 계좌가 충분히 보유하고 있지 않습니다"
          this.visible = !this.visible
          exchangeAvailable = false;
          store.commit('balInitialization');
          this.showDisplay = 1;
        } else if (selectedSendAmount > userAccountInfo[selTokenIndex].tokenBalance) {
          this.message = "선택하신 토큰과 입력하신 양에 대하여\n사용자 계좌가 충분히 보유하고 있지 않습니다"
          this.visible = !this.visible
          exchangeAvailable = false;
          store.commit('balInitialization');
          this.showDisplay = 1;
        } else {
          this.message = "메타마스크를 통해 환전을 진행하세요."
          this.visible = !this.visible
          exchangeAvailable = true;
          store.commit('balInitialization');
        }
      }

      if (selectedSendToken === 'VEN') {
        selectedSendTokenAddress = VEN_tokenAddress;

        if (!checkToken) {
          this.message = "선택하신 토큰과 입력하신 양에 대하여\n사용자 계좌가 충분히 보유하고 있지 않습니다"
          this.visible = !this.visible
          exchangeAvailable = false;
          store.commit('balInitialization');
          this.showDisplay = 1;
        } else if (selectedSendAmount > userAccountInfo[selTokenIndex].tokenBalance) {
          this.message = "선택하신 토큰과 입력하신 양에 대하여\n사용자 계좌가 충분히 보유하고 있지 않습니다"
          this.visible = !this.visible
          exchangeAvailable = false;
          store.commit('balInitialization');
          this.showDisplay = 1;
        } else {
          this.message = "메타마스크를 통해 환전을 진행하세요."
          this.visible = !this.visible
          exchangeAvailable = true;
          store.commit('balInitialization');
        }
      }

      if (selectedReceiveToken === 'EOS') selectedReceiveTokenAddress = EOS_tokenAddress;
      if (selectedReceiveToken === 'BNB') selectedReceiveTokenAddress = BNB_tokenAddress;
      if (selectedReceiveToken === 'VEN') selectedReceiveTokenAddress = VEN_tokenAddress;

      if (exchangeAvailable == true) {

        let tokenContract = new web3.eth.Contract(Token_ABI, selectedSendTokenAddress);
        let tokenExchangeContract = new web3.eth.Contract(TokenExchange_ABI, TokenExchange_address);

        let sendAmount = web3.utils.toWei(selectedSendAmount.toString(), 'ether');
        let receiveAmount = web3.utils.toWei(selectedReceiveAmount.toString(), 'ether');

        function setApprove(callback) {
          return new Promise((resolve, reject) => {
            tokenContract.methods.increaseApprove(TokenExchange_address, receiveAmount.toString()).send({
              from: selectedSendAccountAddress // call 'increaseApprove' function for exchanging token
            }, (error, result) => {
              if (!error) {
                this.message = "환전 승인이 성공하였습니다. 트랜잭션 펜딩이 완료 된 후 메타마스크를 통해 다음을 진행해주세요"
                this.visible = !this.visible

                // Continue to check if the transaction is complete every 5 seconds.
                let exchangeIntervalFirst = setInterval(() => {
                  const receipt = web3.eth.getTransactionReceipt(result)
                    .then(exchangeIncreaseApproveResult => {
                      if (exchangeIncreaseApproveResult) {
                        console.log(exchangeIncreaseApproveResult);
                        if (exchangeIncreaseApproveResult.status == true) {
                          clearInterval(exchangeIntervalFirst);

                          this.message = "트랜잭션 팬딩이 완료되었습니다. 메타마스크를 통해 다음을 진행해주세요."
                          this.visible = !this.visible
                          resolve()
                        } else {
                          console.log("error!!!");
                        }
                      }
                    });
                }, 5000);
              } else {
                if (error.message.includes("User denied transaction signature")) {
                  this.message = "환전 승인 거부하였습니다."
                  this.visible = !this.visible
                  exchangeAvailable = false;
                  reject("환전 승인 거부하였습니다.")
                } else {
                  console.log('환전 승인 실패');
                  exchangeAvailable = false;
                  reject("환전 승인에 실패하였습니다. 메타마스크와 입력한 보낼 지갑 주소가 동일한지 확인하세요");
                }
              }
            }); //end of getBalance
          }); //end of Promise
        } //end of setApprove

        setApprove.call(this)
          .then(() => { //then

            function Exchanging(callback) {
              return new Promise((resolve, reject) => {
                tokenExchangeContract.methods.exchange(selectedSendAccountAddress, sendAmount.toString(), receiveAmount.toString(),
                  selectedSendTokenAddress, selectedReceiveTokenAddress, selectedTokenIndex, selectedRateIndex).send({
                    from: selectedSendAccountAddress // call 'exchange' function for exchanging token
                  },
                  (error, result) => {
                    if (!error) {
                      // Continue to check if the transaction is complete every 5 seconds.
                      let exchangeIntervalSecond = setInterval(() => {
                        const receipt = web3.eth.getTransactionReceipt(result)
                          .then(exchangeResult => {
                            console.log(exchangeResult);
                            if (exchangeResult) {
                              console.log(exchangeResult);
                              if (exchangeResult.status == true) {
                                clearInterval(exchangeIntervalSecond);
                                console.log("환전 성공");
                                resolve()
                              } else {
                                console.log("error!!!");
                                clearInterval(exchangeIntervalSecond);
                              }
                            }
                          });

                      }, 5000);
                    } else {
                      if (error.message.includes("User denied transaction signature")) {

                        exchangeAvailable = false;
                        reject("환전 진행을 거부하였습니다. 사용자 거부 또는 SmartContract 토큰 확인 필요");
                      } else {
                        console.log('환전 진행 실패 : ' + error);
                        exchangeAvailable = false;
                        reject("환전 진행에 실패하였습니다. 입력한 주소와 토큰량을 확인해주세요");
                      }
                    }
                  }) //end of exchange
              }); //end of Promise
            } //end of Exchaning


            Exchanging()
              .then(() => { //change display
                this.showDisplay = 4;
                this.message = "환전이 완료되었습니다."
                this.visible = !this.visible
                console.log('환전 후 ');
                this.showDisplay = 7;
              })
              .catch((error) => {
                store.commit('pollErrorInfo', {
                  errorMessage: '환전 진행 실패 : ' + error
                });
                this.message = "환전 진행이 거부되었습니다."
                this.visible = !this.visible
                console.log('환전 진행 실패 :' + error);
                store.commit('initializationExchangInfo');

                this.resetInputForm();
                this.showDisplay = 0;

              })

          })
          .catch((error) => { //exception handling
            store.commit('pollErrorInfo', {
              errorMessage: error
            });
            console.log('catch error : ' + error);
            store.commit('initializationExchangInfo');

            this.resetInputForm();
            this.showDisplay = 0;
          });

      }
    }, // end of exchange
    showResult: function(event) {
      this.showDisplay = 7;
    }, // complete exchange
    before: function(event) { // next button method
      if (this.showDisplay == 1) {
        this.showDisplay = this.showDisplay - 1;
        this.resetInputForm();
      } else if (this.showDisplay == 0) {
        store.commit('initializationExchangInfo');
        this.showDisplay = 0;
        this.resetInputForm();
        this.$router.push('/');
      }
    },
    home: function(event) {
      store.commit('initializationExchangInfo');
      store.commit('initializationErrorInfo')
      this.showDisplay = 0;
      this.resetInputForm();
    },
    resetInputForm: function() {
      this.sendAccountAddress = '';
      this.sendAmount = '';
      this.fee = '';
    }
  } //end of methods
} //end of export
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

#estimatedMessage {
  font-size: 15px;
  font-weight: bold;
  color: #ff0000;
}

#input_row {
  height: 700px;
}

#input_exchange_ex {
  position: absolute;
  top: 55%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 25%;
}

#ex_readAccount_btn {
  font-size: 5;
  width: 10%;
  height: 5%;
  position: absolute;
  top: 55%;
  left: 70%;
  transform: translate(-50%, -50%);
}

#send_account_ex {
  position: absolute;
  top: 55%;
  left: 32.4%;
  transform: translate(-50%, -50%);
  font-weight: 800;
}

#sendAmount_ex {
  width: 13%;
  position: absolute;
  top: 64%;
  left: 56%;
  transform: translate(-50%, -50%);
}

#send_token_ex {
  position: absolute;
  top: 64%;
  left: 32%;
  transform: translate(-50%, -50%);
  font-weight: 800;
}

#send_token_select_ex {
  width: 10%;
  position: absolute;
  top: 64%;
  left: 42.5%;
  transform: translate(-50%, -50%);
}

#receive_token_ex {
  position: absolute;
  top: 73%;
  left: 32%;
  transform: translate(-50%, -50%);
  font-weight: 800;
}

#receiveAmount_ex {
  width: 13%;
  position: absolute;
  top: 73%;
  left: 56%;
  transform: translate(-50%, -50%);
}

#receive_token_select_ex {
  width: 10%;
  position: absolute;
  top: 73%;
  left: 42.5%;
  transform: translate(-50%, -50%);
}

#showRate {
  width: 20%;
  position: absolute;
  top: 35%;
  left: 50%;
}

#showProgress {
  width: 50%;
  position: absolute;
  top: 15%;
  left: 46.5%;
  transform: translate(-50%, -50%);
}


#exchange_before_button {
  position: absolute;
  top: 85%;
  left: 42.7%;
  transform: translate(-50%, -50%);
  width: 10%;

}

#exchange_next_button {
  position: absolute;
  top: 85%;
  left: 57%;
  transform: translate(-50%, -50%);
  width: 10%;
}

#next_button2 {
  position: absolute;
  top: 85%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10%;
}

#home_button {
  position: absolute;
  top: 80%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10%;
}

#showMessage {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 25px;
  font-weight: bold;
  color: 'blue';
}

#errorMessage {
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  font-size: 25px;
  font-weight: bold;
  color: #ff0000;
}

#ex_table1 {
  width: 40%;
  position: fixed;
  top: 50%;
  left: 25%;
  transform: translate(-50%, -50%);
}

#ex_table2 {
  width: 40%;
  position: fixed;
  top: 50%;
  left: 75%;
  transform: translate(-50%, -50%);
}

#arrow_show {
  position: absolute;
  top: 49%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 6%;
}

button {
  position: absolute;
  top: 80%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 10%;
}

ul {
  list-style-type: none;
}

.container {
  width: 200%;
  position: absolute;
  z-index: 1;

}

.progressbar li {
  float: left;
  width: 20%;
  position: relative;
  text-align: center;
}

.progressbar li:before {
  content: "1";
  width: 30px;
  height: 30px;
}

.progressbar li:before {
  content: "1";
  width: 30px;
  height: 30px;
  border: 2px solid #bebebe;
  display: block;
  margin: 0 auto 10px auto;
  border-radius: 50%;
  line-height: 27px;
  background: white;
  color: #bebebe;
  text-align: center;
  font-weight: bold;
}

.progressbar {
  counter-reset: step;
}

.progressbar li:before {
  content: counter(step);
  counter-increment: step;
  width: 30px;
  height: 30px;
  border: 2px solid #bebebe;
  display: block;
  margin: 0 auto 10px auto;
  border-radius: 50%;
  line-height: 27px;
  background: white;
  color: #bebebe;
  text-align: center;
  font-weight: bold;
}

.progressbar li:after {
  content: '';
  position: absolute;
  width: 100%;
  height: 3px;
  background: #979797;
  top: 15px;
  left: -50%;
  z-index: -1;
}

.progressbar li:first-child:after {
  content: none;
}

.progressbar li.active {
  color: green;
  border-color: #3aac5d;
}

.progressbar li.active:before {
  border-color: green;
}

.progressbar li.active+li:after {
  background: #3aac5d;
}

.progressbar li.active:before {
  border-color: #3aac5d;
  background: #3aac5d;
  color: white
}


th {
  background-color: #29B6F6;
  color: #FFFFFF;
  text-align: center;
}

td {
  text-align: center;
  background-color: #FFFFFF;
}

.table {
  position: fixed;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

ul {
  list-style-type: none;
}

#spinner {
  position: fixed;
  top: 50%;
  left: 50%;

}
</style>
