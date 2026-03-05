
const express = require("express");
const router = express.Router();
const pool = require("../db/db.js");

router.get("/", async (req, res) => {
  try {
    const totalPlayers = await pool.query(
      "SELECT COUNT(*) FROM players"
    );

    const avgReadiness = await pool.query(`
      SELECT AVG(readiness) AS avg FROM (
        SELECT DISTINCT ON (player_id)
          player_id,
          readiness
        FROM player_assessments
        ORDER BY player_id, created_at DESC
      ) latest
    `);

    const playersAtRisk = await pool.query(`
      SELECT COUNT(*) FROM (
        SELECT DISTINCT ON (player_id)
          player_id,
          readiness
        FROM player_assessments
        ORDER BY player_id, created_at DESC
      ) latest
      WHERE readiness < 50
    `);

    /* ✅ NEW: get at-risk player details */
    const atRiskPlayers = await pool.query(`
      SELECT p.id, p.name, pa.readiness
      FROM players p
      JOIN (
        SELECT DISTINCT ON (player_id)
          player_id,
          readiness
        FROM player_assessments
        ORDER BY player_id, created_at DESC
      ) pa ON pa.player_id = p.id
      WHERE pa.readiness < 50
    `);

    res.json({
      totalPlayers: Number(totalPlayers.rows[0].count),
      averageReadiness: Math.round(avgReadiness.rows[0].avg || 0),
      playersAtRisk: Number(playersAtRisk.rows[0].count),

      /* ✅ added safely */
      atRiskPlayers: atRiskPlayers.rows
    });
  } catch (err) {
    console.error("Dashboard error:", err);
    res.status(500).json({ error: "Dashboard fetch failed" });
  }
});

module.exports = router;
