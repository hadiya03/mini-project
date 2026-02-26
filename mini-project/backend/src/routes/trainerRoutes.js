const router = require("express").Router();
const controller = require("../controllers/trainerController");
const {getPlayers,deletePlayer,getPlayerById,updatePlayer} = require("../controllers/trainerController")
router.get("/trainer-players", getPlayers);
router.delete("/trainer-playersdelete/:id", deletePlayer); 
router.get("/trainer-playerprofile/:id", getPlayerById);
router.put("/trainer-players/:id", updatePlayer);

router.get("/team/:trainerId", controller.getTeam);
router.get("/player/:playerId", controller.getPlayerDetails);
router.get("/schedule/:trainerId", controller.getScheduledSessions);
router.post("/schedule", controller.scheduleTeamSession);

module.exports = router;