const pool = require("../db/db");

/* ================= GET LOGS ================= */
exports.getLogs = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT u.email, u.role, l.login_time, l.logout_time
      FROM user_logs l
      JOIN users u ON u.id = l.user_id
      ORDER BY l.login_time DESC
      LIMIT 20
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

/* ================= LOGIN ================= */
exports.loginLog = async (userId) => {
  await pool.query(
    "INSERT INTO user_logs(user_id, login_time) VALUES($1, CURRENT_TIMESTAMP)",
    [userId]
  );
};

/* ================= LOGOUT ================= */
exports.logoutLog = async (userId) => {
  await pool.query(
    `UPDATE user_logs
     SET logout_time = CURRENT_TIMESTAMP
     WHERE user_id=$1 AND logout_time IS NULL`,
    [userId]
  );
};