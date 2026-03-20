const pool = require("../db/db.js");

/* ================= GET ALL USERS ================= */
exports.getAllUsers = async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT id, name, email, password, otp, is_verified, created_at
      FROM users
      ORDER BY created_at DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching users" });
  }
};


/* ================= DELETE USER ================= */
exports.deleteUser = async (req, res) => {
  try {
    const { id } = req.params;

    await pool.query(
      "DELETE FROM users WHERE id = $1",
      [id]
    );

    res.json({ message: "User deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Delete failed" });
  }
};


/* ================= TOGGLE VERIFY ================= */
exports.toggleVerify = async (req, res) => {
  try {
    const { id } = req.params;
    const { is_verified } = req.body;

    // ⭐ FIX: convert boolean → 0/1
    const verifyValue = is_verified ? 1 : 0;

    await pool.query(
      "UPDATE users SET is_verified = $1 WHERE id = $2",
      [verifyValue, id]
    );

    res.json({ message: "Verification updated" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Update failed" });
  }
};