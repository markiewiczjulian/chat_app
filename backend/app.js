//require the express module
const express = require("express");
const app = express();
const http = require("http").createServer(app);
const chatRouter = require("./routes/chatMsg");
const socketio = require("socket.io");
const cors = require("cors");
if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const port = process.env.PORT || 4000;
const { ChatMsg } = require("./models/chatMsg");
const connect = require("./dbconnect");
const io = socketio(http);

app.use(cors());
app.use("/chatRoom", chatRouter);

io.on("connection", (socket) => {
  console.log("user connected");

  socket.on("disconnected", function () {
    console.log("user disconnected");
  });

  socket.on("typing", (data) => {
    socket.broadcast.emit("notifyTyping", data);
  });

  socket.on("stoppedTyping", (data) => {
    socket.broadcast.emit("notifyStopTyping", data);
  });

  socket.on("addedMessage", (msg) => {
    console.log("message: " + msg);

    connect.then((db) => {
      console.log("connected correctly to the server");
      let chatMessage = new ChatMsg({ message: msg, sender: "Anonymous" });

      chatMessage.save();
      io.emit("receivedMessage", chatMessage);
    });
  });
});

http.listen(port, () => {
  console.log("Running on Port: " + port);
});
