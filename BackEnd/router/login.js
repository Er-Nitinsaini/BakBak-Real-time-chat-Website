const express = require('express');
const router = express.Router();
const { handleLogin } = require("../controllers/handleLogin");

router.post('/', handleLogin);

module.exports = router;