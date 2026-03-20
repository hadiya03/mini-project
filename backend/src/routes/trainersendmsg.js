const express = require("express");
const router = express.Router();
const db = require("../db/db.js"); 

// POST message to player
router.post("/trainer/message/:playerId", async (req, res) => {
  const { playerId } = req.params;
  const { message } = req.body;

  try {
    const result = await db.query(
      `INSERT INTO trainer_messages (player_id, message)
       VALUES ($1, $2)
       RETURNING *`,
      [playerId, message]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to send message" });
  }
});

module.exports = router;