import Vue from 'vue'
import Vuex from 'vuex'
import getWeb3 from './getWeb3';
Vue.use(Vuex)

import {
  TokenExchange_address,
  TokenExchange_ABI,
  ERC20_ABI,
  A_tokenAddress,
  B_tokenAddress,
  C_tokenAddress,
  Token_ABI
} from './components/Contract'

export default new Vuex.Store({
  state: {
    passwd: '',
    msg:'',
    available:false,
    depo: {
      from_account: '',
      tokenName: '',
      tokenSelected: '',
      input_num: ''
    },
    exchangeInfo: {
      sendSelected: '',
      receiveSelected: '',
      sendAmount: '',
      receiveAmount: '',
      sendAccountAddress: '',
      tokenRate: '',
      tokenIndex: '',
      rateIndex: '',
      fee: ''
    },
    transferInfo: {
      sendSelected: '',
      receiveSelected: '',
      sendAmount: '',
      receiveAmount: '',
      sendAccountAddress: '',
      receiveAccountAddress: '',
      tokenRate: '',
      tokenIndex: '',
      rateIndex: '',
      fee: ''
    },
    transactions: [],
    balInfo: [],
    adminAccountInfo: [],
    adminDepoInfo: [],
    adminDepoFinalInfo: [],
    adminWithInfo: [],
    adminWithResultInfo: [],
    adminBalInfo: [],
    checkAdmin: 0,
    transShowDisplay: 1,
    balShowDisplay: 0,
    adminDepoShowDisplay: 0,
    adminDepoFinalShowDisplay: 0,
    adminWithShowDisplay: 0,
    adminWithResultShowDisplay: 0,
    adminBalShowDisplay: 0,
    errorInfo: {
      errorMessage: ''
    },
    web3:{
      isInjected: false,
      web3Instance: null,
      coinbase: null,
      networkId : null,
      balance: null,
      error : null
    }

  },
  mutations: {
    registerWeb3Instance (state,payload) {
      console.log('registerWeb3instance Mutataion 실행 ',payload);
      let result = payload;
      let web3Copy = state.web3;
      web3Copy.coinbase = result.coinbase;
      web3Copy.networkId = result.networkId;
      web3Copy.isInjected = result.injectedWeb3;
      web3Copy.web3Instance = result.web3;
      state.web3 = web3Copy;
    },
    pollDepoInfo(state, payload) {
      state.depo.from_account = payload.from_account;
      state.depo.tokenName = payload.tokenName;
      state.depo.tokenSelected = payload.tokenSelected;
      state.depo.input_num = payload.input_num;
    },
    pollExchangeInfo(state, payload) {
      state.exchangeInfo.sendSelected = payload.sendSelected;
      state.exchangeInfo.receiveSelected = payload.receiveSelected;
      state.exchangeInfo.sendAmount = payload.sendAmount;
      state.exchangeInfo.receiveAmount = payload.receiveAmount;
      state.exchangeInfo.sendAccountAddress = payload.sendAccountAddress;
      state.exchangeInfo.receiveAmount = payload.receiveAmount;
      state.exchangeInfo.tokenRate = payload.tokenRate;
      state.exchangeInfo.tokenIndex = payload.tokenIndex;
      state.exchangeInfo.rateIndex = payload.rateIndex;
      state.exchangeInfo.fee = payload.fee;
      state.exchangeInfo.subFee = payload.subFee;
    },
    pollTransferInfo(state, payload) {
      state.transferInfo.sendSelected = payload.sendSelected;
      state.transferInfo.receiveSelected = payload.receiveSelected;
      state.transferInfo.sendAmount = payload.sendAmount;
      state.transferInfo.receiveAmount = payload.receiveAmount;
      state.transferInfo.sendAccountAddress = payload.sendAccountAddress;
      state.transferInfo.receiveAccountAddress = payload.receiveAccountAddress;
      state.transferInfo.receiveAmount = payload.receiveAmount;
      state.transferInfo.tokenRate = payload.tokenRate;
      state.transferInfo.tokenIndex = payload.tokenIndex;
      state.transferInfo.rateIndex = payload.rateIndex;
      state.transferInfo.fee = payload.fee;
    },
    pollErrorInfo(state, payload) {
      state.errorInfo.errorMessage = payload.errorMessage;
    },
    setBlockInfo(state, payload) {
     state.transactions.push(payload);
   },
   setBalInfo(state, payload) {
      state.balInfo.push(payload);
    },

    setAdminAccountInfo(state, payload) {
      state.adminAccountInfo.push(payload);
    },

    setAdminDepoInfo(state, payload) {
      state.adminDepoInfo.push(payload);
    },

    setAdminDepoFinalInfo(state, payload) {
      state.adminDepoFinalInfo.push(payload);
    },

    setAdminWithInfo(state, payload) {
      state.adminWithInfo.push(payload);
    },

    setAdminWithResultInfo(state, payload) {
      state.adminWithResultInfo.push(payload);
    },

    setAdminBalInfo(state, payload) {
      state.adminBalInfo.push(payload);
    },

    initializationExchangInfo(state) {
      state.exchangeInfo.sendSelected = '';
      state.exchangeInfo.receiveSelected = '';
      state.exchangeInfo.sendAmount = '';
      state.exchangeInfo.receiveAmount = '';
      state.exchangeInfo.sendAccountAddress = '';
      state.exchangeInfo.tokenRate = '';
      state.exchangeInfo.tokenIndex = '';
      state.exchangeInfo.rateIndex = '';
      state.exchangeInfo.fee = '';
    },
    initializationTransferInfo(state) {
      state.transferInfo.sendSelected = '';
      state.transferInfo.receiveSelected = '';
      state.transferInfo.sendAmount = '';
      state.transferInfo.receiveAmount = '';
      state.transferInfo.sendAccountAddress = '';
      state.transferInfo.receiveAccountAddress = '';
      state.transferInfo.tokenRate = '';
      state.transferInfo.tokenIndex = '';
      state.transferInfo.rateIndex = '';
      state.transferInfo.fee = '';
    },
    initializationErrorInfo(state) {
      state.errorInfo.sendSelected = '';
    },
    initialization(state) {
            state.transactions = [];
         },

    balInitialization(state) {
      state.balInfo = [];
    },

    adminAccountInfoInitialization(state) {
     state.adminAccountInfo = [];
   },

    adminDepoInitialization(state) {
      state.adminDepoInfo = [];
    },

    adminDepoFinalInitialization(state) {
      state.adminDepoFinalInfo = [];
    },

    adminWithInitialization(state) {
      state.adminWithInfo = [];
    },

    adminWithResultInitialization(state) {
      state.adminWithResultInfo = [];
    },

    adminBalInitialization(state) {
      state.adminBalInfo = [];
    },

    changeCheckAdmin(state, payload) {
     state.checkAdmin = payload;
   },

    changeTransDisplay(state, payload) {
     state.transShowDisplay = payload;
   },

   changeBalDisplay(state, payload) {
    state.balShowDisplay = payload;
  },

  changeAdminDepoDisplay(state, payload) {
   state.adminDepoShowDisplay = payload;
 },

 changeAdminDepoFinalDisplay(state, payload) {
  state.adminDepoFinalShowDisplay = payload;
},

  changeAdminWithDisplay(state, payload) {
   state.adminWithShowDisplay = payload;
 },

 changeAdminWithResultDisplay(state, payload) {
  state.adminWithResultShowDisplay = payload;
},
changeAdminMsg(state, payload) {
 state.msg = payload;
},
changeAdminModal(state) {
 state.available = !state.available
},
   changeAdminBalDisplay(state, payload) {
    state.adminBalShowDisplay = payload;
  }
  },
  actions: {
    async registerWeb3 ({commit}){
      console.log('registerWeb3 Action 시작');
      try {
        let result = await getWeb3;
        console.log('registerWeb3Instance',result);
        commit('registerWeb3Instance',result);
      }
      catch(err){
        console.log('error in action registerWeb3',err);
      }
    }
  }
}) // end of vuex.store
