const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "localhost",
  database: "football_db",
  password: "yourpassword",
  port: 5432,
});

module.exports = pool;