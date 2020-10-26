<template>
  <div>
    <div v-for="(message, index) of messages" :key="index">
      {{ index }}-{{ message }}
    </div>
    <input @keyup.enter="addNewMsg(message)" v-model="message" type="text" />
    <button :disabled="btnDisabled" @click="addNewMsg(message)">send</button>
  </div>
</template>

<script>
  import io from "socket.io-client";
  export default {
    name: "Chat",
    data() {
      return {
        socket: {},
        messages: [],
        message: "",
        welcomeMessage: "",
        userEnteredNotification: "",
      };
    },
    created() {
      this.socket = io("http://localhost:3000");
    },
    mounted() {
      this.socket.on("message", (data) => {
        console.log(data);
        if (data instanceof Array) {
          this.messages = data;
        } else {
          this.messages.push(data);
        }
      });
    },
    methods: {
      addNewMsg(msg) {
        this.socket.emit("addMessage", msg);
        this.message = "";
      },
    },
    computed: {
      btnDisabled() {
        return !this.message;
      },
    },
  };
</script>

<style scoped>
</style>
