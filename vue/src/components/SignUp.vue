<template>
	<div class="sign-up">
		<p>
			 회원가입을 진행하세요
		</p>
		<input type="text" v-model="email" placeholder="Email" ><br>
		<input type="password" v-model="password" placeholder="Password"><br>
		<button v-on:click="signUp">회원가입</button>
		 <router-link to ="/admin">로그인 페이지로 돌아가기 </router-link>
	</div>
</template>

<script>
import firebase from 'firebase'
export default {
	name: 'signUp',
	data: function() {
		return {
			email: '',
			password: ''
		}
	},
	methods: {
		signUp: function(){
			firebase.auth().createUserWithEmailAndPassword(this.email, this.password).then( //create firebase auth with email and password
				function(user){
					alert('아이디가 생성되었습니다')
				},
				function(err){
					alert('에러 : '+err.message)
				}
			)
		}
	}
}
</script>

<sytle scoped>
	.signUp{
		margin-top: 40px;
	}
	input{
		margin: 10px 0;
		width: 20%;
		padding: 15px;

	}
	button{
		margin-top 10px;
		width: 10%;
		cursor: pointer;
	}
	span {
		display: block;
		margin-top: 20px;
		font-size: 11px;
	}
</sytle>
