const pool = require("../Config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const registerUser = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  pool.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashedPassword],
    (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      res.status(201).json({ message: "User registered successfully" });
    }
  );
};

const loginUser = (req, res) => {
  const { email, password } = req.body;

  pool.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
    if (err) return res.status(500).json({ error: err.message });

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = result[0];

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  });
};

const getUserProfile = (req, res) => {
  pool.query("SELECT id, name, email FROM users WHERE id = ?", [req.user.id], (err, result) => {
      if (err) return res.status(500).json({ error: err.message });

      if (result.length === 0) {
          return res.status(404).json({ message: "User not found" });
      }

      res.json(result[0]);  // Sending user details
  });
};

const updateProfile = (req, res) => {
  const userId = req.user.id; // From auth middleware
  const { name, email, currentPassword, newPassword } = req.body;
  
  // Start a transaction to ensure data consistency
  pool.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({ error: "Database connection error" });
    }
    
    connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        return res.status(500).json({ error: "Transaction error" });
      }
      
      // First, get the current user data to verify password if needed
      connection.query(
        "SELECT * FROM users WHERE id = ?",
        [userId],
        (err, results) => {
          if (err) {
            return connection.rollback(() => {
              connection.release();
              res.status(500).json({ error: err.message });
            });
          }
          
          if (results.length === 0) {
            return connection.rollback(() => {
              connection.release();
              res.status(404).json({ message: "User not found" });
            });
          }
          
          const user = results[0];
          
          // Build the update query conditionally
          let updateQuery = "UPDATE users SET name = ?, email = ?";
          let queryParams = [name, email];
          
          // If password change is requested
          if (currentPassword && newPassword) {
            // Verify current password
            const isPasswordValid = bcrypt.compareSync(currentPassword, user.password);
            
            if (!isPasswordValid) {
              return connection.rollback(() => {
                connection.release();
                res.status(400).json({ message: "Current password is incorrect" });
              });
            }
            
            // Hash the new password
            const hashedNewPassword = bcrypt.hashSync(newPassword, 10);
            
            // Add password to update query
            updateQuery += ", password = ?";
            queryParams.push(hashedNewPassword);
          }
          
          // Complete the query with WHERE clause
          updateQuery += " WHERE id = ?";
          queryParams.push(userId);
          
          // Execute the update
          connection.query(updateQuery, queryParams, (err, result) => {
            if (err) {
              return connection.rollback(() => {
                connection.release();
                res.status(500).json({ error: err.message });
              });
            }
            
            if (result.affectedRows === 0) {
              return connection.rollback(() => {
                connection.release();
                res.status(500).json({ message: "Failed to update profile" });
              });
            }
            
            // Get updated user data to return
            connection.query(
              "SELECT id, name, email FROM users WHERE id = ?",
              [userId],
              (err, updatedResults) => {
                if (err) {
                  return connection.rollback(() => {
                    connection.release();
                    res.status(500).json({ error: err.message });
                  });
                }
                
                // Commit the transaction
                connection.commit((err) => {
                  if (err) {
                    return connection.rollback(() => {
                      connection.release();
                      res.status(500).json({ error: "Commit error" });
                    });
                  }
                  
                  connection.release();
                  
                  // Return success with updated user data
                  res.status(200).json({
                    message: "Profile updated successfully",
                    user: updatedResults[0]
                  });
                });
              }
            );
          });
        }
      );
    });
  });
};

module.exports = { registerUser, loginUser, getUserProfile, updateProfile };
