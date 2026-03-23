const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoute.js");
const playerRoutes = require("./routes/playerRoutes.js");
const playerAssessmentsRouter = require("./routes/playerAssessments.js"); // ✅ Added assessments route
const trainingRoutes = require("./routes/trainingRoutes.js");
const dashBoard = require("./routes/dashBoard.js");
const playerDashboardRoutes = require("./routes/playerDashboard");
const trainingSubmissionsRoutes = require("./routes/trainingSubmissions");
const routes = require("./routes/trainerRoutes");
const usersRoutes = require("./routes/usersRoutes");
const logRoutes = require("./routes/logRoutes");
const analyticsRoute = require("./routes/analyticsRoute");
const googleFitRoutes = require("./routes/googleFitRoutes");

const trainermsg = require("./routes/trainersendmsg");
const playermsg = require("./routes/playergetmsg");

const app = express();

app.use(cors());
app.use(express.json());


app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ limit: "10mb", extended: true }));

app.use("/api/auth", authRoutes);
app.use("/api/player", playerRoutes); // existing player routes
app.use("/api/assessments", playerAssessmentsRouter); // ✅ assessments routes
app.use("/api/training-sessions", trainingRoutes); // ✅ corrected route prefix for consistency
app.use("/api/playerdashboard", playerDashboardRoutes);
app.use("/api/dashboard", dashBoard);
app.use("/api/training-submissions", trainingSubmissionsRoutes);
app.use("/api/trainer", routes);
app.use("/api/users", usersRoutes);
app.use("/api/analytics", analyticsRoute);

app.use("/api/logs", logRoutes);

app.use("/api", trainermsg);
app.use("/api", playermsg);

// Google Fit OAuth + Fit API endpoints
app.use("/", googleFitRoutes);


if (process.env.NODE_ENV !== "test") {
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
}
module.exports = app; 