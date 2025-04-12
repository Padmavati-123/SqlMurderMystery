const pool = require("../Config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { sendWelcomeEmail,  sendInactivityEmail,sendPasswordResetEmail } = require("../src/utils/emailService");

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

      sendWelcomeEmail(name, email)
        .then(() => {
          res.status(201).json({ message: "User registered successfully" });
        })
        .catch((emailErr) => {
          console.error("Email failed to send:", emailErr);
          res.status(201).json({ message: "User registered, but email failed" });
        });
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

      res.json(result[0]);
  });
};

const updateProfile = (req, res) => {
  const userId = req.user.id;
  const { name, email, currentPassword, newPassword } = req.body;
  

  pool.getConnection((err, connection) => {
    if (err) {
      return res.status(500).json({ error: "Database connection error" });
    }
    
    connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        return res.status(500).json({ error: "Transaction error" });
      }

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

          let updateQuery = "UPDATE users SET name = ?, email = ?";
          let queryParams = [name, email];

          if (currentPassword && newPassword) {

            const isPasswordValid = bcrypt.compareSync(currentPassword, user.password);
            
            if (!isPasswordValid) {
              return connection.rollback(() => {
                connection.release();
                res.status(400).json({ message: "Current password is incorrect" });
              });
            }

            const hashedNewPassword = bcrypt.hashSync(newPassword, 10);

            updateQuery += ", password = ?";
            queryParams.push(hashedNewPassword);
          }

          updateQuery += " WHERE id = ?";
          queryParams.push(userId);

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

                connection.commit((err) => {
                  if (err) {
                    return connection.rollback(() => {
                      connection.release();
                      res.status(500).json({ error: "Commit error" });
                    });
                  }
                  
                  connection.release();
                  
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


const crypto = require('crypto');


const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Validate email
    if (!email || !email.match(/^\S+@\S+\.\S+$/)) {
      return res.status(400).json({ message: "Valid email is required" });
    }

    // Generate secure token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Find user with the provided email
    pool.query(
      "SELECT * FROM users WHERE email = ?", 
      [email], 
      (err, results) => {
        if (err) return res.status(500).json({ error: "Database error occurred" });
        
        // Don't reveal if user exists for security reasons
        if (results.length === 0) {
          return res.status(200).json({ 
            message: "If an account with that email exists, a password reset link has been sent" 
          });
        }
        
        const user = results[0];
        
        // Store hashed token in database
        pool.query(
          "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?",
          [hashedToken, resetTokenExpiry, user.id],
          (err, result) => {
            if (err) return res.status(500).json({ error: "Failed to process request" });
            
            // Create reset URL with original unhashed token
            const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${encodeURIComponent(resetToken)}`;
            
            // Send email with reset link
            sendPasswordResetEmail(user.name, user.email, resetUrl)
              .then(() => {
                res.status(200).json({ 
                  message: "If an account with that email exists, a password reset link has been sent" 
                });
              })
              .catch((emailErr) => {
                console.error("Failed to send reset email:", emailErr);
                res.status(500).json({ message: "Failed to send reset email" });
              });
          }
        );
      }
    );
  } catch (error) {
    console.error("Forgot password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

/**
 * Reset user password using token
 */
const resetPassword = async (req, res) => {
  try {
    const { token, newPassword } = req.body;
    
    // Validate input
    if (!token || !newPassword) {
      return res.status(400).json({ message: "Token and new password are required" });
    }
    
    // Validate password complexity
    if (newPassword.length < 8) {
      return res.status(400).json({ 
        message: "Password must be at least 8 characters long" 
      });
    }

    // Hash the token received from the client to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    // Find user with valid token
    pool.query(
      "SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > ?",
      [hashedToken, new Date()],
      async (err, results) => {
        if (err) return res.status(500).json({ error: "Database error occurred" });
        
        if (results.length === 0) {
          return res.status(400).json({ message: "Invalid or expired reset token" });
        }
        
        const user = results[0];
        
        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Update password and clear reset token
        pool.query(
          "UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?",
          [hashedPassword, user.id],
          (err, result) => {
            if (err) return res.status(500).json({ error: "Failed to update password" });
            
            if (result.affectedRows === 0) {
              return res.status(500).json({ message: "Failed to reset password" });
            }
            
            res.status(200).json({ message: "Password has been reset successfully" });
          }
        );
      }
    );
  } catch (error) {
    console.error("Reset password error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
// At the bottom of AuthController.js
module.exports = { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateProfile,
  forgotPassword,
  resetPassword
};
