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

    <p id="home_message">
      관리자 페이지입니다
    </p>
    <button id="logout_Button" v-on:click="logout">로그아웃</button>

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


</div>
</template>
<script>
import firebase from 'firebase';
import store from '../store';
import adminModal from './adminmodal.vue';


export default {
  components: {
    appAdminModal: adminModal
  },
  methods: {
    logout: function() {
      firebase.auth().signOut().then(() => { //logout firebase auth
          store.commit('changeAdminMsg', '로그아웃하셨습니다.');
          store.commit('changeAdminModal');
          this.$router.replace('/admin');
        })
        .catch((error) => {
          console.log(error);
        });

    }
  }
}
</script>
<style>
#admin_home1,
#admin_deposit1,
#admin_withdraw1,
#admin_balance1 {
  font-size: 30px;
  color: green;
}

#logout_Button {

  position: absolute;
  top: 60%;
  left: 50%;
  transform: translate(-50%, -50%);
}

#home_message {
  font-size: 50px;
  font-weight: 700;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}

</style>
