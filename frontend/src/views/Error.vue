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
    width: 100%;
    height: 100%;
    background-color: $powder-blue;
    .message {
      box-shadow: 2px 2px 10px $black-coral;
      align-self: center;
      margin: auto;
      max-width: 600px;
      background-color: $white;
      border-radius: 15px;
      padding: 50px;
      padding: 50px;
      display: flex;
      flex-direction: column;
      width: 60%;
      margin: auto;
      .code {
        font-size: 100px;
      }
      p {
        font-size: $font-size-xxl;
        margin: 20px 0;
      }
      a {
        text-decoration: none;
        font-size: $font-size-xl;
        color: $dark-blue;
        &:hover {
          color: $blue;
          transition: color 0.5s linear;
        }
      }
    }
  }

  @media screen and (min-width: $breakpoint-md) {
    .container {
      .message {
        width: 60%;
      }
    }
  }
</style>
