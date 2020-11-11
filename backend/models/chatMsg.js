const mongoose = require("mongoose");

const ChatMsg = mongoose.model(
  "ChatMsg",
  new mongoose.Schema({
    message: {
      type: String,
    },
    sender: {
      type: String,
    },
  }),
);

exports.ChatMsg = ChatMsg;
