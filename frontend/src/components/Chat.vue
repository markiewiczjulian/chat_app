<template>
  <div>
    <div class="chatContainer">
      <div class="loggedInUser">
        {{ currUserName }}
      </div>
      <div class="messagesContainer">
        <div
          v-for="(message, index) of messages"
          :key="index"
          :class="[
            message.sender === currUserName ? 'loggedUserMsg' : '',
            'singleMessage',
          ]"
        >
          <div class="authorAvatar">
            <img src="../assets/avatars/9.svg" alt="" />
          </div>
          <div class="content">
            <span class="author">
              {{ message.sender }}
            </span>
            <div class="text">{{ message.message }}</div>
            <div class="date">{{ idToTimestamp(message._id) }}</div>
          </div>
        </div>
      </div>
      <div v-show="this.userTypingInfo.length" class="userInfo">
        {{ this.userTypingInfo }}
      </div>
      <div class="inputSection">
        <span
          @click="toggleEmojiPanel"
          class="emojiBtn"
          @mouseover="emojiIcon = 'laugh-wink'"
          @mouseleave="emojiIcon = 'laugh'"
        >
          <font-awesome-icon :icon="['far', emojiIcon]" />
        </span>
        <VEmojiPicker
          class="emojiPanel"
          :class="[emojiPanelOpen ? 'opened' : 'closed']"
          @select="selectEmoji"
        />
        <input
          @keyup.enter="addNewMsg(message)"
          v-model="message"
          type="text"
          class="inputBox"
        />
        <span
          :disabled="btnDisabled"
          @click="addNewMsg(message)"
          class="sendBtn"
        >
          <font-awesome-icon :icon="['far', 'paper-plane']" />
        </span>
      </div>
    </div>
  </div>
</template>

<script>
  import io from "socket.io-client";
  import objectIdToTimestamp from "objectid-to-timestamp";
  import emoji from "node-emoji";
  import { VEmojiPicker } from "v-emoji-picker";
  import { Auth } from 'aws-amplify';

  export default {
    name: "Chat",
    data() {
      return {
        socket: {},
        messages: [],
        message: "",
        userTypingInfo: "",
        emojiPanelOpen: false,
        emojiIcon: "laugh",
        currUserName: ""
      };
    },
    components: {
      VEmojiPicker,
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
    watch: {
      message() {
        const user = "USERPLACEHOLDER";
        const curMessage = this.message;
        this.message = this.parseEmoji(this.message);
        console.log(curMessage, this.message);
        console.log("QQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQQ");
        if (this.message.length) {
          setTimeout(() => {
            if (this.message === curMessage) {
              this.socket.emit("stoppedTyping", user);
            } else {
              this.socket.emit("typing", user);
            }
          }, 500);
        } else {
          this.socket.emit("stoppedTyping", user);
        }
      },
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
      toggleEmojiPanel() {
        this.emojiPanelOpen = !this.emojiPanelOpen;
      },
      onMissing(emojiName) {
        return emojiName;
      },
      parseEmoji(txt) {
        return emoji.emojify(txt, this.onMissing);
      },
      unparseEmoji(txt) {
        return emoji.unemojify(txt);
      },
      addNewMsg(msg) {
        if (!this.btnDisabled) {
          this.socket.emit("addedMessage", this.unparseEmoji(msg), this.currUserName);
          this.message = "";
          this.emojiPanelOpen = false;
        }
      },
      idToTimestamp(id) {
        const date = new Date(objectIdToTimestamp(id));
        return `${date.getDate()}-${date.getMonth() +
          1}-${date.getFullYear()} ${date.getHours()}:${date.getMinutes()}`;
      },
      selectEmoji(emoji) {
        this.message = this.message + emoji.data;
        this.emojiPanelOpen = false;
      },
    },
    computed: {
      btnDisabled() {
        return !this.message;
      },
    },
  };
</script>

<style lang="scss">
  .chatContainer {
    font-family: Arial, Helvetica, sans-serif;
    color: $white;
    width: 100%;
    margin: auto;
    .loggedInUser {
      color: $black;
    }
    .messagesContainer {
      margin: 0 20px;
      overflow-y: scroll;
      overflow-x: hidden;
      height: calc(100vh - 100px);
      display: flex;
      flex-direction: column;
      .singleMessage {
        &.loggedUserMsg {
          background-color: $melon;
        }
        flex-direction: column;
        align-self: center;
        background-color: $powder-blue;
        padding: 20px;
        border-radius: 50px;
        margin: 20px 0;
        width: 90%;
        display: flex;
        .authorAvatar {
          margin-right: 20px;
          img {
            width: 80px;
            height: 80px;
            background-color: $white;
            box-shadow: 3px 3px 10px $black;
            border-radius: 40px;
          }
        }
        .content {
          display: flex;
          flex-direction: column;
          flex-grow: 1;
          justify-content: space-between;
          .text {
            overflow-wrap: anywhere;
            font-size: 18px;
            margin: 10px 0;
          }
          .date {
            font-size: 11px;
            text-align: end;
          }
          .author {
            font-size: 15px;
          }
        }
      }
    }
    .userInfo {
      color: red;
    }
    .inputSection {
      display: flex;
      position: relative;
      height: 50px;
      justify-content: space-evenly;
      border: 3px solid $black-coral;
      border-radius: 10px;
      box-shadow: 2px 2px 7px 0px $black-coral;
      .inputBox {
        width: 90%;
        border: none;
        outline: none;
        font-size: 20px;
        &:focus {
          outline: none;
        }
      }
      .sendBtn {
        cursor: pointer;
        color: $black-coral;
        display: flex;
        align-items: center;
        height: 100%;
        &:hover {
          animation: shake-animation 0.82s both;
          transform: translate3d(0, 0, 0);
        }
        svg {
          font-size: 40px;
        }
      }
      .emojiBtn {
        cursor: pointer;
        color: $black-coral;
        display: flex;
        align-items: center;
        height: 100%;
        &:hover {
          transform: rotate(0deg);
          animation: rotate-animation 0.82s infinite;
        }
        svg {
          font-size: 40px;
        }
      }
      .emojiPanel {
        position: absolute;
        bottom: 50px;
        left: 0;
        transition: all 0.3s ease-in-out;
        &.opened {
          opacity: 1;
        }
        &.closed {
          opacity: 0;
          height: 0;
        }
      }
    }
  }

  @media screen and (min-width: 600px) {
    .chatContainer {
      .messagesContainer .singleMessage {
        width: 80%;
        align-self: flex-start;
        flex-direction: row;
        &.loggedUserMsg {
          align-self: flex-end;
        }
      }
    }
  }

  @media screen and (min-width: 1200px) {
    .chatContainer {
      width: 80%;
      .messagesContainer .singleMessage {
        width: 60%;
      }
    }
  }

  @media screen and (min-width: 1500px) {
    .chatContainer {
      width: 60%;
    }
  }
</style>
