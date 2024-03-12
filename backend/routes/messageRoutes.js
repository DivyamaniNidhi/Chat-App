const express = require("express");
const { protect } = require("../middleware/authMiddleware");
const {
  sendMessage,
  allMessages,
} = require("../controllers/messageControllers");

const router = express.Router();

router.route("/").post(protect, sendMessage); //api to send messages
router.route("/:chatId").get(protect, allMessages); //to fetch all the messages of a chat

module.exports = router;
