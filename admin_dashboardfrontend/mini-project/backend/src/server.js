const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoute.js");
const playerRoutes = require("./routes/playerRoutes.js");
const playerAssessmentsRouter = require("./routes/playerAssessments.js"); // ✅ Added assessments route
const trainingRoutes = require("./routes/trainingRoutes.js");
const dashBoard = require("./routes/dashBoard.js");

const app = express();

app.use(cors());
app.use(express.json());

// Auth routes
app.use("/api/auth", authRoutes);
app.use("/api/player", playerRoutes); // existing player routes
app.use("/api/assessments", playerAssessmentsRouter); // ✅ assessments routes
app.use("/api/training-sessions", trainingRoutes); // ✅ corrected route prefix for consistency
app.use("/api/dashboard", dashBoard);

app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});