const nodemailer = require("nodemailer");


const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: "padmavatikudal2025@gmail.com",
      pass: "jfuh sbtf cusc pmey",
    }
  });

const sendWelcomeEmail = async (name, email) => {
  try {
    await transporter.sendMail({
      from: '"Crime Scene Investigation" <noreply@crimescene.com>',
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
      from: '"Crime Scene Investigation" <noreply@crimescene.com>',
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

module.exports = {
  sendWelcomeEmail,
  sendInactivityEmail,
};