<template>
  <div id="app">
    <router-view />
    <notifications group="notifications" :max="5" position="top right" />
  </div>
</template>

<style lang="scss">
  #app {
    font-family: Avenir, Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: $dark-blue;
    height: 100vh;
    display: flex;
    flex-direction: column;
  }
  body {
    margin: 0;
    padding: 0;
  }
</style>
