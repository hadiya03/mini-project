const express = require("express");
const router = express.Router();
const trainingController = require("../controllers/trainingSessions.js");

// CRUD routes
router.post("/", trainingController.createTraining);
router.get("/", trainingController.getAllTrainings);
router.get("/latest", trainingController.getLatestTraining);

router.get("/:id", trainingController.getTrainingById);
router.put("/:id", trainingController.updateTraining);
router.get("/average-load/:id", trainingController.getAverageTrainingLoad);

router.delete("/:id", trainingController.deleteTraining);

module.exports = router;
