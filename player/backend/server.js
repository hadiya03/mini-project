const express = require("express");
const app = express();
const db = require("./db"); // ⬅️ DB connection import

app.use(express.json());

// Test DB connection on server start
db.query("SELECT 1")
  .then(() => console.log("✅ Database is ready"))
  .catch((err) => {
    console.error("❌ Database connection failed", err);
    process.exit(1);
  });

app.use("/player", require("./routes/player.routes"));

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
