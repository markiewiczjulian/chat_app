<template>
  <div class="chatContainer">
    <div class="loggedInUser">
      {{ currUserName }}
    </div>
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
  import { Auth } from 'aws-amplify';
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
      this.socket = io("http://localhost:5000/");
    },
    mounted() {
      this.axios.get("http://localhost:5000/chatRoom").then((res) => {
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
      this.getCurrUser();
    },
    methods: {
      async getCurrUser() {
        try {
          const user = await Auth.currentUserInfo();
          this.currUserName = user.attributes.email;
        } catch (error) {
          console.log('error signing up:', error);
        }
      },
      sendMessage(message) {
        this.socket.emit("addedMessage", message, this.currUserName);
      },
      emitTypingInfo(event) {
        if (event) {
          this.socket.emit("typing", this.currUserName);
        } else {
          this.socket.emit("stoppedTyping", this.currUserName);
        }
      }
    }
  };
</script>

<style lang="scss">
  .chatContainer {
    height: 100%;
    .loggedInUser {
      // TODO
      color: $black;
      position: absolute;
      top: 20px;
    }
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
</style>
