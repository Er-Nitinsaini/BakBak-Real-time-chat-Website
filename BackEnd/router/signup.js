
const express = require('express');
const router = express.Router();
const { handleSignup, validateUsername } = require("../controllers/handleSignup");

router.post('/', handleSignup);
router.get('/check-username', validateUsername);

module.exports = router;