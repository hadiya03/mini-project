const router = require("express").Router();
const controller = require("../controllers/trainerController");

router.get("/team/:trainerId", controller.getTeam);
router.get("/player/:playerId", controller.getPlayerDetails);
router.get("/schedule/:trainerId", controller.getScheduledSessions);
router.post("/schedule", controller.scheduleTeamSession);

module.exports = router;