import Vue from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
import BootstrapVue from 'bootstrap-vue'
import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/firestore';
import '../node_modules/bootstrap/dist/css/bootstrap.css'
import '../node_modules/bootstrap-vue/dist/bootstrap-vue.css'

Vue.use(BootstrapVue)
Vue.config.productionTip = false


let app;
let firebaseConfig = {
  apiKey: "AIzaSyAmEu45n364d-NLcbxqRp4ITmMdTr3Sx4U",
  authDomain: "tokenexchanger-2d18b.firebaseapp.com",
  databaseURL: "https://tokenexchanger-2d18b.firebaseio.com",
  projectId: "tokenexchanger-2d18b",
  storageBucket: "tokenexchanger-2d18b.appspot.com",
  messagingSenderId: "458979221012",
  appId: "1:458979221012:web:8d828565a7f6682c"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
firebase.auth().onAuthStateChanged(function(user) {
  if (!app) {
    app = new Vue({
      router,
      store,
      render: h => h(App)
    }).$mount('#app')
  }
})
