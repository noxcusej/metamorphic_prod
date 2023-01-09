<template>
  <div id="outer">
    <main>
      <canvas></canvas>
      <div id="loadingContainer">
        <div id="loadingBack">
          <div id="loadingBar"></div>
        </div>
      </div>
    </main>
  </div>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import { MetaRoom4 } from "../babylon/MetaRoom4";

export default defineComponent({
  name: 'BabylonMetaRoom',

  mounted() {
    const canvas = document.querySelector("canvas")!;
    const loader = document.getElementById("loadingContainer") as HTMLElement;
    const loadingBack = document.getElementById("loadingBack") as HTMLElement;
    const loadingBar = document.getElementById("loadingBar") as HTMLElement;
    new MetaRoom4(canvas, loader, loadingBack, loadingBar);
  }
});
</script>
<style> 
body {
  margin:0px !important;
  font-family: "Ubuntu", sans-serif;
}
  #outer {
    width: 100%;
    height:100vh;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  main {
    width: 100%;
    height:100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: relative;
  } 

  #loadingContainer {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position:absolute;
    background: rgb(0, 0, 0);
    margin: 0.5rem;
  }

  #loadingContainerLoaded {
    width: 100%;
    height: 100vh;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position:absolute;
    background: rgb(0, 0, 0);
    opacity: 0;
    transition-delay: 10s;
    /* transition: opacity 2.5s ease; */
  }
  #loadingBack
  {
    width: 30%;
    height: 3px;
    background: #ffffff;
  }
  #loadingBar {
    width: 30%;
    height: 3px;
    background: #3b3b3b;
    box-shadow: 0 0 10px 2px #ffffff;
  } 

  canvas{
    width: 100%;
    height: 100vh;
    /* overflow: unset; */
    border: none !important;
    outline: none !important;
    /* display: block; */
  }
</style>
