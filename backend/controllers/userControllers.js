//Registration and Authentication of User

const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
const generateToken = require("../config/generateToken.js");

//To resister User --------------------------------------------------------------------------------------//
const registerUser = asyncHandler(async (req, res) => {
  const { name, email, password, pic } = req.body;

  //if name, email, password not defined, give error
  if (!name || !email || !password) {
    res.status(400);
    throw new Error("Please enter all the required fields");
  }

  //check if the user already exists (using email) in our database or not
  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error("User already Exists!");
  }

  //create new user
  const user = await User.create({
    name,
    email,
    password,
    pic,
  });

  if (user) {
    res.status(201).json({
      _id: user.id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Failed to create the User!");
  }
});

//To authorize the User --------------------------------------------------------------------------------------//
const authUser = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    res.status(400);
    throw new Error("Enter all the required fields!");
  }

  const user = await User.findOne({ email });

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user.id,
      name: user.name,
      email: user.email,
      pic: user.pic,
      token: generateToken(user._id),
    });
  } else {
    res.status(400);
    throw new Error("Invalid email or password!");
  }
});

//To search users -----------------------------------------------------------------------------------------------------//
// /api/user?search=...  we are using query here
const allUsers = asyncHandler(async (req, res) => {
  const keyword = req.query.search
    ? {
        name: { $regex: req.query.search, $options: "i" }, // case-insensitive (i)
      }
    : {};

  const users = await User.find({ ...keyword, _id: { $ne: req.user._id } });
  res.send(users);
});

module.exports = { registerUser, authUser, allUsers };
