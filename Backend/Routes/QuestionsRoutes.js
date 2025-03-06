const express = require("express");
const router = express.Router();
const questionsController = require("../Controllers/questionsController");

router.get("/:topic_id", questionsController.getQuestionsByTopic);
router.post("/submit", questionsController.submitAnswers);

module.exports = router;
