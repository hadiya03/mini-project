const express = require("express");
const router = express.Router();
const db = require("../db/db.js");

// GET messages for logged-in player
router.get("/player/messages/:playerId", async (req, res) => {
  const { playerId } = req.params;

  try {
    const result = await db.query(
      `SELECT * FROM trainer_messages
       WHERE player_id = $1
       ORDER BY created_at DESC`,
      [playerId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch messages" });
  }
});

module.exports = router;