const express = require('express');
const router = express.Router();

const { getLeaderboard,
    getUserStats } = require("../Controllers/LeaderboardController");
const authMiddleware = require("../Middlewares/AuthMiddleware");

router.get('/leaderboard', getLeaderboard);
router.get('/user-stats', authMiddleware, getUserStats);

module.exports = router;

