
const express = require("express");
const router = express.Router();

const {
  createPlayer,
  getPlayerById,
  updatePlayer,
  getPlayers,
  deletePlayer, // ✅ added
  getLatestDailyInput
} = require("../controllers/playerController.js");
const { bulkCreatePlayers } = require("../controllers/playerController.js");

// POST  /api/players
router.post("/players", createPlayer);

// GET   /api/players
router.get("/players", getPlayers);


// DELETE /api/players/:id
router.delete("/players/:id", deletePlayer); // ✅ added

router.put("/players/:id", updatePlayer);

router.get("/players/:id", getPlayerById);

// ✅ GET latest daily input for analyst
// URL: /api/player/:id/daily-input
router.get("/:id/daily-input", getLatestDailyInput);


router.post("/bulk", bulkCreatePlayers);

module.exports = router;



