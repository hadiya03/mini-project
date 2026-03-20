const express = require("express");
const router = express.Router();
const {getLogs} = require("../controllers/logController.js");

router.get("/", getLogs);

module.exports = router;