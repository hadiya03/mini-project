require("dotenv").config(); // Load env vars for local development
const { google } = require("googleapis");

// NOTE: You must set these in your environment for real OAuth to work:
// - GOOGLE_FIT_CLIENT_ID
// - GOOGLE_FIT_CLIENT_SECRET
const GOOGLE_FIT_REDIRECT_URI =
  process.env.GOOGLE_FIT_REDIRECT_URI ||
  "http://localhost:5000/auth/google/callback";

const oauth2Client = new google.auth.OAuth2(
  process.env.GOOGLE_FIT_CLIENT_ID || "clientid",
  process.env.GOOGLE_FIT_CLIENT_SECRET || "client-secret-placeholder",
  GOOGLE_FIT_REDIRECT_URI||"localhost-redirect-placeholder"
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