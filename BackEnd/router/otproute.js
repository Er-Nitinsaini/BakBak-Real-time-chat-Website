const express = require('express');
const { sendOtp, verifyOtp } = require('../controllers/otpController');
const router = express.Router();

router.post('/api/send-otp', sendOtp);
router.post('/api/verify-otp', verifyOtp);

module.exports = router;
