import emoji from "node-emoji";
import Vue from "vue";

Vue.mixin({
  methods: {
    onMissing(emojiName) {
      return emojiName;
    },
    parseEmoji(txt) {
      return emoji.emojify(txt, this.onMissing);
    },
    unparseEmoji(txt) {
      return emoji.unemojify(txt);
    },
  },
});
