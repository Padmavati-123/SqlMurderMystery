const nodemailer = require("nodemailer");
require("dotenv").config(); // Fixed .env path issue

// Create an array of transporters with different email accounts
const transporters = [
  nodemailer.createTransport({
    service: 'gmail',
    // host: "smtp.gmail.com",
    // port: 587,
    // secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASSWORD
    }
  }),
  nodemailer.createTransport({
    service: 'gmail',
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER_SECONDARY,
      pass: process.env.EMAIL_PASSWORD_SECONDARY
    }
  })
];

// Fallback logic: try transporters one by one
const sendMailWithFallback = async (mailOptions) => {
  for (let i = 0; i < transporters.length; i++) {
    try {
      const info = await transporters[i].sendMail(mailOptions);
      console.log(`Email sent using account ${i + 1}:`, info.messageId);
      return info;
    } catch (error) {
      console.warn(`Transporter ${i + 1} failed: ${error.message}`);
    }
  }
  throw new Error("All email transporters failed to send the message.");
};

// Welcome Email
const sendWelcomeEmail = async (name, email) => {
  try {
    console.log(`Attempting to send welcome email to ${email}...`);

    const mailOptions = {
      from: `"SQL Murder Mystery" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Welcome to SQL Murder Mystery Investigation",
      html: `<div style="font-family: 'Courier New', monospace; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; background-color: #f8f8f8;">
        <div style="text-align: center; margin-bottom: 20px;">
          <h1 style="color: #800000;">SQL MURDER MYSTERY</h1>
          <p style="color: #333; font-style: italic;">CONFIDENTIAL CASE FILE</p>
        </div>
        <div style="padding: 20px; background-color: #fff; border: 1px dashed #800000; border-radius: 5px;">
          <h2 style="color: #333;">DETECTIVE ${name.toUpperCase()},</h2>
          <p>Your credentials have been verified and your account has been successfully activated.</p>
          <p>As a new detective on the SQL Murder Mystery case, you now have access to our database of evidence, witness statements, and crime scene reports.</p>
          <div style="background-color: #f0f0f0; padding: 15px; margin: 20px 0; border-left: 4px solid #800000;">
            <p><strong>CASE STATUS:</strong> ACTIVE<br><strong>EVIDENCE:</strong> PENDING ANALYSIS<br><strong>SUSPECT:</strong> UNKNOWN</p>
          </div>
          <p>We need your database skills to solve this mystery. Time is of the essence.</p>
          <div style="text-align: center; margin: 30px 0;">
            <a href="${process.env.FRONTEND_URL}/login" style="background-color: #800000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">ACCESS CRIME DATABASE</a>
          </div>
          <p>Remember, detective, every SQL query brings us closer to the truth.</p>
        </div>
        <div style="text-align: center; margin-top: 20px; color: #666; font-size: 12px;">
          <p>&copy; ${new Date().getFullYear()} SQL Murder Mystery. All rights reserved.</p>
          <p>This is a confidential message. Please do not share.</p>
        </div>
      </div>`
    };

    await sendMailWithFallback(mailOptions);
    console.log("✅ Welcome email sent.");
    return true;
  } catch (error) {
    console.error("❌ Error sending welcome email:", error);
    return false;
  }
};

// Inactivity Email
const sendInactivityEmail = async (name, email, daysSinceLogin) => {
  try {
    const mailOptions = {
      from: `"SQL Murder Mystery" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Case Update: Your SQL Murder Mystery Investigation",
      html: `
      <div style="font-family: 'Courier New', monospace; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #ddd; border-radius: 5px; background-color: #f8f8f8;">
        <h1 style="text-align: center; color: #800000;">SQL MURDER MYSTERY</h1>
        <h2>Detective ${name.toUpperCase()},</h2>
        <p>It has been <strong>${daysSinceLogin} days</strong> since your last login.</p>
        <p>New evidence has emerged. Return to HQ immediately!</p>
        <div style="padding: 15px; background-color: #f0f0f0; border-left: 4px solid #800000;">
          <strong>CASE STATUS:</strong> URGENT<br>
          <strong>DAYS INACTIVE:</strong> ${daysSinceLogin}<br>
          <strong>EVIDENCE:</strong> AWAITING ANALYSIS
        </div>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${process.env.FRONTEND_URL}/login" style="background-color: #800000; color: #fff; padding: 10px 20px; text-decoration: none; border-radius: 4px;">RESUME INVESTIGATION</a>
        </div>
      </div>`
    };

    await sendMailWithFallback(mailOptions);
    console.log("✅ Inactivity email sent.");
    return true;
  } catch (error) {
    console.error("❌ Error sending inactivity email:", error);
    return false;
  }
};

// Password Reset Email
const sendPasswordResetEmail = async (name, email, resetUrl) => {
  try {
    console.log(`Sending password reset to ${email}...`);

    const mailOptions = {
      from: `"SQL Murder Mystery" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Password Reset - SQL Murder Mystery",
      html: `
      <div style="font-family: 'Courier New', monospace; max-width: 600px; margin: auto; padding: 20px; border: 1px solid #ccc; border-radius: 5px;">
        <h1 style="color: #800000;">SQL MURDER MYSTERY</h1>
        <p>Detective ${name.toUpperCase()},</p>
        <p>We've received a request to reset your access credentials.</p>
        <p>If this was you, click the button below:</p>
        <div style="text-align: center; margin: 20px 0;">
          <a href="${resetUrl}" style="background-color: #800000; color: white; padding: 12px 24px; text-decoration: none; border-radius: 5px;">RESET CREDENTIALS</a>
        </div>
        <p style="font-size: 12px;">If you didn’t request this, you can ignore this email.</p>
      </div>`
    };

    await sendMailWithFallback(mailOptions);
    console.log("✅ Password reset email sent.");
    return true;
  } catch (error) {
    console.error("❌ Error sending password reset email:", error);
    return false;
  }
};

// Test All Accounts
const testEmailAccounts = async (testEmail) => {
  const results = [];

  for (let i = 0; i < transporters.length; i++) {
    try {
      const info = await transporters[i].sendMail({
        from: `"SQL Murder Mystery ${i === 0 ? "Primary" : "Secondary"}" <${i === 0 ? process.env.EMAIL_USER : process.env.EMAIL_USER_SECONDARY}>`,
        to: testEmail,
        subject: `Test Email from Account ${i + 1}`,
        html: `<p>This is a test email from transporter ${i + 1}.</p>`
      });

      results.push({ account: i + 1, success: true, messageId: info.messageId });
      console.log(`✅ Test email sent from account ${i + 1}`);
    } catch (err) {
      results.push({ account: i + 1, success: false, error: err.message });
      console.error(`❌ Failed to send from account ${i + 1}:`, err.message);
    }
  }

  return results;
};

module.exports = {
  sendWelcomeEmail,
  sendInactivityEmail,
  sendPasswordResetEmail,
  testEmailAccounts
};
