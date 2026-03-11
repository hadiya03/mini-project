const express = require("express");
const router = express.Router();
const { getPlayerDashboardByEmail,updatePlayerProfile,getPlayerTrainingHistory } = require("../controllers/playerDashboard");

// ✅ GET PLAYER DASHBOARD BY EMAIL
router.get("/:email", getPlayerDashboardByEmail);
router.put("/:email", updatePlayerProfile);


// 🔹 NEW ROUTE for full training history
router.get("/history/:player_id", getPlayerTrainingHistory);





module.exports = router;
