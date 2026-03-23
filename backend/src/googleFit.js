require("dotenv").config(); // Load env vars for local development
const { google } = require("googleapis");

// NOTE: You must set these in your environment for real OAuth to work:
const CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
GOOGLE_FIT_REDIRECT_URI =
  process.env.GOOGLE_FIT_REDIRECT_URI ||
  "http://localhost:5000/auth/google/callback";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_FIT_CLIENT_ID || "",
  process.env.GOOGLE_FIT_CLIENT_SECRET || "",
  GOOGLE_FIT_REDIRECT_URI || "http://localhost:5000/auth/google/callback"
)
const GOOGLE_FIT_SCOPES = [
  "https://www.googleapis.com/auth/fitness.activity.read",
  "https://www.googleapis.com/auth/fitness.sleep.read",
  // If you later want to write fitness data:
  // "https://www.googleapis.com/auth/fitness.activity.write",
];

const fitness = google.fitness({
  version: "v1",
  auth: oauth2Client,
});

module.exports = { oauth2Client, fitness, GOOGLE_FIT_SCOPES, GOOGLE_FIT_REDIRECT_URI };