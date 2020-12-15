<template>
  <div class="navbar">
    <div class="loggedUserSection">
      {{ currUserName }}
    </div>
    <div class="routesSection">
      <router-link to="/">Chat room</router-link> |
      <router-link to="/login">Login</router-link>
    </div>
    <div class="logOutBtn" @click="logOut">log out</div>
  </div>
</template>

<script>
  import { mapActions, mapGetters } from 'vuex';
  import { Auth } from 'aws-amplify';

  export default {
    name: "Navbar",
    data() {
      return {
        currUserName: ''
      }
    },
    created() {
      this.currUserName = this.getCurrentUser();
    },
    methods: {
      ...mapGetters({ getCurrentUser: 'user/getCurrentUser' }),
      ...mapActions({ removeCurrentUser: 'user/removeCurrentUser' }),
      async logOut() {
        try {
          await Auth.signOut();
          this.removeCurrentUser();
          this.$router.push('/login');
        } catch (error) {
          console.log('error signing out: ', error);
        }
      }
    },
  }
</script>
<style lang="scss">
  .navbar {
    height: 20%;
    background-color: lightgreen;
    overflow-x: hidden;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    .loggedUserSection {
      color: $black;
    }
    a {
      font-weight: bold;
      color: #2c3e50;

      &.router-link-exact-active {
        color: #42b983;
      }
    }
    .routesSection {
    }
    .logOutBtn {
      display: flex;
      cursor: pointer;
      border: 1px $black solid;
      justify-self: center;
    }
  }
</style>
