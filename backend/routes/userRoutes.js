const express = require("express");
const {
  registerUser,
  authUser,
  allUsers,
} = require("../controllers/userControllers.js");
const { protect } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.route("/").post(registerUser).get(protect, allUsers); //protect is used so that only logged in user can go to that route
router.post("/login", authUser);

module.exports = router;
