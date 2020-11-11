<template>
  <div>
    <div v-for="(message, index) of messages" :key="index">
      {{ index }}-{{ idToTimestamp(message._id) }}-{{ message }}
    </div>
    <div v-show="this.userTypingInfo" class="userInfo">
      {{ this.userTypingInfo }}
    </div>
    <input @keyup.enter="addNewMsg(message)" v-model="message" type="text" />
    <button :disabled="btnDisabled" @click="addNewMsg(message)">send</button>
  </div>
</template>

<script>
  import io from "socket.io-client";
  import objectIdToTimestamp from "objectid-to-timestamp";

  export default {
    name: "Chat",
    data() {
      return {
        socket: {},
        messages: [],
        message: "",
        userTypingInfo: "",
      };
    },
    created() {
      this.socket = io("http://localhost:3000/");
    },
    mounted() {
      this.axios
        .get("http://localhost:3000/chatRoom")
        .then((res) => (this.messages = res.data));

      this.socket.on("receivedMessage", (data) => {
        console.log(data);
        this.messages.push(data);
      });

      this.socket.on("notifyStopTyping", () => {
        console.log("STOPPED TYPING");
        this.userTypingInfo = "";
      });

      this.socket.on("notifyTyping", (user) => {
        this.userTypingInfo = `${user} is typing right now...`;
        console.log("TYPING");
      });
    },
    watch: {
      message() {
        const user = "USERPLACEHOLDER";
        const curMessage = this.message;
        if (this.message) {
          setTimeout(() => {
            if (this.message === curMessage) {
              this.socket.emit("stoppedTyping", user);
            } else {
              this.socket.emit("typing", user);
            }
          }, 1500);
        } else {
          this.socket.emit("stoppedTyping", user);
          this.userTypingInfo = "";
        }
      },
    },
    methods: {
      addNewMsg(msg) {
        this.socket.emit("addedMessage", msg);
        this.message = "";
        this.userTypingInfo = "";
      },
      idToTimestamp(id) {
        const date = new Date(objectIdToTimestamp(id));
        return `${date.getDate()}-${
          date.getMonth() + 1
        }-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
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
  .userInfo {
    color: red;
  }
</style>
