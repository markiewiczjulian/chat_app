<template>
  <div>
    <div v-for="(message, index) of messages" :key="index">
      {{ index }}-{{ idToTimestamp(message._id) }}-{{ message }}
    </div>
    <div v-show="this.userTypingInfo.length" class="userInfo">
      {{ this.userTypingInfo }}
    </div>
    <div class="inputSection">
      <button @click="this.toggleEmojiPanel">emoji</button>
      <VEmojiPicker
        class="emojiPanel"
        :class="[emojiPanelOpen ? 'opened' : 'closed']"
        @select="selectEmoji"
      />
      <input @keyup.enter="addNewMsg(message)" v-model="message" type="text" />
      <button :disabled="btnDisabled" @click="addNewMsg(message)">send</button>
    </div>
  </div>
</template>

<script>
  import io from "socket.io-client";
  import objectIdToTimestamp from "objectid-to-timestamp";
  import emoji from "node-emoji";
  import { VEmojiPicker } from "v-emoji-picker";

  export default {
    name: "Chat",
    data() {
      return {
        socket: {},
        messages: [],
        message: "",
        userTypingInfo: "",
        emojiPanelOpen: false,
      };
    },
    components: {
      VEmojiPicker,
    },
    created() {
      this.socket = io("http://localhost:3000/");
    },
    mounted() {
      this.axios.get("http://localhost:3000/chatRoom").then((res) => {
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
        this.socket.emit("addedMessage", this.unparseEmoji(msg));
        this.message = "";
        this.emojiPanelOpen = false;
      },
      idToTimestamp(id) {
        //   toLocaleString powinno zadziałać z pudełka bez żadnego łątania stringami
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
  .userInfo {
    color: red;
  }
  .inputSection {
    position: relative;
    .emojiPanel {
      position: absolute;
      bottom: 0;
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
</style>
