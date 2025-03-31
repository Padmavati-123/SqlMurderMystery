const pool = require('../Config/db');

const getLeaderboard = (req, res) => {

    const query = `
        SELECT id, name, total_score, current_streak, highest_streak
        FROM users
        ORDER BY total_score DESC, highest_streak DESC
        LIMIT 10
    `;

    pool.query(query, (error, results) => {
        if (error) {
            console.error('Error fetching leaderboard:', error);
            return res.status(500).json({
                success: false,
                message: 'Server error while fetching leaderboard'
            });
        }

        return res.status(200).json({
            success: true,
            leaderboard: results
        });
    });
};

const getUserStats = (req, res) => {
    const userId = req.user.id;

    const query = `
        SELECT 
            u.total_score,
            u.current_streak,
            u.highest_streak,
            (SELECT COUNT(*) + 1 FROM users WHERE total_score > u.total_score) AS rank,
            (SELECT COUNT(*) FROM user_progress WHERE user_id = ? AND completed = TRUE) AS levels_completed
        FROM users u
        WHERE u.id = ?
    `;

    pool.query(query, [userId, userId], (error, results) => {
        if (error) {
            console.error('Error fetching user stats:', error);
            return res.status(500).json({
                success: false,
                message: 'Server error while fetching user stats'
            });
        }

        if (!results || results.length === 0) {
            return res.status(404).json({
                success: false,
                message: 'User not found'
            });
        }

        return res.status(200).json({
            success: true,
            stats: results[0]
        });
    });
};

module.exports = {
    getLeaderboard,
    getUserStats
};
