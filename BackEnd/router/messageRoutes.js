const express = require('express');
const router = express.Router();
const conversationController = require('../controllers/messageController');

// Route to add a message
router.post('/message', conversationController.addMessage);

// Route to get paginated messages for a conversation
router.get('/:conversationId/messages', conversationController.getMessages);

router.post("/conversations/findOrCreate",conversationController.conversationID);

router.delete('/:conversationId/messages/:messageId',conversationController.massageDelete);

module.exports = router;
