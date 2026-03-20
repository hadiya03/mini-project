const express = require("express");
const router = express.Router();

const {
  startGoogleAuth,
  googleAuthCallback,
  getGoogleFitData,
} = require("../controllers/googleFitController");

// OAuth login flow for Google Fit
router.get("/auth/google", startGoogleAuth);
router.get("/auth/google/callback", googleAuthCallback);

// App API used by the frontend
router.get("/api/googlefit/data", getGoogleFitData);

module.exports = router;

