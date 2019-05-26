<template>
<div>

  <div class="container-fluid">
    <div>
      <h1 id="login_text">Login</h1>
      <form autocomplete="off">
        <input id="email_input" autocomplete="off" type="text" class="form-control" v-model="email" placeholder="email 입력">
        <input id="password_input" autocomplete="off" type="password" class="form-control" v-model="password" placeholder="password 입력">
      </form>
      <button id="login_button" type="button" class="btn btn-primary btn-lg" v-on:click="login">로그인</button>
      <button id="signUp_button" type="button" class="btn btn-info btn-lg" v-on:click="signUp">회원가입</button>
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


</div>

</div>
</template>

<script>
import firebase from 'firebase';
import store from '../store';
import adminModal from './adminmodal.vue';

export default {
  data() {
    return {
      email: '',
      password: '',
    }
  },
  components: {
    appAdminModal: adminModal
  },
  methods: {
    login: function() {
      firebase.auth().signInWithEmailAndPassword(this.email, this.password).then( //login firebase auth with Email and password
        (user) => {
          store.commit('changeAdminMsg', '로그인에 성공하였습니다.');
          store.commit('changeAdminModal');
          this.$router.replace('/admin/home')
        },
        (err) => {
          store.commit('changeAdminMsg', '로그인에 실패하였습니다');
          store.commit('changeAdminModal');
        }
      )
    },
    signUp: function(event) {
      this.$router.replace('/signUp')
    }
  }
}
</script>

<style>
#login_text {
  position: absolute;
  top: 40%;
  left: 50%;
  transform: translate(-50%, -50%);
}

#email_input {
  width: 10%;
  position: absolute;
  top: 47%;
  left: 50%;
  transform: translate(-50%, -50%);
}

#password_input {
  width: 10%;
  position: absolute;
  top: 53%;
  left: 50%;
  transform: translate(-50%, -50%);
}

#login_button {
  width: 6%;
  height: 6%;
  position: absolute;
  top: 50%;
  left: 60%;
  transform: translate(-50%, -50%);
}

#signUp_button {
  width: 8%;
  height: 6%;
  position: absolute;
  top: 65%;
  left: 50%;
  transform: translate(-50%, -50%);
}
</style>
