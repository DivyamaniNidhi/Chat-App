const asyncHandler = require("express-async-handler");
const Chat = require("../models/chatModel");
const User = require("../models/userModel");
const { json } = require("express");

// To create or access one on one chat ----------------------------------------------------------------------//
const accessChat = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  //if user if doesn't exist
  if (!userId) {
    console.log("User Id params not sent with request");
    return res.sendStatus(400);
  }

  //if chat with this user exists
  var isChat = await Chat.find({
    isGroupChat: false, //it should not be a group chat
    $and: [
      //find both user, one which is logged in and other with whom the user want to do chat
      { users: { $elemMatch: { $eq: req.user._id } } }, //logged in user
      { users: { $elemMatch: { $eq: userId } } }, //with whom user want to do chat
    ],
  })
    .populate("users", "-password")
    .populate("latestMessage"); //to get all the info related to that user (except password) and latestMessage

  isChat = await User.populate(isChat, {
    //populate sender name, email and pic of the sender of latestMessage
    path: "latestMessage.sender",
    select: "name pic email",
  });

  if (isChat.length > 0) {
    //if chat exists btw these two users
    res.send(isChat[0]);
  } else {
    //create chat
    var chatData = {
      chatName: "sender",
      isGroupChat: false,
      users: [req.user._id, userId],
    };
    //now query and store above info in database
    try {
      const createdChat = await Chat.create(chatData); //chat created
      const FullChat = await Chat.findOne({
        _id: createdChat._id,
      }).populate("users", "-password"); //send the chat to logged in user
      res.status(200).json(FullChat);
    } catch (error) {
      res.status(400);
      throw new Error(error.message);
    }
  }
});

//To fetch all the chats of loggedIn user --------------------------------------------------------------//
const fetchChats = asyncHandler(async (req, res) => {
  try {
    Chat.find({ users: { $elemMatch: { $eq: req.user._id } } })
      .populate("users", "-password")
      .populate("groupAdmin", "-password")
      .populate("latestMessage")
      .sort({ updatedAt: -1 })
      .then(async (results) => {
        results = await User.populate(results, {
          path: "latestMessage.sender",
          select: "name pic email",
        });
        res.status(200).send(results);
      });
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//To create Group Chat --------------------------------------------------------------------------------------//
const createGroupChat = asyncHandler(async (req, res) => {
  //if not selected users or not given name to the group
  if (!req.body.users || !req.body.name) {
    return res.status(400).send({ message: "Please fill all the fields!" });
  }

  //just need an array of users and name for the group
  var users = JSON.parse(req.body.users);

  if (users.length < 2) {
    return res
      .status(400)
      .send({ message: "More than 2 users are required to form a group chat" });
  }

  users.push(req.user); //push loggedin user with the selected users in to the group

  try {
    const groupChat = await Chat.create({
      chatName: req.body.name,
      users: users,
      isGroupChat: true,
      groupAdmin: req.user,
    });
    //fetch this group chat from our DB and send it back to our user
    const fullGroupChat = await Chat.findOne({ _id: groupChat._id })
      .populate("users", "-password")
      .populate("groupAdmin", "-password");

    res.status(200).json(fullGroupChat);
  } catch (error) {
    res.status(400);
    throw new Error(error.message);
  }
});

//To rename the Group --------------------------------------------------------------------------------//
const renameGroup = asyncHandler(async (req, res) => {
  const { chatId, chatName } = req.body;

  const updatedChat = await Chat.findByIdAndUpdate(
    chatId,
    {
      chatName, // (chatName : chatName --> since the key and value are same we can write this way also)
    },
    {
      new: true, //if not do this, it will give old name of the chat
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!updatedChat) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(updatedChat);
  }
});

//To Add new user to the existed group -------------------------------------------------------------------//
const addToGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const added = await Chat.findByIdAndUpdate(
    chatId,
    {
      $push: { users: userId }, //push new user to the users array
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!added) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(added);
  }
});

//To remove a user from the existed group -------------------------------------------------------------------//
const removeFromGroup = asyncHandler(async (req, res) => {
  const { chatId, userId } = req.body;

  const removed = await Chat.findByIdAndUpdate(
    chatId,
    {
      $pull: { users: userId },
    },
    {
      new: true,
    }
  )
    .populate("users", "-password")
    .populate("groupAdmin", "-password");

  if (!removed) {
    res.status(404);
    throw new Error("Chat Not Found");
  } else {
    res.json(removed);
  }
});

module.exports = {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
};
