<template>
  <div class="navbar">
    <router-link to="/">Chat room</router-link> |
    <router-link to="/login">Login</router-link>
    <div class="loggedInUser">
      {{ currUserName }}
    </div>
  </div>
</template>

<script>
  import { Auth } from 'aws-amplify';

  export default {
    name: "Navbar",
    data() {
      return {
        currUserName: ''
      }
    },
    created() {
      this.getCurrUser();
    },
    methods: {
      async getCurrUser() {
        // add current user name to the store and just get here
        try {
          const user = await Auth.currentUserInfo();
          this.currUserName = user.attributes.email;
        } catch (error) {
          console.log('error signing up:', error);
        }
      }
    },
  }
</script>
<style lang="scss" scoped>
  .navbar {
    height: 20%;
    background-color: lightgreen;
    overflow-x: hidden;
    .loggedInUser {
      color: $black;
    }
    a {
      font-weight: bold;
      color: #2c3e50;

      &.router-link-exact-active {
        color: #42b983;
      }
    }
  }
</style>
