
const pool = require("../db/db.js");

/* ================= CREATE PLAYER ================= */
exports.createPlayer = async (req, res) => {
  try {
    const {
      player_id,
      email,
      name,
      position,
      age,
      weight,
      height,
      preferred_foot,
      current_team,
      profile_image,
    } = req.body;

    if (!player_id || !email || !name) {
      return res
        .status(400)
        .json({ message: "player_id, email and name are required" });
    }

    const query = `
      INSERT INTO players (
        player_id,
        email,
        name,
        position,
        age,
        weight,
        height,
        preferred_foot,
        current_team,
        profile_image
      )
      VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10)
      RETURNING *;
    `;

    const values = [
      player_id,
      email,
      name,
      position || null,
      age ?? null,
      weight ?? null,
      height ?? null,
      preferred_foot || null,
      current_team || null,
      profile_image || null,
    ];

    const result = await pool.query(query, values);
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Create Player Error:", error);
    res.status(500).json({ message: "Failed to create player" });
  }
};

/* ================= GET ALL PLAYERS ================= */
exports.getPlayers = async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM players ORDER BY created_at DESC"
    );
    res.status(200).json(result.rows);
  } catch (error) {
    console.error("Get Players Error:", error);
    res.status(500).json({ message: "Failed to fetch players" });
  }
};

/* ================= GET PLAYER BY ID ================= */
exports.getPlayerById = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "SELECT * FROM players WHERE id = $1",
      [id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Get Player By ID Error:", error);
    res.status(500).json({ message: "Failed to fetch player" });
  }
};

/* ================= UPDATE READINESS / FATIGUE ================= */
exports.updateAssessment = async (req, res) => {
  try {
    const { id } = req.params;
    const { readiness_score, fatigue_score, readiness_history } = req.body;

    const query = `
      UPDATE players
      SET
        readiness_score = $1,
        fatigue_score = $2,
        readiness_history = $3
      WHERE id = $4
      RETURNING *;
    `;

    const values = [
      readiness_score ?? null,
      fatigue_score ?? null,
      JSON.stringify(readiness_history || []),
      id,
    ];

    const result = await pool.query(query, values);

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error("Update Assessment Error:", error);
    res.status(500).json({ message: "Failed to update assessment" });
  }
};


//update player profile

exports.updatePlayer = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      name,
      email,
      position,
      age,
      height,
      weight,
      preferred_foot,
      current_team,
    } = req.body;

    const result = await pool.query(
      `UPDATE players
       SET name=$1, email=$2, position=$3, age=$4,
           height=$5, weight=$6,
           preferred_foot=$7, current_team=$8
       WHERE id=$9
       RETURNING *`,
      [
        name,
        email,
        position,
        age,
        height,
        weight,
        preferred_foot,
        current_team,
        id,
      ]
    );

    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Failed to update player" });
  }
};


/* ================= DELETE PLAYER ================= */
exports.deletePlayer = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      "DELETE FROM players WHERE id = $1 RETURNING *",
      [id]
    );

    if (result.rowCount === 0) {
      return res.status(404).json({ message: "Player not found" });
    }

    res.status(200).json({ message: "Player deleted successfully" });
  } catch (error) {
    console.error("Delete Player Error:", error);
    res.status(500).json({ message: "Failed to delete player" });
  }
};







