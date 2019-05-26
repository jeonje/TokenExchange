<template>
<div class="admin-modal" v-if="this.$store.state.available">
  <div class="admin-modal__dialog">
    <header class="admin-modal__header">
      <span>Information</span>
    </header>
    <div class="admin-modal__body">
      <slot></slot>
    </div>
    <footer class="admin-modal__footer">
      <button class="btn btn-primary" @click="change">확 인</button>
    </footer>
  </div>
</div>
</template>

<script>
import store from '../store';
export default {
  name: 'admin-modal',
  props: {
    title: {
      type: String,
      require: false,
    },
    methods: {
      handleWrapperClick() {
        this.$emit('update:visible', false)
      }
    }
  },
  methods: {
    change() {
      store.commit('changeAdminModal');
    }
  }
}
</script>

<style>
.admin-modal {
  background-color: rgba(0, 0, 0, .7);
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  position: fixed;
  overflow: auto;
  margin: 0;
}

.admin-modal__dialog {
  left: 36%;
  top: 75px;
  width: 600px;
  position: absolute;
  background: #fff;
  margin-bottom: 50px;
  border-radius: 10px;
}

.admin-modal__header {
  font-size: 28px;
  font-weight: bold;
  line-height: 1.29;
  padding: 16px 16px 0 25px;
  position: relative;
}

.admin-modal__body {
  padding: 25px;
  min-height: 100px;
  max-height: 300px;
}

.admin-modal__footer {
  padding: 25px;
  padding-left: 250px;
}

.btn.btn-primary {
  padding-top: 6px;
  padding-bottom: 6px;
  width: 20%;
}
</style>
