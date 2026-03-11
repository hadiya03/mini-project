//player dashboard routes
const express = require("express");
const router = express.Router();
const {
  createSubmission,
  getLatestSubmission,
  updateSubmissionByAnalyst,
} = require("../controllers/trainingSubmissions");

router.post("/", createSubmission);
router.get("/players/:id/daily-input", getLatestSubmission);
router.put("/:id", updateSubmissionByAnalyst);

module.exports = router;
