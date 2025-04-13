const express = require('express');
const router = express.Router();
const { level1Question, executeQuery, checkAnswer,getAllCases,
    getCaseById,
    getCompletedCases,getUserProgress, } = require('../Controllers/level1Controller');
router.get('/level1', level1Question);
router.post('/execute-query', executeQuery);
router.post('/check-answer', checkAnswer);
router.get('/user/completed-cases', getCompletedCases);
router.get('/level1/all-cases', getAllCases);
router.get('/level1/case/:caseId', getCaseById);
router.get('/user/progress', getUserProgress); 


module.exports = router;