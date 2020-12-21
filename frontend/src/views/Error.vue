<template>
  <div class="errorContainer">
    <div class="message">
      <div class="code">404</div>
      <p>you seem lost</p>
      <router-link to="/login">go back to login page</router-link>
    </div>
  </div>
</template>

<script>
  export default {
    name: "errorPage"
  }
</script>

<style lang="scss" scoped>
  .errorContainer {
    height: 100vh;
    width: 100vw;
    background-image: url("../assets/logo.png");
    background-size: cover;
    background-repeat: no-repeat;
    background-position: center center;
    .message {
      height: 100vh;
      width: 100vw;
      display: flex;
      justify-content: center;
      flex-direction: column;
      .code {
        font-size: 300px;
        color: $white;
        text-shadow: 1px 0.1px 5px $white;
      }
      p,
      a {
        text-decoration: none;
        color: $white;
        font-size: $font-size-xl;
        text-shadow: 2px 1px 10px $white;
      }
    }
  }
</style>
