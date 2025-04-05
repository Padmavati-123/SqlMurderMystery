const express = require('express');
const router = express.Router();
const { level1Question, executeQuery, checkAnswer,getAllCases,
    getCaseById,
    getCompletedCases, } = require('../Controllers/level3Controller');
router.get('/level3', level1Question);
router.post('/execute-query-3', executeQuery);
router.post('/check-answer-3', checkAnswer);
router.get('/user/completed-cases-3', getCompletedCases);
router.get('/level3/all-cases', getAllCases);
router.get('/level3/case/:caseId', getCaseById);


module.exports = router;