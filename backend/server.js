const http = require("http");
const express = require("express");
const socketio = require("socket.io");
const formatMessage = require("./utils/messages");

const app = express();
const server = http.createServer(app);
const io = socketio(server);

let messages = [];
const botName = "BOTUSER";
const userName = "TESTUSER";

io.on("connection", (socket) => {
  console.log(`New web socket connection ${new Date()}`);
  socket.emit("message", formatMessage(botName, "Welcome on chat!"));

  console.log(messages);
  if (messages && messages.length) {
    socket.emit("message", messages);
  }

  //   socket.broadcast.emit(
  //     "message",
  //     formatMessage(botName, `A user ${userName} entered the room!`),
  //   );

  socket.on("addMessage", (data) => {
    const formattedMsg = formatMessage(userName, data);
    messages.push(formattedMsg);
    io.emit("message", formattedMsg);
  });

  //   socket.on("disconnect", () => {
  //     io.emit(
  //       "message",
  //       formatMessage(botName, `User ${userName} has left the chat`),
  //     );
  //   });
});

const PORT = process.env.PORT || 3000;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(messages);
});
