const Conversation = require('../models/Message');

// Add a new message to a conversation
const addMessage = async (req, res) => {
  const { senderId, receiverId, text } = req.body;
  try {
    // Find or create a conversation between sender and receiver
    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] }
    });

    if (!conversation) {
      // If no conversation exists, create a new one
      conversation = new Conversation({
        participants: [senderId, receiverId],
        messages: []
      });
    }

    // Add the new message to the messages array
    conversation.messages.push({ senderId, text }); 
    await conversation.save();

    res.status(200).json(conversation);
  } catch (error) {
    console.error('Error adding message:', error);
    res.status(500).json({ error: 'Failed to add message' });
  }
};

// Retrieve paginated messages from a conversation
const getMessages = async (req, res) => {
  const { conversationId } = req.params;
  // console.log("Fetching messages for conversation ID:", conversationId);

  try {
    const conversation = await Conversation.findById(conversationId);
    if (!conversation) {
      // console.log("Conversation not found:", conversationId);
      return res.status(404).json({ error: 'Conversation not found' });
    }

    // console.log("Found conversation:", conversation);
    res.status(200).json(conversation.messages);
  } catch (error) {
    // console.error("Error retrieving messages:", error);
    res.status(500).json({ error: 'Failed to retrieve messages' });
  }
};

//get conversation id

const conversationID = async (req, res) => {
  const { userId1, userId2 } = req.body;
  try {
    let conversation = await Conversation.findOne({
      participants: { $all: [userId1, userId2] },
    });
    if (!conversation) {
      conversation = await Conversation.create({
        participants: [userId1, userId2],
      });
    }
    res.status(200).json(conversation);
  } catch (error) {
    res.status(500).json({ error: "Failed to get or create conversation" });
  }
};


module.exports = {
  addMessage,
  getMessages,
  conversationID
};
