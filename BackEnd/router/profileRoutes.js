const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');
const upload = require("../config/cloudinary");



// Route to handle profile photo upload
router.post("/update-profile", upload.single("profileImage"), profileController.updateProfile);
router.get('/profile/:userId', profileController.getUserProfile);

module.exports = router;
