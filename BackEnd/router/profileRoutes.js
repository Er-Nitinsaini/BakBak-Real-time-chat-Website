const express = require('express');
const router = express.Router();
const multer = require('multer');
const profileController = require('../controllers/profileController');

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, './uploads'); // Directory where files will be stored
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + require('path').extname(file.originalname));
  },
});

const upload = multer({ storage });

// Route to handle profile photo upload
router.post('/upload-photo', upload.single('profileImage'), profileController.updateProfile);
router.get('/profile/:userId', profileController.getUserProfile);

module.exports = router;
