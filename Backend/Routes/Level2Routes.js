const express = require('express');
const router = express.Router();
const { level1Question, executeQuery, checkAnswer,getAllCases,
    getCaseById,
    getCompletedCases, } = require('../Controllers/level2Controller');
router.get('/level2', level1Question);
router.post('/execute-query-2', executeQuery);
router.post('/check-answer-2', checkAnswer);
router.get('/user/completed-cases-2', getCompletedCases);
router.get('/level2/all-cases', getAllCases);
router.get('/level2/case/:caseId', getCaseById);


module.exports = router;