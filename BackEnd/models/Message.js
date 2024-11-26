const mongoose = require('mongoose');

// Message Schema
const messageSchema = new mongoose.Schema({
  senderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  timestamp: {
    type: Date,
    default: Date.now
  }
});

// Conversation Schema
const conversationSchema = new mongoose.Schema({
  participants: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true
    }
  ],
  messages: [messageSchema]
});

// TTL index for auto-deletion of old messages
conversationSchema.index({ "messages.timestamp": 1 }, { expireAfterSeconds: 2592000 }); // 30 days

module.exports = mongoose.model('Conversation', conversationSchema);
