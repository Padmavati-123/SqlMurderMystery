const express = require("express");
const router = express.Router();
const topicsController = require("../Controllers/TopicsController");

router.get("/topics", topicsController.getTopics);

module.exports = router;
