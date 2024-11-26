
const bcrypt = require("bcryptjs");
const nodemailer = require("nodemailer");
const User = require("../models/user");

let otps = {};


// HTML email template
function getHtmlContent(otp) {
  return `
  <!DOCTYPE html>
  <html lang="en">
  <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Verify Your Email</title>
      <style>
      body {
          font-family: Arial, sans-serif;
          line-height: 1.6;
          margin: 0;
          padding: 0;
          -webkit-font-smoothing: antialiased;
          -moz-osx-font-smoothing: grayscale;
      }
      .container {
          max-width: 600px;
          margin: 0 auto;
          padding: 20px;
      }
      .header {
          background-color: #f8f9fa;
          padding: 20px;
          text-align: center;
      }
      .content {
          background-color: #ffffff;
          padding: 20px;
      }
      .footer {
          background-color: #f8f9fa;
          padding: 20px;
          text-align: center;
          font-size: 12px;
          color: #6c757d;
      }
      .button {
          display: inline-block;
          padding: 10px 20px;
          background-color: #007bff;
          color: #ffffff;
          text-decoration: none;
          border-radius: 5px;
          font-weight: bold;
      }
      .otp {
          font-size: 24px;
          font-weight: bold;
          letter-spacing: 5px;
          margin: 20px 0;
          text-align: center;
      }
  </style>
  </head>
  <body>
      <div class="container">
          <div class="header">
              <h1>Email Verification</h1>
          </div>
          <div class="content">
              <p>Hello user</p>
              <p>! To complete your Re-set Password, please use the following One-Time Password (OTP) to verify your email address:</p>
              <div class="otp">${otp}</div>
              <p>This OTP will expire in 5 minutes. If you didn't request Re-Set Password. Contect Us</p>
              <p>Do not Shar thise Otp Anyone...</p>
          </div>
          <div class="footer">
              <p>This is an automated message, please do not reply to this email.</p>
              <p>&copy; ${new Date().getFullYear()} BakBak. All rights reserved.</p>
          </div>
      </div>
  </body>
  </html>
`;
}

//send otp
const forgetPasswordOtp = async (req, res) => {
    const { email } = req.body;
  const user = await User.findOne({ email });

  if (!user) {
    return res.status(404).json({ error: "Email not found" });
  }

  const otp = Math.floor(100000 + Math.random() * 900000); // Generate 6-digit OTP
  otps[email] = { otp, expires: Date.now() + 300000 }; // OTP expires in 5 mins

  // Send OTP via email
  const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  try {
    await transporter.sendMail({
      to: email,
      subject: "Your OTP for Password Reset",
      html: getHtmlContent(otp),
    });
    res.json({ message: "OTP sent to your email" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to send OTP" });
  }
};

//verify otp
const forgetPasswordVerifyOtp =  (req, res) => {
    const { email, otp } = req.body;
    const record = otps[email];
  
    if (!record || record.otp !== parseInt(otp) || record.expires < Date.now()) {
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }
  
    delete otps[email]; // Remove OTP after verification
    res.json({ message: "OTP verified" });
  };


//reset password
const resetPasswordOtp = async (req, res) => {
    try {
      const { email, newPassword } = req.body;
      const user = await User.findOne({ email });
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
  
      // Check if the new password is the same as the current password
      const isSamePassword = await bcrypt.compare(newPassword, user.password);
      if (isSamePassword) {
        return res.status(400).json({ error: "New password cannot be the same as the current password" });
      }
  
      // Update the password with the new hashed password
      user.password = await bcrypt.hash(newPassword, 10);
      await user.save();
  
      res.json({ message: "Password reset successful" });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: "An error occurred while resetting the password" });
    }
  };
  

module.exports = {forgetPasswordOtp, forgetPasswordVerifyOtp , resetPasswordOtp}