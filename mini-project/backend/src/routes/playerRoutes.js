
const express = require("express");
const router = express.Router();

const {
  createPlayer,
  getPlayerById,
  updatePlayer,
  getPlayers,
  deletePlayer, // ✅ added
} = require("../controllers/playerController.js");

// POST  /api/players
router.post("/players", createPlayer);

// GET   /api/players
router.get("/players", getPlayers);


// DELETE /api/players/:id
router.delete("/players/:id", deletePlayer); 

//edit player details
router.put("/players/:id", updatePlayer);


router.get("/players/:id", getPlayerById);

module.exports = router;



