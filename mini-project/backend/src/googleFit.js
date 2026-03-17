const { google } = require("googleapis");

const oauth2Client = new google.auth.OAuth2(
  "CLIENT_ID",
  "CLIENT_SECRET",
  "http://localhost:5000/auth/google/callback"
);

const fitness = google.fitness({
  version: "v1",
  auth: oauth2Client
});

module.exports = { oauth2Client, fitness };