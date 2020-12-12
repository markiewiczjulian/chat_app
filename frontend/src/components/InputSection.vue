<template>
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
    <span :disabled="btnDisabled" @click="addNewMsg(message)" class="sendBtn">
      <font-awesome-icon :icon="['far', 'paper-plane']" />
    </span>
  </div>
</template>

<script>
  import { VEmojiPicker } from "v-emoji-picker";

  export default {
    name: "InputSection",
    data() {
      return {
        emojiPanelOpen: false,
        emojiIcon: "laugh",
        message: ""
      }
    },
    watch: {
      message() {
        const curMessage = this.message;
        this.message = this.parseEmoji(this.message);
        if (this.message.length) {
          setTimeout(() => {
            if (this.message === curMessage) {
              this.$emit('typing', false);
            } else {
              this.$emit('typing', true);
            }
          }, 500);
        } else {
          this.$emit('typing', false);
        }
      },
    },
    components: {
      VEmojiPicker
    },
    methods: {
      selectEmoji(emoji) {
        this.message = this.message + emoji.data;
        this.emojiPanelOpen = false;
      },
      addNewMsg(msg) {
        console.log(msg)
        if (!this.btnDisabled) {
          this.$emit("sendMsg", this.unparseEmoji(msg));
          this.message = "";
          this.emojiPanelOpen = false;
        }
      },
      toggleEmojiPanel() {
        this.emojiPanelOpen = !this.emojiPanelOpen;
      },
    },
    computed: {
      btnDisabled() {
        return !this.message;
      },
    },
  }
</script>

<style lang="scss" scoped>
  .inputSection {
    display: flex;
    position: relative;
    width: 98%;
    left: 0;
    right: 0;
    margin: auto;
    height: 50px;
    justify-content: space-evenly;
    border: 3px solid $black-coral;
    border-radius: 10px;
    box-shadow: 2px 2px 7px 0px $black-coral;
    .inputBox {
      width: 90%;
      border: none;
      outline: none;
      font-size: $font-size-xl;
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
        font-size: $font-size-xxl;
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
        font-size: $font-size-xxl;
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
</style>
