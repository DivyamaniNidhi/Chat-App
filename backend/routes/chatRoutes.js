const express = require("express");
const { protect } = require("../middleware/authMiddleware.js");
const {
  accessChat,
  fetchChats,
  createGroupChat,
  renameGroup,
  addToGroup,
  removeFromGroup,
} = require("../controllers/chatControllers.js");

const router = express.Router();

router.route("/").post(protect, accessChat); //to create or access chat
router.route("/").get(protect, fetchChats); //to fetch chats for that user
router.route("/group").post(protect, createGroupChat); //create group chat
router.route("/rename").put(protect, renameGroup); //put - bcz we are making change
router.route("/groupremove").put(protect, removeFromGroup); //remove user from the group
router.route("/groupadd").put(protect, addToGroup); //add user to the group

module.exports = router;
