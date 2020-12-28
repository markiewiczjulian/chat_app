<template>
  <div class="container">
    <div class="message">
      <div class="code">404</div>
      <p>you seem lost</p>
      <router-link to="/login">go back to login page</router-link>
      <router-link to="/"
        >or to a main page (if you are already logged in)</router-link
      >
    </div>
  </div>
</template>

<script>
  export default {
    name: "errorPage"
  }
</script>

<style lang="scss" scoped>
  .container {
    display: flex;
    width: 95%;
    background-color: $powder-blue;
    box-shadow: 2px 2px 10px $black-coral;
    align-self: center;
    max-width: 600px;
    border-radius: 15px;
    margin: auto;
    .message {
      padding: 50px;
      padding: 50px;
      display: flex;
      flex-direction: column;
      width: 60%;
      margin: auto;
      .code {
        font-size: 100px;
        color: $white;
      }
      p {
        font-size: $font-size-xxl;
        color: $white;
        margin: 20px 0;
      }
      a {
        text-decoration: none;
        color: $white;
        font-size: $font-size-xl;
      }
    }
  }

  @media screen and (min-width: $breakpoint-md) {
    .container {
      width: 60%;
    }
  }
</style>
