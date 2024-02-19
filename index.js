const express = require("express");
const app = express();
const http = require("http");
const cors = require("cors");
const { Server } = require("socket.io");
app.use(cors());

const server = http.createServer(app);

const io = new Server(server, {
  cors: {
    origin: "*",
    // origin: "http://localhost:3000",
    credentials: true,
    methods: ["GET", "POST"],
  },
});

const users = new Set();

io.on("connection", (socket) => {
  console.log(`User Connected: ${socket.id}`);

  socket.on("join_room", (data, callBack) => {
    socket.join(data);
    console.log(`User with ID: ${socket.id} joined room: ${data}`);
    users.add(socket.id);
    console.log(users);
    callBack(users.size > 1);
  });

  socket.on("leave_room", (data, callBack) => {
    socket.leave(data);
    console.log(`User with ID: ${socket.id} leaved room: ${data}`);
    users.delete(socket.id);
  });

  socket.on("send_message", (data) => {
    socket.to(data.room).emit("receive_message", data);
  });

  socket.on("disconnect", () => {
    console.log("User Disconnected", socket.id);
    users.delete(socket.id);
  });
});

server.listen(3001, () => {
  console.log("SERVER RUNNING");
});

const socket = io.connect("http://localhost:3001");
