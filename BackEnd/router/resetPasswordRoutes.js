const express = require('express');
const { forgetPasswordOtp, forgetPasswordVerifyOtp, resetPasswordOtp } = require('../controllers/forgetPassword');
const router = express.Router();

router.post('/forgetpassword-otp', forgetPasswordOtp);
router.post('/verifypassword-otp', forgetPasswordVerifyOtp);
router.post('/reset-password', resetPasswordOtp);

module.exports = router;