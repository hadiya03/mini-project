const express = require("express");
const router = express.Router();
const {
  register,
  verifyOtp,
  login,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController.js");

// Register → Send OTP
router.post("/s", register);

// Verify OTP
router.post("/verify-otp", verifyOtp);

// Login
router.post("/l", login);

// Forgot Password
router.post("/forgot-password", forgotPassword);

// Reset Password
router.post("/reset-password", resetPassword);

module.exports = router;