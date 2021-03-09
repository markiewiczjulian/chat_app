<template>
  <div class="chatContainer">
    <div class="messagesContainer" v-on:scroll="handleScroll">
      <SingleMessage
        v-for="(message, index) of messages"
        :message="message"
        :key="index"
      />
    </div>
    <div>
      <InputSection
        @typing="emitTypingInfo($event)"
        @sendMsg="sendMessage($event)"
      />
    </div>
    <div class="additionalControls">
      <div
        v-if="showToBottomBtn"
        class="moveToBottomBtn"
        @click="this.scrollToBottom"
      >
        <font-awesome-icon :icon="['fas', 'arrow-down']" />
      </div>
      <div v-show="this.userTypingInfo.length" class="userInfo">
        {{ this.userTypingInfo }}
      </div>
    </div>
  </div>
</template>

<script>
  import io from "socket.io-client";
  import SingleMessage from '@/components/SingleMessage.vue';
  import InputSection from '@/components/InputSection';
  import { mapGetters } from 'vuex';

  export default {
    name: "Chat",
    data() {
      return {
        socket: {},
        messages: [],
        userTypingInfo: "",
        currUserName: "",
        showToBottomBtn: false
      };
    },
    components: {
      SingleMessage,
      InputSection
    },
    created() {
      this.socket = io("http://localhost:5002/");
    },
    mounted() {
      this.axios.get("http://localhost:5002/chatRoom").then((res) => {
        res.data.map((el) => {
          el.message = this.parseEmoji(el.message);
        });
        this.messages = res.data;
        this.scrollToBottom();
        this.currUserName = this.getCurrentUser();
      });

      this.socket.on("receivedMessage", (data) => {
        data.message = this.parseEmoji(data.message);
        this.messages.push(data);
        this.showToBottomBtn = true;
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
      ...mapGetters({ getCurrentUser: 'user/getCurrentUser' }),
      handleScroll($event) {
        this.showToBottomBtn = $event.target.scrollTop < $event.target.scrollHeight - ($event.target.clientHeight + 50);
      },
      sendMessage(message) {
        this.socket.emit("addedMessage", message, this.currUserName);
      },
      scrollToBottom() {
        let messagesContainer = document.getElementsByClassName("messagesContainer");
        if (messagesContainer.length) {
          setTimeout(() => {
            messagesContainer[ 0 ].scrollTop = messagesContainer[ 0 ].scrollHeight - messagesContainer[ 0 ].clientHeight;
          }, 100);
        }
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
    max-width: 1200px;
    height: 85%;
    width: 100%;
    display: flex;
    flex-direction: column;
    align-self: center;
    padding-bottom: 10px;
    .messagesContainer {
      padding: 0 20px;
      overflow-y: scroll;
      overflow-x: hidden;
      height: 100%;
      display: flex;
      flex-direction: column;
    }
    .additionalControls {
      display: flex;
      position: absolute;
      bottom: 10%;
      left: 0;
      right: 0;
      flex-direction: column;
      .userInfo {
        position: relative;
        bottom: 0;
        width: 100%;
        color: $white;
        background-color: $melon;
        box-shadow: 1px 1px 6px $grey;
        display: flex;
        width: max-content;
        align-self: center;
        padding: 5px;
        border-radius: 10px;
      }
      .moveToBottomBtn {
        position: relative;
        left: 50%;
        transform: translate(-50%, 0);
        color: $white;
        background-color: $melon;
        border-radius: 50%;
        width: 50px;
        height: 50px;
        margin-bottom: 10px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: $font-size-xl;
        cursor: pointer;
        box-shadow: 1px 1px 6px $grey;
        &:hover {
          background-color: $light-melon;
          transition: background-color 0.2s ease-in-out;
        }
      }
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
