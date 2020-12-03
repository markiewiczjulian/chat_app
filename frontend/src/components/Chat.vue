<template>
  <div class="chatContainer">
    <div class="messagesContainer">
      <SingleMessage
        v-for="(message, index) of messages"
        :message="message"
        :currentUserName="currUserName"
        :key="index"
      />
    </div>
    <div v-show="this.userTypingInfo.length" class="userInfo">
      {{ this.userTypingInfo }}
    </div>
    <div>
      <InputSection
        @typing="emitTypingInfo($event)"
        @sendMsg="sendMessage($event)"
      />
    </div>
  </div>
</template>

<script>
  import io from "socket.io-client";
  import SingleMessage from './SingleMessage.vue';
  import InputSection from './InputSection';
  export default {
    name: "Chat",
    data() {
      return {
        socket: {},
        messages: [],
        userTypingInfo: "",
        currUserName: ""
      };
    },
    components: {
      SingleMessage,
      InputSection
    },
    created() {
      this.socket = io("http://localhost:5001/");
    },
    mounted() {
      this.axios.get("http://localhost:5001/chatRoom").then((res) => {
        res.data.map((el) => {
          el.message = this.parseEmoji(el.message);
        });
        this.messages = res.data;
      });

      this.socket.on("receivedMessage", (data) => {
        data.message = this.parseEmoji(data.message);
        this.messages.push(data);
        this.userTypingInfo = "";
      });

      this.socket.on("notifyStopTyping", () => {
        console.log("STOPPED TYPING");
        this.userTypingInfo = "";
      });

      this.socket.on("notifyTyping", (user) => {
        console.log("TYPING");
        this.userTypingInfo = `${user} is typing right now...`;
      });
    },
    methods: {
      sendMessage(message) {
        // add current user name to the store and get here
        this.socket.emit("addedMessage", message, this.currUserName);
      },
      emitTypingInfo(event) {
        if (event) {
          // add current user name to the store and get here
          this.socket.emit("typing", this.currUserName);
        } else {
          // add current user name to the store and get here
          this.socket.emit("stoppedTyping", this.currUserName);
        }
      }
    }
  };
</script>

<style lang="scss">
  .chatContainer {
    height: 80%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-self: center;
    padding-bottom: 10px;
    // TODO
    .messagesContainer {
      padding: 0 20px;
      overflow-y: scroll;
      overflow-x: hidden;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .userInfo {
      position: absolute;
      bottom: 0;
      width: 100%;
      color: red;
    }
  }

  @media screen and (min-width: 1200px) {
    .chatContainer {
      width: 80%;
    }
  }

  @media screen and (min-width: 1500px) {
    .chatContainer {
      width: 60%;
    }
  }
</style>
