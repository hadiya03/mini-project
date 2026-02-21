const express = require("express");
const router = express.Router();
const { getPlayerDashboardByEmail,updatePlayerProfile } = require("../controllers/playerDashboard");

// ✅ GET PLAYER DASHBOARD BY EMAIL
router.get("/:email", getPlayerDashboardByEmail);
router.put("/:email", updatePlayerProfile);








module.exports = router;
