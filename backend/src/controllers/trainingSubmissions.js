const pool = require("../db/db");

/* =========================================
   PLAYER SUBMIT TRAINING DATA
========================================= */
exports.createSubmission = async (req, res) => {
  const { email, rpe, sleep, soreness, tiredness } = req.body;

  try {
    const player = await pool.query(
      "SELECT id FROM players WHERE email = $1",
      [email]
    );

    if (player.rows.length === 0) {
      return res.status(404).json({ message: "Player not found" });
    }

    const playerId = player.rows[0].id;

    await pool.query(
      `INSERT INTO training_submissions
       (player_id, rpe, sleep, soreness, tiredness)
       VALUES ($1, $2, $3, $4, $5)`,
      [playerId, rpe, sleep, soreness, tiredness]
    );

    res.json({ message: "Submission saved successfully" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


/* =========================================
   GET LATEST SUBMISSION (For Analyst)
========================================= */
exports.getLatestSubmission = async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT *
       FROM training_submissions
       WHERE player_id = $1
       ORDER BY submitted_at DESC
       LIMIT 1`,
      [id]
    );

    if (result.rows.length === 0) {
      return res.json(null);
    }

    res.json(result.rows[0]);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


/* =========================================
   ANALYST UPDATE
========================================= */
exports.updateSubmissionByAnalyst = async (req, res) => {
  const { id } = req.params;
  const { readiness, trainer_feedback, injury_risk } = req.body;

  try {
    const result = await pool.query(
      `UPDATE training_submissions
       SET readiness = $1,
           trainer_feedback = $2,
           injury_risk = $3
       WHERE id = $4
       RETURNING *`,
      [readiness, trainer_feedback, injury_risk, id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "Submission not found" });
    }

    res.json({
      message: "Updated successfully",
      submission: result.rows[0],
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
