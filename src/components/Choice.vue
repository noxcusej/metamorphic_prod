<template>
  <div class="base11">
      <button  class="base1" v-on:click="choose('oculus')" >
          Oculus
      </button>
  </div>

  <div class="base22">
  <button class="base2" v-on:click="choose('web')">
        Web
  </button>
  </div>
</template>
<script lang="ts">
export default ({
  name: 'App',
  components: {
  },
  data(){
    return {
      choice: null,
    }
  },
  methods: {
    choose(choice: any){
      if(choice === 'oculus'){
        this.$router.push({ path: '/oculus' });
      } else {
        this.$router.push({ path: '/web' })
      }
    }
  }
});
</script>
<style>
  body {
    /* color: black; */
    background-color: black;
  }
  .base11{
    display: inline-block;
    
  }
  .base1{
    background:none; border:none;
    width: 6vw;
    height: 6vh;
    margin-top: 48.5vh;
    margin-left: 21.5vw;
    margin-right: 21.5vw;
    font:bold 3vh "Roboto", sans-serif;
    color: rgb(255, 255, 255);

  }
  .base22{
    display: inline-block;
  }
  
  .base2{
    background:none; border:none;
    width: 6vw;
    height: 6vh;
    margin-top: 48.5vh;
    margin-left: 21.5vw;
    margin-right: 21.5vw;
    font:bold 3vh "Roboto", sans-serif;
    color: rgb(255, 255, 255);

  }
  </style>