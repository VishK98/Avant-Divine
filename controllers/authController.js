const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const User = require("../models/user");
const sendEmail = require("../utils/sendEmail");

// Register new user
const registerUser = async (req, res) => {
  const { name, email, phoneNumber, password } = req.body;

  try {
    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Generate OTP
    const otp = crypto.randomInt(100000, 999999).toString();
    const otpExpires = new Date();
    otpExpires.setMinutes(otpExpires.getMinutes() + 10);

    // Create new user
    const newUser = new User({
      name,
      email,
      phoneNumber,
      password: hashedPassword,
      otp,
      otpExpires,
    });

    await newUser.save();

    // Send OTP email
    const subject = "Your OTP for Account Verification";
    const text = `Your OTP is: ${otp}. It will expire in 10 minutes.`;
    await sendEmail(email, subject, text);

    res.status(201).json({
      message:
        "User registered successfully. Please check your email for OTP verification.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// OTP Verification
const verifyOtp = async (req, res) => {
  const { email, otp, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (new Date() > new Date(user.otpExpires))
      return res.status(400).json({ message: "OTP has expired" });

    if (user.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    if (user.otpVerified)
      return res.status(400).json({ message: "OTP already verified" });

    user.otpVerified = true;

    if (password) {
      const hashedPassword = await bcrypt.hash(password, 10);
      user.password = hashedPassword;
    }

    await user.save();

    res.status(200).json({
      message: "OTP verified successfully. You can now log in.",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User login
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (!user.otpVerified)
      return res.status(400).json({ message: "Please verify your OTP first" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(400).json({ message: "Invalid credentials" });

    // Set isLoggedIn to true
    user.isLoggedIn = true;
    await user.save();

    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.status(200).json({ message: "Login successful", token });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// User logout
const logoutUser = async (req, res) => {
  const { email } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Set isLoggedIn to false
    user.isLoggedIn = false;
    await user.save();

    res.status(200).json({ message: "Logout successful" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { registerUser, verifyOtp, loginUser, logoutUser };
