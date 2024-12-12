// routes/authRoutes.js

const express = require("express");
const {
  registerUser,
  verifyOtp,
  loginUser,
  logoutUser,
} = require("../controllers/authController");

const router = express.Router();

// Register route
router.post("/signup", registerUser);

// OTP verification route
router.post("/verify-otp", verifyOtp);

// Login route
router.post("/signin", loginUser);

router.post("/logout", logoutUser);

module.exports = router;
