const express = require("express");
const { ChatMsg } = require("../models/chatMsg");
const router = express.Router();

/* GET all chat messages */
router.get("/", async (req, res) => {
  const chatMsg = await ChatMsg.find();
  res.send(chatMsg);
});

module.exports = router;
