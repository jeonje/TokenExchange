import Vue from 'vue'
import Router from 'vue-router'
import firebase from 'firebase'

import Index from '@/components/Index'
import Exchange from '@/components/Exchange'
import Send from '@/components/Send'
import Transaction from '@/components/Transaction'
import Balance from '@/components/Balance'
import AdminLogin from '@/components/AdminLogin'
import AdminHome from '@/components/AdminHome'
import AdminDeposit from '@/components/AdminDepo'
import AdminWithdraw from '@/components/AdminWith'
import AdminBalance from '@/components/AdminBal'
import SignUp from '@/components/SignUp'

Vue.use(Router)

const router = new Router({
  mode: 'history',
  routes: [
    {
      path: '*',
      redirect: '/',
      meta: {
        requireAuth: false
      }
    },
    {
      path: '/',
      name: 'Index',
      component: Index,
      meta: {
        requireAuth: false
      }
    },
    {
      path: '/exchange',
      component: Exchange,
      meta: {
        requireAuth: false
      }
    },
    {
      path: '/send',
      component: Send,
      meta: {
        requireAuth: false
      }
    },
    {
      path: '/transaction',
      component: Transaction,
      meta: {
        requireAuth: false
      }
    },
    {
      path: '/balance',
      component: Balance,
      meta: {
        requireAuth: false
      }
    },
    {
      path: '/admin',
      component: AdminLogin,
      meta: {
        requireAuth: false
      }
    },
    {
      path: '/admin/home',
      component: AdminHome,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/admin/deposit',
      component: AdminDeposit,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/admin/withdraw',
      component: AdminWithdraw,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/admin/balance',
      component: AdminBalance,
      meta: {
        requireAuth: true
      }
    },
    {
      path: '/signUp',
      component: SignUp,
      meta: {
        requireAuth: false
      }
    }
  ]
});



router.beforeEach((to, from, next) => {   //navigation guard
  const currentUser = firebase.auth().currentUser;
  const requireAuth = to.matched.some(record=> record.meta.requireAuth);
  if(requireAuth && !currentUser) next('admin');
  else next();
});

export default router;
