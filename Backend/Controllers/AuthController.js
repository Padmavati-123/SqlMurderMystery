const pool = require("../Config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require('crypto');
const { sendWelcomeEmail, sendInactivityEmail, sendPasswordResetEmail } = require("../src/utils/emailService");

const registerUser = (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }

  // Validate email format
  if (!email.match(/^\S+@\S+\.\S+$/)) {
    return res.status(400).json({ message: "Invalid email format" });
  }

  // Validate password strength
  if (password.length < 8) {
    return res.status(400).json({ message: "Password must be at least 8 characters long" });
  }

  const hashedPassword = bcrypt.hashSync(password, 10);

  pool.query(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashedPassword],
    (err, result) => {
      if (err) {
        // Check for duplicate email
        if (err.code === 'ER_DUP_ENTRY') {
          return res.status(409).json({ message: "Email already in use" });
        }
        return res.status(500).json({ error: err.message });
      }

      console.log(`User registered successfully: ${email}`);

      // Send welcome email
      sendWelcomeEmail(name, email)
        .then((emailSent) => {
          if (emailSent) {
            console.log(`Welcome email sent successfully to ${email}`);
            res.status(201).json({ 
              message: "User registered successfully. Welcome email sent." 
            });
          } else {
            console.warn(`User registered but welcome email failed to send to ${email}`);
            res.status(201).json({ 
              message: "User registered successfully, but welcome email could not be sent." 
            });
          }
        })
        .catch((emailErr) => {
          console.error(`Email failed to send to ${email}:`, emailErr);
          res.status(201).json({ 
            message: "User registered, but email failed to send." 
          });
        });
    }
  );
};

const loginUser = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Email and password are required" });
  }

  pool.query("SELECT * FROM users WHERE email = ?", [email], (err, result) => {
    if (err) {
      console.error("Database error during login:", err);
      return res.status(500).json({ error: "Database error occurred" });
    }

    if (result.length === 0) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const user = result[0];

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    // Update last login time
    pool.query(
      "UPDATE users SET last_login = NOW() WHERE id = ?",
      [user.id],
      (updateErr) => {
        if (updateErr) {
          console.warn(`Failed to update last login time for user ${user.id}:`, updateErr);
        }
      }
    );

    const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, {
      expiresIn: "1h",
    });

    console.log(`User logged in successfully: ${email}`);
    res.json({ 
      token, 
      user: { 
        id: user.id, 
        name: user.name, 
        email: user.email 
      } 
    });
  });
};

const getUserProfile = (req, res) => {
  pool.query("SELECT id, name, email FROM users WHERE id = ?", [req.user.id], (err, result) => {
    if (err) {
      console.error("Database error getting user profile:", err);
      return res.status(500).json({ error: "Database error occurred" });
    }

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
      console.error("Database connection error:", err);
      return res.status(500).json({ error: "Database connection error" });
    }
    
    connection.beginTransaction((err) => {
      if (err) {
        connection.release();
        console.error("Transaction start error:", err);
        return res.status(500).json({ error: "Transaction error" });
      }

      connection.query(
        "SELECT * FROM users WHERE id = ?",
        [userId],
        (err, results) => {
          if (err) {
            return connection.rollback(() => {
              connection.release();
              console.error("User select error:", err);
              res.status(500).json({ error: "Database error occurred" });
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
            // Validate password strength
            if (newPassword.length < 8) {
              return connection.rollback(() => {
                connection.release();
                res.status(400).json({ message: "New password must be at least 8 characters long" });
              });
            }

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
                console.error("Profile update error:", err);
                // Check for duplicate email
                if (err.code === 'ER_DUP_ENTRY') {
                  return res.status(409).json({ message: "Email already in use by another account" });
                }
                res.status(500).json({ error: "Failed to update profile" });
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
                    console.error("Select updated user error:", err);
                    res.status(500).json({ error: "Database error occurred" });
                  });
                }

                connection.commit((err) => {
                  if (err) {
                    return connection.rollback(() => {
                      connection.release();
                      console.error("Commit error:", err);
                      res.status(500).json({ error: "Commit error" });
                    });
                  }
                  
                  connection.release();
                  console.log(`Profile updated successfully for user ID: ${userId}`);
                  
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

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    
    // Validate email
    if (!email || !email.match(/^\S+@\S+\.\S+$/)) {
      return res.status(400).json({ message: "Valid email is required" });
    }

    console.log(`Processing password reset request for email: ${email}`);

    // Generate secure token
    const resetToken = crypto.randomBytes(32).toString('hex');
    const hashedToken = crypto.createHash('sha256').update(resetToken).digest('hex');
    const resetTokenExpiry = new Date(Date.now() + 3600000); // 1 hour from now

    // Find user with the provided email
    pool.query(
      "SELECT * FROM users WHERE email = ?", 
      [email], 
      (err, results) => {
        if (err) {
          console.error("Database error during forgot password:", err);
          return res.status(500).json({ error: "Database error occurred" });
        }
        
        // Don't reveal if user exists for security reasons
        if (results.length === 0) {
          console.log(`No user found with email: ${email}`);
          return res.status(200).json({ 
            message: "If an account with that email exists, a password reset link has been sent" 
          });
        }
        
        const user = results[0];
        console.log(`User found, generating reset token for user ID: ${user.id}`);
        
        // Store hashed token in database
        pool.query(
          "UPDATE users SET reset_token = ?, reset_token_expiry = ? WHERE id = ?",
          [hashedToken, resetTokenExpiry, user.id],
          (err, result) => {
            if (err) {
              console.error("Failed to update reset token:", err);
              return res.status(500).json({ error: "Failed to process request" });
            }
            
            // Create reset URL with original unhashed token
            const resetUrl = `${process.env.FRONTEND_URL}/reset-password/${encodeURIComponent(resetToken)}`;
            console.log(`Generated reset URL: ${resetUrl}`);
            
            // Send email with reset link
            sendPasswordResetEmail(user.name, user.email, resetUrl)
              .then(() => {
                console.log(`Reset password email sent successfully to ${user.email}`);
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

    console.log("Processing password reset with token");

    // Hash the token received from the client to compare with stored hash
    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    
    // Find user with valid token
    pool.query(
      "SELECT * FROM users WHERE reset_token = ? AND reset_token_expiry > ?",
      [hashedToken, new Date()],
      async (err, results) => {
        if (err) {
          console.error("Database error during password reset:", err);
          return res.status(500).json({ error: "Database error occurred" });
        }
        
        if (results.length === 0) {
          console.log("Invalid or expired token used in password reset attempt");
          return res.status(400).json({ message: "Invalid or expired reset token" });
        }
        
        const user = results[0];
        console.log(`Valid token for user ID: ${user.id}, proceeding with password reset`);
        
        // Hash new password
        const hashedPassword = await bcrypt.hash(newPassword, 12);

        // Update password and clear reset token
        pool.query(
          "UPDATE users SET password = ?, reset_token = NULL, reset_token_expiry = NULL WHERE id = ?",
          [hashedPassword, user.id],
          (err, result) => {
            if (err) {
              console.error("Failed to update password:", err);
              return res.status(500).json({ error: "Failed to update password" });
            }
            
            if (result.affectedRows === 0) {
              return res.status(500).json({ message: "Failed to reset password" });
            }
            
            console.log(`Password successfully reset for user ID: ${user.id}`);
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

module.exports = { 
  registerUser, 
  loginUser, 
  getUserProfile, 
  updateProfile,
  forgotPassword,
  resetPassword
};