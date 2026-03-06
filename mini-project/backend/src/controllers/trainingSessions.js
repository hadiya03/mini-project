const pool = require("../db/db.js");

// CREATE
exports.createTraining = async (req, res) => {
  try {
    const { session_date, duration_minutes, distance_km, sprint_count, rpe, minutes_played } = req.body;

    const result = await pool.query(
      `INSERT INTO training_sessions 
       (session_date, duration_minutes, distance_km, sprint_count, rpe, minutes_played)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [session_date, duration_minutes, distance_km, sprint_count, rpe, minutes_played]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// GET ALL
exports.getAllTrainings = async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM training_sessions ORDER BY session_date DESC");
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// GET BY ID
exports.getTrainingById = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("SELECT * FROM training_sessions WHERE id = $1", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Training session not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// UPDATE
exports.updateTraining = async (req, res) => {
  try {
    const { id } = req.params;
    const { session_date, duration_minutes, distance_km, sprint_count, rpe, minutes_played } = req.body;

    const result = await pool.query(
      `UPDATE training_sessions
       SET session_date = $1,
           duration_minutes = $2,
           distance_km = $3,
           sprint_count = $4,
           rpe = $5,
           minutes_played = $6
       WHERE id = $7
       RETURNING *`,
      [session_date, duration_minutes, distance_km, sprint_count, rpe, minutes_played, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Training session not found" });
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

// DELETE
exports.deleteTraining = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await pool.query("DELETE FROM training_sessions WHERE id = $1 RETURNING *", [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Training session not found" });
    }

    res.json({ message: "Training session deleted successfully" });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};




// GET LATEST TRAINING SESSION
exports.getLatestTraining = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM training_sessions
       ORDER BY session_date DESC
       LIMIT 1`
    );

    if (result.rows.length === 0) {
      return res.status(200).json(null);
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};



// GET AVERAGE TRAINING LOAD OF A PLAYER
exports.getAverageTrainingLoad = async (req, res) => {
  try {
    const { id } = req.params;

    const result = await pool.query(
      `SELECT AVG(rpe * duration_minutes) AS avg_load
       FROM training_sessions
       WHERE player_id = $1`,
      [id]
    );

    res.json({
      averageLoad: Number(result.rows[0].avg_load) || 0,
    });
  } catch (err) {
    console.error(err.message);
    res.status(500).send("Server Error");
  }
};

