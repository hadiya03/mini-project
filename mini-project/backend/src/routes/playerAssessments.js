
const express = require("express");
const router = express.Router();

const controller = require("../controllers/assessments.js");
const pool = require("../db/db.js");


// ✅ SAVE assessment (calculates + stores injury risk)
router.post("/:id", controller.saveAssessment);


// ✅ SEND reminder email
router.post("/:id/send-reminder", controller.sendReminder);


// GET latest assessment for a player
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  try {
    const result = await pool.query(
      `SELECT 
         readiness,
         fatigue,
         overall_performance,
         skill_gap,
         created_at
       FROM player_assessments
       WHERE player_id = $1
       ORDER BY created_at DESC
       LIMIT 1`,
      [Number(id)]
    );

    if (result.rows.length === 0) return res.json(null);

    res.json(result.rows[0]);
  } catch (err) {
    console.error("Fetch assessment error:", err);
    res.status(500).json({ error: "Failed to fetch assessment" });
  }
});




module.exports = router;

