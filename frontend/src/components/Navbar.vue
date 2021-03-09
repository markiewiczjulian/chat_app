<template>
  <div class="navbar">
    <div class="content">
      <div class="loggedUserSection">
        <img :src="getAvatarPath()" alt="" class="avatar" />
        <p class="name">{{ currUserName }}</p>
      </div>
      <font-awesome-icon
        class="logOutBtn"
        @click="logOut"
        :icon="['fas', 'power-off']"
      />
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
      ...mapGetters({ getCurrentUser: 'user/getCurrentUser', getCurrentUserAvatar: 'user/getCurrentUserAvatar' }),
      ...mapActions({ removeCurrentUser: 'user/removeCurrentUser' }),
      async logOut() {
        try {
          await Auth.signOut();
          this.removeCurrentUser();
          this.$router.push('/login').catch(() => { });;
        } catch (error) {
          console.log('error signing out: ', error);
        }
      },
      getAvatarPath() {
        const avatarNum = this.getCurrentUserAvatar() || "1";
        return require(`../assets/avatars/${avatarNum}.svg`);
      }
    },
  }
</script>
<style lang="scss">
  .navbar {
    height: 15%;
    background-color: $powder-blue;
    overflow-x: hidden;
    display: flex;
    justify-content: center;
    z-index: 2;
    box-shadow: 0 5px 10px $black-coral;
    color: $white;
    .content {
      padding: 0 10px;
      height: 100%;
      width: 100%;
      max-width: 1200px;
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
      .loggedUserSection {
        display: flex;
        align-items: center;
        .avatar {
          height: 13vh;
          background-color: $white;
          border-radius: 100%;
          box-shadow: 3px 3px 10px $black;
        }
        .name {
          display: none;
          font-size: $font-size-lg;
          margin-left: 10px;
        }
      }
      .logOutBtn {
        animation: pulse 2s infinite;
        font-size: $font-size-xxl;
        display: flex;
        cursor: pointer;
        justify-self: center;
        &:hover {
          animation-play-state: paused;
        }
      }
    }
  }
  @media screen and (min-width: $breakpoint-s) {
    .navbar .content .loggedUserSection .name {
      display: flex;
    }
  }
</style>
