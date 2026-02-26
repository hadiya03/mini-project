const express = require("express");
const router = express.Router();
const trainingController = require("../controllers/trainingSessions.js");

// CRUD routes
router.post("/", trainingController.createTraining);
router.get("/", trainingController.getAllTrainings);
router.get("/:id", trainingController.getTrainingById);
router.put("/:id", trainingController.updateTraining);
router.delete("/:id", trainingController.deleteTraining);

module.exports = router;
