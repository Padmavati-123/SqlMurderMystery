const nodemailer = require("nodemailer");

// Replace hardcoded credentials with environment variables
const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
  }
});
// Add this test right after creating your transporter
transporter.verify((error) => {
  if (error) {
    console.error('SMTP Connection Error:', {
      error: error.message,
      code: error.code,
      response: error.response
    });
  } else {
    console.log('SMTP Server is ready to send emails');
  }
});

const sendWelcomeEmail = async (name, email) => {
  try {
    await transporter.sendMail({
      from: `"Crime Scene Investigation" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to Crime Scene Investigation",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #c53030;">CRIME SCENE</h1>
            <p style="color: #666;">Investigation Portal</p>
          </div>
          <div style="padding: 20px; background-color: #f9f9f9; border-radius: 5px;">
            <h2 style="color: #333;">Welcome, ${name}!</h2>
            <p>Thank you for registering with Crime Scene Investigation. Your account has been successfully created.</p>
            <p>You can now log in to access exclusive case files, evidence reports, and collaboration tools.</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="http://localhost:5173/login" style="background-color: #c53030; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Log In Now</a>
            </div>
            <p>If you have any questions or need assistance, please don't hesitate to contact our support team.</p>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
            <p>&copy; ${new Date().getFullYear()} Crime Scene Investigation. All rights reserved.</p>
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      `,
    });
    console.log("Welcome email sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending welcome email:", error);
    return false;
  }
};

const sendInactivityEmail = async (name, email, daysSinceLogin) => {
  try {
    await transporter.sendMail({
      from: `"Crime Scene Investigation" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "We miss you at Crime Scene Investigation",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h1 style="color: #c53030;">CRIME SCENE</h1>
            <p style="color: #666;">Investigation Portal</p>
          </div>
          <div style="padding: 20px; background-color: #f9f9f9; border-radius: 5px;">
            <h2 style="color: #333;">Hello, ${name}</h2>
            <p>We noticed it's been ${daysSinceLogin} days since your last visit to the Crime Scene Investigation portal.</p>
            <p>There are new cases and evidence waiting for your expert analysis!</p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.FRONTEND_URL}/login" style="background-color: #c53030; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px; font-weight: bold;">Return to Investigation</a>
            </div>
            <p>If you need any assistance or have questions about your account, our support team is ready to help.</p>
          </div>
          <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
            <p>&copy; ${new Date().getFullYear()} Crime Scene Investigation. All rights reserved.</p>
            <p>This is an automated message. Please do not reply to this email.</p>
          </div>
        </div>
      `,
    });
    console.log("Inactivity email sent successfully");
    return true;
  } catch (error) {
    console.error("Error sending inactivity email:", error);
    return false;
  }
};


const sendPasswordResetEmail = async (name, email, resetUrl) => {
  try {
    const mailOptions = {
      from: `"Crime Scene Investigation" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Reset Your Password",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <div style="text-align: center; margin-bottom: 20px;">
            <h2 style="color: #c41e3a; margin: 0;">Crime Scene Investigation</h2>
            <p style="color: #555; margin-top: 5px;">Password Reset Request</p>
          </div>
          
          <div style="padding: 20px; background-color: #f8f8f8; border-radius: 5px;">
            <p>Hello, ${name}!</p>
            <p>We received a request to reset your password. If you didn't make this request, you can safely ignore this email.</p>
            <p>To reset your password, click the button below:</p>
            
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background-color: #c41e3a; color: white; padding: 12px 24px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">Reset Password</a>
            </div>
            
            <p>This link will expire in 1 hour for security reasons.</p>
            <p>If you're having trouble clicking the button, copy and paste the URL below into your web browser:</p>
            <p style="word-break: break-all; font-size: 14px; color: #777;">${resetUrl}</p>
          </div>
          
          <div style="margin-top: 20px; padding-top: 20px; border-top: 1px solid #e0e0e0; text-align: center; font-size: 12px; color: #777;">
            <p>&copy; ${new Date().getFullYear()} Crime Scene Investigation. All rights reserved.</p>
            <p>This is an automated email. Please do not reply.</p>
          </div>
        </div>
      `
    };

    await transporter.sendMail(mailOptions);
    console.log("Password reset email sent to:", email);
    return true;
  } catch (error) {
    console.error("Error sending password reset email:", error);
    throw error;
  }
};

module.exports = {
  sendWelcomeEmail,
  sendInactivityEmail,
  sendPasswordResetEmail
};
