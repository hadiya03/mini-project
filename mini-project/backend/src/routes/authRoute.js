const express = require("express");
const router = express.Router();
const {
  register,
  verifyOtp,
  login,logout,
  forgotPassword,
  resetPassword
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
router.post("/logout", logout);

module.exports = router;