const express = require("express");
const dotenv = require("dotenv");
const connectDB = require("./config/db");
const userRoutes = require("./routes/userRoutes.js");
const chatRoutes = require("./routes/chatRoutes.js");
const messageRoutes = require("./routes/messageRoutes.js");
const { notFound, errorHandler } = require("./middleware/errorMiddleware.js");

dotenv.config();
connectDB();
const app = express();

app.use(express.json()); //to accept json data

const PORT = process.env.PORT || 5000;

app.get("/", (req, res) => {
  res.send("API is running");
});

app.use("/api/user", userRoutes);
app.use("/api/chat", chatRoutes);
app.use("/api/message", messageRoutes);

app.use(notFound);
app.use(errorHandler);

const server = app.listen(PORT, console.log(`Server started on port ${PORT}`));

const io = require("socket.io")(server, {
  pingTimeout: 60000,
  cors: {
    origin: "http://localhost:3000",
  },
});

io.on("connection", (socket) => {
  console.log("Connected to socket.io");

  //creating a new socket where the front end will send some data and will join a room
  //userData is coming from frontend
  socket.on("setup", (userData) => {
    socket.join(userData._id); //creating new room with the id of the user data which will be exclusive to that particular user only
    // console.log(userData._id);
    socket.emit("connected");
  });

  //joining a chat room
  socket.on("join chat", (room) => {
    socket.join(room);
    console.log("User joined room : " + room);
  });

  socket.on("typing", (room) => socket.in(room).emit("typing"));
  socket.on("stop typing", (room) => socket.in(room).emit("stop typing"));
  //send message functionality
  socket.on("new message", (newMessageRecieved) => {
    var chat = newMessageRecieved.chat;

    if (!chat.users) return console.log("chat.users not defined"); //if the chat doesn't have any users

    //message should be recieved to other users except the one who send it
    chat.users.forEach((user) => {
      if (user._id == newMessageRecieved.sender._id) return;

      socket.in(user._id).emit("message recieved", newMessageRecieved);
    });
  });

  //turn off the socket, otherwise it will consume a lot of bandwidth
  socket.off("setup", () => {
    console.log("USER DISCONNECTED");
    socket.leave(userData._id);
  });
});
