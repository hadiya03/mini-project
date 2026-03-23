const pool = require("../db/db");
const bcrypt = require("bcrypt");
// ✅ GET PLAYER DASHBOARD DATA BY EMAIL
exports.getPlayerDashboardByEmail = async (req, res) => {
  const { email } = req.params; // email is varchar/string

  try {
    const result = await pool.query(
      `
      SELECT 
        p.id,                   -- numeric id from players table
        p.player_id,           -- varchar, e.g., PLR001
        p.name,
        p.position,
        p.current_team,
        p.profile_image,
        u.email,
        u.role,
        COALESCE(a.readiness, ts.readiness::numeric) AS readiness,
        COALESCE(a.injury_risk, ts.injury_risk::numeric) AS injury_risk,
        a.skill_gap,
        COALESCE(a.rpe, ts.rpe::numeric) AS rpe,
        COALESCE(a.sleep_hour, ts.sleep::numeric) AS sleep_hour,
        COALESCE(a.soreness, ts.soreness::numeric) AS soreness,
        COALESCE(a.tiredness, ts.tiredness::numeric) AS tiredness
      FROM players p
      JOIN users u ON p.email = u.email
      LEFT JOIN LATERAL (
        SELECT readiness, injury_risk, skill_gap, rpe, sleep_hour, soreness, tiredness
        FROM player_assessments
        WHERE player_id = p.id    -- join on numeric id, not PLR001
        ORDER BY created_at DESC
        LIMIT 1
      ) a ON true
      LEFT JOIN LATERAL (
        SELECT readiness, injury_risk, rpe, sleep, soreness, tiredness
        FROM training_submissions
        WHERE player_id = p.id
        ORDER BY submitted_at DESC
        LIMIT 1
      ) ts ON true
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





/*exports.updatePlayerProfile = async (req, res) => {
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
};*/



exports.updatePlayerProfile = async (req, res) => {
  try {
    const { email } = req.params;
    const { name, position, current_team, player_id, profile_image } = req.body;

    // Update the players table
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


    // Hash the player_id before storing
    const hashedPassword = await bcrypt.hash(player_id, 10);
    // Update the users table if name or player_id changed
    await pool.query(
      `UPDATE users
       SET name = $1,
           password = $2
       WHERE email = $3`,
      [name,hashedPassword, email]
    );

    res.json({ message: "Profile updated successfully" });

  } catch (err) {
    console.error("Update error:", err);
    res.status(500).json({ error: "Update failed" });
  }
};



exports.getPlayerTrainingHistory = async (req, res) => {
  // Convert player_id from string to integer
  const playerId = parseInt(req.params.player_id, 10);

  // Validate that it's a number
  if (isNaN(playerId)) {
    return res.status(400).json({ error: "Invalid player_id" });
  }

  try {
    console.log("Fetching training history for:", playerId); // debugging

    const result = await pool.query(
  `SELECT
      ts.submitted_at AS created_at,
      ts.rpe,
      ts.tiredness,
      ts.sleep,
      ts.soreness,
      pa.readiness
   FROM training_submissions ts
   LEFT JOIN LATERAL (
      SELECT readiness
      FROM player_assessments
      WHERE player_id = ts.player_id
      ORDER BY created_at DESC
      LIMIT 1
   ) pa ON true
   WHERE ts.player_id = $1
   ORDER BY ts.submitted_at DESC`,
  [playerId]
);

    console.log("Training history rows:", result.rows);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error("Fetch training history error:", err);
    res.status(500).json({ error: "Failed to fetch training history" });
  }
};