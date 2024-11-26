let onlineUsers = {};
let unreadMessages = {};

function initializeSocket(io) {
  io.on("connection", (socket) => {
    //console.log("A user connected:", socket.id);

    socket.on("user_online", (userId) => {
      onlineUsers[userId] = socket.id;
      io.emit("online_users", onlineUsers);
    });

    socket.on("join_conversation", (conversationId) => {
      socket.join(conversationId);
      //console.log(`User joined conversation: ${conversationId}`);
    });

    socket.on("send_message", (messageData) => {
      const { conversationId, message } = messageData;
      const { senderId, receiverId } = message;

      // If receiver is offline or not in the same room, mark as unread
      if (
        !onlineUsers[receiverId] ||
        !io.sockets.adapter.rooms
          .get(conversationId)
          ?.has(onlineUsers[receiverId])
      ) {
        if (!unreadMessages[receiverId]) unreadMessages[receiverId] = {};
        unreadMessages[receiverId][senderId] = true;

        // Notify receiver if online but not in conversation
        if (onlineUsers[receiverId]) {
          io.to(onlineUsers[receiverId]).emit(
            "unread_messages",
            unreadMessages[receiverId]
          );
        }
      }

      // Emit message to the conversation room
      socket.to(conversationId).emit("receive_message", message);
    });

    socket.on("clear_unread", ({ userId, senderId }) => {
      if (unreadMessages[userId] && unreadMessages[userId][senderId]) {
        delete unreadMessages[userId][senderId];

        if (Object.keys(unreadMessages[userId]).length === 0) {
          delete unreadMessages[userId];
        }
      }

      // Always emit an empty object if no messages remain for a user
      const updatedUnread = unreadMessages[userId] || {};
      io.to(onlineUsers[userId]).emit("unread_messages", updatedUnread);
    });

    socket.on("disconnect", () => {
      const userId = Object.keys(onlineUsers).find(
        (key) => onlineUsers[key] === socket.id
      );
      if (userId) {
        delete onlineUsers[userId];
        io.emit("online_users", onlineUsers);
        //console.log(`User ${userId} is offline`);
      }
    });
  });
}

module.exports = initializeSocket;
