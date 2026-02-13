require("dotenv").config(); // Load environment variables
const { Pool } = require("pg");

// Create PostgreSQL connection pool
const db = new Pool({
  user: process.env.DB_USER || "postgres",
  host: process.env.DB_HOST || "localhost",
  database: process.env.DB_NAME || "mern_db",
  password: process.env.DB_PASSWORD || "hadiyamk",
  port: process.env.DB_PORT || 5432,
});

// Test connection on startup
db.connect()
  .then(() => console.log("✅ PostgreSQL connected successfully"))
  .catch((err) => {
    console.error("❌ PostgreSQL connection error:", err.message);
    process.exit(1); // Exit if database connection fails
  });

// Handle pool errors
db.on("error", (err) => {
  console.error("Unexpected database error:", err);
});

module.exports = db;