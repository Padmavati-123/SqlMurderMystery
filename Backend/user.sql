-- Ensure you are using the correct database
USE defaultdb;

CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    total_score INT DEFAULT 0,
    current_streak INT DEFAULT 0,
    highest_streak INT DEFAULT 0,
    last_active_date DATE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create a table to track completed levels
CREATE TABLE IF NOT EXISTS user_progress (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    level_id INT NOT NULL,
    completed BOOLEAN DEFAULT FALSE,
    score INT DEFAULT 0,
    completed_at TIMESTAMP,
    attempts INT DEFAULT 0,
    FOREIGN KEY (user_id) REFERENCES users(id),
    UNIQUE KEY unique_user_level (user_id, level_id)
);

-- Create a leaderboard view for easy querying
CREATE OR REPLACE VIEW leaderboard AS
SELECT id, name, total_score, current_streak, highest_streak
FROM users
ORDER BY total_score DESC, highest_streak DESC;