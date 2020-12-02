<template>
  <div class="chat">
    <Chat />
  </div>
</template>

<script>
  import Chat from '@/components/Chat.vue';
  export default {
    name: 'ChatRoom',
    components:
    {
      Chat
    }
  }
</script>
<style lang="scss" scoped>
  .chat {
    width: 100%;
    height: 80%;
    position: relative;
    display: flex;
    align-self: center;
  }

  @media screen and (min-width: 1200px) {
    .chat {
      width: 80%;
    }
  }

  @media screen and (min-width: 1500px) {
    .chat {
      width: 60%;
    }
  }
</style>
