const pool = require('../Config/db');
const jwt = require('jsonwebtoken');
require("dotenv").config();

const getUserIdFromToken = (req) => {
    try {
        const token = req.headers.authorization?.split(" ")[1];
        if (!token) return null;
        
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        return decoded.id;
    } catch (error) {
        console.error('Error extracting user ID from token:', error);
        return null;
    }
};

const getAllCases = (req, res) => {
    try {
        const userId = getUserIdFromToken(req);
        
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized. Please log in.' });
        }

        const query = `
            SELECT cr.case_id, cr.date, cr.type, cr.description, cr.city
            FROM crime_scene_report_level3 cr
            INNER JOIN check_table3 ct ON cr.case_id = ct.case_id
            GROUP BY cr.case_id;
        `;

        pool.query(query, (error, results) => {
            if (error) {
                console.error('Error fetching cases:', error);
                return res.status(500).json({ success: false, message: 'Server error' });
            }

            if (!results || results.length === 0) {
                return res.status(404).json({ success: false, message: 'No cases available' });
            }

            return res.status(200).json({
                success: true,
                cases: results,
                pagination: {
                    totalPages: Math.ceil(results.length / 10),
                    totalCases: results.length
                }
            });
        });
    } catch (error) {
        console.error('Error fetching cases:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

const getCaseById = (req, res) => {
    try {
        const { caseId } = req.params;
        const userId = getUserIdFromToken(req);
        
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized. Please log in.' });
        }

        const query = `
            SELECT cr.case_id, cr.date, cr.type, cr.description, cr.city
            FROM crime_scene_report_level3 cr
            WHERE cr.case_id = ?;
        `;

        pool.query(query, [caseId], (error, results) => {
            if (error) {
                console.error('Error fetching case:', error);
                return res.status(500).json({ success: false, message: 'Server error' });
            }

            if (!results || results.length === 0) {
                return res.status(404).json({ success: false, message: 'Case not found' });
            }

            return res.status(200).json({
                success: true,
                case_id: results[0].case_id,
                question: results[0],
                instructions: "Write a SQL query to find the person_ids involved in this crime."
            });
        });
    } catch (error) {
        console.error('Error fetching case:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};


const getCompletedCases = (req, res) => {
    try {
      const userId = getUserIdFromToken(req);
  
      if (!userId) {
        return res.status(401).json({ success: false, message: 'Unauthorized. Please log in.' });
      }

      const query = `
        SELECT case_id 
        FROM user_progress 
        WHERE user_id = ? AND completed = TRUE AND case_id IS NOT NULL;
      `;
  
      pool.query(query, [userId], (error, results) => {
        if (error) {
          console.error('Error fetching completed cases:', error);
          return res.status(500).json({ success: false, message: 'Server error' });
        }

        const completedCases = results.map(row => Number(row.case_id));
        console.log("Completed cases for user", userId, ":", completedCases);
        
        return res.status(200).json({
          success: true,
          completedCases
        });
      });
    } catch (error) {
      console.error('Error fetching completed cases:', error);
      return res.status(500).json({ success: false, message: 'Server error' });
    }
};

const level1Question = (req, res) => {
    try {
        const userId = getUserIdFromToken(req);
        
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized. Please log in.' });
        }
        
        const page = parseInt(req.query.page) || 0; 
        const limit = 1; 
        const offset = page * limit;

        const query = `
            SELECT cr.case_id, cr.date, cr.type, cr.description, cr.city
            FROM crime_scene_report_level3 cr
            INNER JOIN check_table3 ct ON cr.case_id = ct.case_id
            GROUP BY cr.case_id
            LIMIT ? OFFSET ?;
        `;

        const countQuery = `
            SELECT COUNT(DISTINCT cr.case_id) as total
            FROM crime_scene_report_level3 cr
            INNER JOIN check_table3 ct ON cr.case_id = ct.case_id;
        `;

        pool.query(countQuery, (countError, countResults) => {
            if (countError) {
                console.error('Error counting questions:', countError);
                return res.status(500).json({ success: false, message: 'Server error' });
            }

            const totalQuestions = countResults[0].total;

            pool.query(query, [limit, offset], (error, results) => {
                if (error) {
                    console.error('Error fetching question:', error);
                    return res.status(500).json({ success: false, message: 'Server error' });
                }

                if (!results || results.length === 0) {
                    return res.status(404).json({ success: false, message: 'No questions available' });
                }

                return res.status(200).json({
                    success: true,
                    case_id: results[0].case_id,
                    question: {
                        case_id: results[0].case_id, 
                        date: results[0].date,
                        type: results[0].type,
                        description: results[0].description,
                        city: results[0].city
                    },
                    pagination: {
                        currentPage: page,
                        totalPages: Math.ceil(totalQuestions / limit),
                        totalQuestions: totalQuestions
                    },
                    instructions: "Write a SQL query to find the person_id of this crime scene report."
                });
            });
        });
    } catch (error) {
        console.error('Error fetching question:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

const executeQuery = (req, res) => {
    try {
        const { query } = req.body;
        const userId = getUserIdFromToken(req);
        
        if (!userId) {
            return res.status(401).json({ success: false, message: 'Unauthorized. Please log in.' });
        }

        const forbiddenKeywords = ['DROP', 'DELETE', 'UPDATE', 'INSERT', 'ALTER', 'CREATE', 'TRUNCATE'];
        const containsForbiddenKeyword = forbiddenKeywords.some(keyword => query.toUpperCase().includes(keyword));

        if (containsForbiddenKeyword) {
            return res.status(403).json({ success: false, message: 'Query contains forbidden keywords' });
        }

        pool.query(query, (error, results) => {
            if (error) {
                console.error('Error executing query:', error);
                return res.status(400).json({ success: false, message: 'Invalid SQL query: ' + error.message });
            }

            return res.status(200).json({ success: true, results });
        });
    } catch (error) {
        console.error('Error executing query:', error);
        return res.status(500).json({ success: false, message: 'Server error' });
    }
};

const checkAnswer = (req, res) => {
    const token = req.headers.authorization?.split(" ")[1]; 
    const secretKey = process.env.JWT_SECRET;

    try {
        console.log('Incoming request body:', req.body);

        if (!token) {
            return res.status(401).json({ success: false, message: 'Unauthorized: Token missing' });
        }

        const decoded = jwt.verify(token, secretKey);
        const userId = decoded.id; 

        console.log("Decoded User ID:", userId);

        // 🔹 Fetch user details
        pool.query(`SELECT * FROM users WHERE id = ? LIMIT 1`, [userId], (error, userResults) => {
            if (error) {
                console.error('Error fetching user:', error);
                return res.status(500).json({ success: false, message: 'Database error' });
            }
            if (userResults.length === 0) {
                return res.status(400).json({ success: false, message: 'User not found' });
            }

            console.log('Fetched user:', userResults[0]);

            const { answer, caseId } = req.body;
            if (!answer || !caseId) {
                return res.status(400).json({ success: false, message: 'Case ID and Answer are required' });
            }

            const numericCaseId = parseInt(caseId);
            if (isNaN(numericCaseId)) {
                return res.status(400).json({ success: false, message: 'Invalid Case ID format' });
            }

            const personIds = answer.split(',').map(id => parseInt(id.trim())).filter(id => !isNaN(id));

            if (personIds.length === 0) {
                return res.status(400).json({ success: false, message: 'Invalid input. Please enter valid person IDs.' });
            }

            console.log('Parsed person IDs:', personIds);

            // First check if the user has already completed this case
            pool.query(
                `SELECT completed FROM user_progress WHERE user_id = ? AND case_id = ? AND level_id = 3 LIMIT 1`,
                [userId, numericCaseId],
                (progressError, progressResults) => {
                    if (progressError) {
                        console.error('Error checking previous completion:', progressError);
                        return res.status(500).json({ success: false, message: 'Server error while checking previous completion' });
                    }

                    const alreadyCompleted = progressResults.length > 0 && progressResults[0].completed;

                    pool.query(
                        `SELECT COUNT(*) as count, COUNT(DISTINCT person_id) as uniqueCount 
                         FROM check_table3
                         WHERE case_id = ? AND person_id IN (${personIds.map(() => '?').join(',')})`,
                        [numericCaseId, ...personIds], (error, answerResults) => {

                            if (error) {
                                console.error('Error checking answer:', error);
                                return res.status(500).json({ success: false, message: 'Server error while checking answer' });
                            }

                            pool.query(
                                `SELECT COUNT(*) as totalPersons FROM check_table3 WHERE case_id = ?`,
                                [numericCaseId],
                                (error2, totalResults) => {

                                    if (error2) {
                                        console.error('Error checking total persons:', error2);
                                        return res.status(500).json({ success: false, message: 'Server error while checking answer' });
                                    }

                                    const totalPersons = totalResults[0].totalPersons;
                                    const foundPersons = answerResults[0].count;
                                    const uniqueFoundPersons = answerResults[0].uniqueCount;

                                    if (uniqueFoundPersons === personIds.length && foundPersons === totalPersons) {
                                        
                                        if (alreadyCompleted) {
                                            
                                            pool.query(`
                                                UPDATE user_progress 
                                                SET attempts = attempts + 1
                                                WHERE user_id = ? AND case_id = ? AND level_id = 3
                                            `, [userId, numericCaseId], (updateError) => {
                                                if (updateError) {
                                                    console.error('Error updating attempts:', updateError);
                                                }
                                                
                                                return res.status(200).json({
                                                    success: true,
                                                    correct: true,
                                                    case_id: numericCaseId,
                                                    message: 'Correct answer! You have already solved this case previously.',
                                                    nextLevel: '/game/level2'
                                                });
                                            });
                                        } else {
                                            
                                            pool.query(`
                                                INSERT INTO user_progress (user_id, level_id, case_id, completed, score, completed_at, attempts)
                                                VALUES (?, 3, ?, TRUE, 10, NOW(), 1)
                                                ON DUPLICATE KEY UPDATE 
                                                    completed = TRUE,
                                                    score = 10,
                                                    completed_at = IF(completed = FALSE, NOW(), completed_at),
                                                    attempts = attempts + 1
                                            `, [userId, numericCaseId], (progressError, progressResult) => {
                                                if (progressError) {
                                                    console.error('Error updating user progress:', progressError);
                                                    return res.status(500).json({ success: false, message: 'Server error while updating progress' });
                                                }
                                                
                                                console.log('User progress updated successfully:', progressResult);
                                                
                                                updateUserScoreAndStreak(userId, 10, (scoreError, scoreResult) => {
                                                    if (scoreError) {
                                                        console.error('Error updating user score:', scoreError);
                                                        return res.status(500).json({ success: false, message: 'Server error while updating score' });
                                                    }
                                                    
                                                    console.log('User score updated successfully:', scoreResult);
                                                    
                                                    return res.status(200).json({
                                                        success: true,
                                                        correct: true,
                                                        case_id: numericCaseId,
                                                        message: 'Correct answer! You found all persons involved. You earned 10 points.',
                                                        nextLevel: '/game/level2'
                                                    });
                                                });
                                            });
                                        }
                                    } else if (foundPersons > 0) {
                                        
                                        pool.query(`
                                            INSERT INTO user_progress (user_id, level_id, case_id, attempts)
                                            VALUES (?, 3, ?, 1)
                                            ON DUPLICATE KEY UPDATE 
                                                attempts = attempts + 1
                                        `, [userId, numericCaseId], (attemptsError) => {
                                            if (attemptsError) {
                                                console.error('Error updating attempts:', attemptsError);
                                            }
                                            
                                            return res.status(200).json({
                                                success: true,
                                                correct: false,
                                                case_id: numericCaseId,
                                                message: `You found ${foundPersons} out of ${totalPersons} persons involved. Keep trying!`
                                            });
                                        });
                                    } else {
                                        
                                        pool.query(`
                                            INSERT INTO user_progress (user_id, level_id, case_id, attempts)
                                            VALUES (?, 3, ?, 1)
                                            ON DUPLICATE KEY UPDATE 
                                                attempts = attempts + 1
                                        `, [userId, numericCaseId], (attemptsError) => {
                                            if (attemptsError) {
                                                console.error('Error updating attempts:', attemptsError);
                                            }
                                            
                                            return res.status(200).json({
                                                success: true,
                                                correct: false,
                                                case_id: numericCaseId,
                                                message: 'Incorrect answer. Try again!'
                                            });
                                        });
                                    }
                                }
                            );
                        }
                    );
                }
            );
        });
    } catch (error) {
        console.error('Error checking answer:', error);
        return res.status(500).json({ success: false, message: 'Server error while checking answer' });
    }
};

const updateUserScoreAndStreak = (userId, points, callback) => {
    pool.getConnection((err, connection) => {
        if (err) {
            console.error('Error getting database connection:', err);
            return callback && callback(err);
        }

        connection.beginTransaction((err) => {
            if (err) {
                connection.release();
                console.error('Error starting transaction:', err);
                return callback && callback(err);
            }

            connection.query('SELECT total_score, current_streak, highest_streak, last_active_date FROM users WHERE id = ?',
                [userId], (err, results) => {
                    if (err) {
                        connection.rollback(() => connection.release());
                        console.error('Error fetching user data:', err);
                        return callback && callback(err);
                    }

                    const user = results[0];
                    if (!user) {
                        connection.release();
                        return callback && callback(new Error('User not found'));
                    }

                    const today = new Date().toISOString().split('T')[0];
                    const yesterday = new Date();
                    yesterday.setDate(yesterday.getDate() - 1);
                    const yesterdayStr = yesterday.toISOString().split('T')[0];

                    let newStreak = user.current_streak;

                    if (user.last_active_date === null) {
                        newStreak = 1;
                    } else if (user.last_active_date === yesterdayStr) {
                        newStreak += 1;
                    } else if (user.last_active_date !== today) {
                        newStreak = 1;
                    }

                    const newScore = user.total_score + points;
                    const newHighestStreak = Math.max(user.highest_streak || 0, newStreak);

                    connection.query(
                        'UPDATE users SET total_score = ?, current_streak = ?, highest_streak = ?, last_active_date = ? WHERE id = ?',
                        [newScore, newStreak, newHighestStreak, today, userId],
                        (err) => {
                            if (err) {
                                connection.rollback(() => connection.release());
                                console.error('Error updating user data:', err);
                                return callback && callback(err);
                            }

                            connection.commit((err) => {
                                if (err) {
                                    connection.rollback(() => connection.release());
                                    console.error('Error committing transaction:', err);
                                    return callback && callback(err);
                                }

                                connection.release();
                                return callback && callback(null, {
                                    newScore,
                                    newStreak,
                                    newHighestStreak
                                });
                            });
                        }
                    );
                });
        });
    });
};

module.exports = {
    getAllCases,
    getCaseById,
    getCompletedCases,
    level1Question,
    executeQuery,
    checkAnswer,
    updateUserScoreAndStreak
};