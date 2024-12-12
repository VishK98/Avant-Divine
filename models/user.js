const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  phoneNumber: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
  },
  otpExpires: {
    type: Date,
  },
  otpVerified: {
    type: Boolean,
    default: false,
  },
  isLoggedIn: {
    type: Boolean,
    default: false, // Default to false during registration
  },
});

module.exports = mongoose.model("User", userSchema);
