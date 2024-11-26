require('dotenv').config();
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: 'Gmail',
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
    },

});

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
              <p>Thank you for signing in BakBak! To complete your registration, please use the following One-Time Password (OTP) to verify your email address:</p>
              <div class="otp">${otp}</div>
              <p>This OTP will expire in 5 minutes. If you didn't request this verification, please ignore this email.</p>
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


// Generate OTP and Send Email
exports.sendOtp = async (req, res) => {
  const { email } = req.body;
  if (!email) return res.status(400).json({ error: 'Email is required' });

  try {
    const otp = Math.floor(100000 + Math.random() * 900000).toString(); // 6-digit OTP
    const token = jwt.sign({ email, otp }, process.env.YOUR_SECRET_KEY, { expiresIn: '5m' }); // Token valid for 5 minutes

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: 'OTP Verification',
      html: getHtmlContent(otp),
  };

    await transporter.sendMail(mailOptions);
    res.status(200).json({ message: 'OTP sent successfully', token });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Failed to send OTP' });
  }
};

// Verify OTP
exports.verifyOtp = (req, res) => {
  const { otp, token } = req.body;
  if (!otp || !token) return res.status(400).json({ error: 'OTP and token are required' });

  try {
    const decoded = jwt.verify(token, process.env.YOUR_SECRET_KEY);

    if (decoded.otp === otp) {
      return res.status(200).json({ message: 'OTP verified successfully' });
    } else {
      return res.status(400).json({ error: 'Invalid OTP' });
    }
  } catch (error) {
    if (error.name === 'TokenExpiredError') {
      return res.status(400).json({ error: 'OTP has expired' });
    }
    return res.status(400).json({ error: 'Invalid token' });
  }
};
