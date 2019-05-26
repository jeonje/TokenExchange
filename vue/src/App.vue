<template>
  <div id="app" v-bind:style="{backgroundColor: color}" style="width:100%; height:100vh;">

    <router-view/>
  </div>

</template>

<script>
    export default{
      data(){
        return{
          color: 'WhiteSmoke'
        }
      }
    }
</script>

<style>

</style>
