const express = require('express');
const router = express.Router();
const userController = require('../controllers/pofileControler');

router.get('/username/:id', userController.getUser);

module.exports = router;