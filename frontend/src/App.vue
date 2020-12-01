<template>
  <amplify-authenticator>
    <div>
      <amplify-sign-out></amplify-sign-out>
      <Chat />
    </div>
  </amplify-authenticator>
</template>

<script>
  import Chat from "./components/Chat.vue";

  export default {
    name: "App",
    components: {
      Chat,
    },
  };
</script>

<style lang="scss">
  amplify-button.hydrated .button {
    background-color: red;
  }
</style>
