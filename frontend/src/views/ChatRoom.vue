<template>
  <div class="chat">
    <Navbar />
    <Chat />
  </div>
</template>

<script>
  import Chat from '@/components/Chat';
  import Navbar from '@/components/Navbar';
  export default {
    name: 'ChatRoom',
    components:
    {
      Chat, Navbar
    }
  }
</script>
<style lang="scss" scoped>
  .chat {
    width: 100%;
    height: 100%;
    position: relative;
    display: flex;
    flex-direction: column;
    align-self: center;
  }
</style>
