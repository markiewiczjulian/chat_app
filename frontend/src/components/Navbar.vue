<template>
  <div class="navbar">
    <div class="content">
      <div class="loggedUserSection">
        {{ currUserName }}
      </div>
      <div class="logOutBtn" @click="logOut">log out</div>
    </div>
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
    background-color: $melon;
    overflow-x: hidden;
    display: flex;
    justify-content: center;
    z-index: 2;
    box-shadow: 0 5px 10px $black-coral;
    color: $white;
    .content {
      height: 100%;
      width: 100%;
      max-width: 1200px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      .loggedUserSection {
      }
      .logOutBtn {
        display: flex;
        cursor: pointer;
        border: 1px $black solid;
        justify-self: center;
      }
    }
  }
</style>
