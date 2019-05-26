<template>
<div class="my-modal" v-if="visible">
  <div class="my-modal__dialog">
    <header class="my-modal__header">
      <span>Information</span>
    </header>
    <div class="my-modal__body">
      <slot></slot>
    </div>
    <footer class="my-modal__footer">
      <button class="btn btn-primary" @click="$emit('update:visible', !visible)">확 인</button>
    </footer>
  </div>
</div>
</template>

<script>
export default {
  name: 'my-modal',
  props: {
    visible: {
      type: Boolean,
      require: true,
      default: false
    },
    title: {
      type: String,
      require: false,
    },
    methods: {
      handleWrapperClick() {
        this.$emit('update:visible', false)
      }
    }
  }
}
</script>

<style>
.my-modal {
  background-color: rgba(0, 0, 0, .7);
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  position: fixed;
  overflow: auto;
  margin: 0;
}

.my-modal__dialog {
  left: 36%;
  top: 75px;
  width: 600px;
  position: absolute;
  background: #fff;
  margin-bottom: 50px;
  border-radius: 10px;
}

.my-modal__header {
  font-size: 28px;
  font-weight: bold;
  line-height: 1.29;
  padding: 16px 16px 0 25px;
  position: relative;

}

.my-modal__body {
  padding: 25px;
  min-height: 150px;
  max-height: 412px;

}

.my-modal__footer {
  padding: 25px;
}

.btn.btn-primary {
  padding-top: 6px;
  padding-bottom: 6px;
  width: 20%;
}
</style>
