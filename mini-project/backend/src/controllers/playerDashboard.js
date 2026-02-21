const pool = require("../db/db");

// ✅ GET PLAYER DASHBOARD DATA BY EMAIL
exports.getPlayerDashboardByEmail = async (req, res) => {
  const { email } = req.params; // email is varchar/string

  try {
    const result = await pool.query(
      `
      SELECT 
        p.player_id,           -- varchar, e.g., PLR001
        p.name,
        p.position,
        p.current_team,
        p.profile_image,
        u.email,
        u.role,
        a.readiness,
        a.injury_risk,
        a.skill_gap,
        a.rpe,
        a.sleep_hour,
        a.soreness,
        a.tiredness
      FROM players p
      JOIN users u ON p.email = u.email
      LEFT JOIN LATERAL (
        SELECT readiness, injury_risk, skill_gap, rpe, sleep_hour, soreness, tiredness
        FROM player_assessments
        WHERE player_id = p.id    -- join on numeric id, not PLR001
        ORDER BY created_at DESC
        LIMIT 1
      ) a ON true
      WHERE u.email = $1::varchar
      `,
      [email]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error("Player Dashboard Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};





exports.updatePlayerProfile = async (req, res) => {
  try {
    const { email } = req.params;
    const { name, position, current_team, player_id, profile_image } = req.body;

    await pool.query(
      `UPDATE players
       SET name = $1,
           position = $2,
           current_team = $3,
           player_id = $4,
           profile_image = $5
       WHERE email = $6`,
      [name, position, current_team, player_id, profile_image, email]
    );

    res.json({ message: "Profile updated successfully" });

  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Update failed" });
  }
};
