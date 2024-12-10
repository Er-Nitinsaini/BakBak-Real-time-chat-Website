import React, { useState, useEffect, useRef } from "react";
import { User, Users, Settings, Skull, Send, X, Trash } from "lucide-react";
import { io } from "socket.io-client";
import { useNavigate } from "react-router-dom";
import UserSearch from "./UserSearch";
import ChatHeader from "./ChatHeader";
import Profile from "./Profile";
import Contect from "./Contect";
import Setting from "./Setting";
import HackChat from "./AnonomousHackChat"

import axios from "axios";

const socket = io("https://bakbak.onrender.com");

export default function Component() {
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState({});
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false); //profile component
  const [isContectOpen, setIsContectOpen] = useState(false); //contect component
  const [isSettingOpen, setIsSettingOpen] = useState(false); //setting component
  const [isHackChatOpen, setIsHackChatOpen] = useState(false); // hack chat
  const [selectedUsers, setSelectedUsers] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const chatContainerRef = useRef(null);
  const [currentUserId, setCurrentUserId] = useState(null);
  const [conversationId, setconversationId] = useState(null);
  const [selectedMessageId, setSelectedMessageId] = useState(null);
  const [isAnimating, setIsAnimating] = useState(false); //animation
  const [token, settoken] = useState();
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    settoken(token);
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
    }
  }, [navigate]);

  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.userId;
      setCurrentUserId(userId);
    }
  });

  const handleMessageSelect = (msgId) => {
    if (selectedMessageId === msgId) {
      setSelectedMessageId(null); // Deselect if same message is clicked
    } else {
      setSelectedMessageId(msgId); // Select the new message
    }
  };

  ///nwewew

  useEffect(() => {
    if (selectedUser && currentUserId) {
      const conversationId = [currentUserId, selectedUser._id].sort().join("_");
      socket.emit("join_conversation", conversationId);
    }
  }, [selectedUser, currentUserId]);

  // Send message
  const handleSendMessage = async () => {
    if (message.trim() && selectedUser) {
      const newMessage = {
        text: message,
        senderId: currentUserId,
        receiverId: selectedUser._id,
        timestamp: new Date().toLocaleString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }),
      };

      try {
        // Send message to backend
        await axios.post(
          "https://bakbak.onrender.com/api/conversations/message",
          newMessage
        );

        // Emit message to Socket.IO for real-time messaging
        const conversationId = [currentUserId, selectedUser._id]
          .sort()
          .join("_");
        socket.emit("send_message", { conversationId, message: newMessage });
        //console.log("store"+conversationId)
        // Update messages in the UI
        setMessages((prevMessages) => ({
          ...prevMessages,
          [selectedUser._id]: [
            ...(prevMessages[selectedUser._id] || []),
            newMessage,
          ],
        }));

        setMessage(""); // Clear input field
      } catch (error) {
        console.error("Error sending message:", error);
      }
    }
  };

  //fatched

  // Assuming `selectedUser` and `currentUser` are available
  useEffect(() => {
    const fetchOrCreateConversation = async () => {
      try {
        const response = await axios.post(
          "https://bakbak.onrender.com/api/conversations/conversations/findOrCreate",
          {
            userId1: currentUserId,
            userId2: selectedUser._id,
          }
        );
        const conversation = response.data;
        //console.log("Fetched or created conversation:", conversation);

        if (conversation._id) {
          await fetchMessages(conversation._id);
          setconversationId(conversation._id);
        } else {
          console.error("Conversation ID not found.");
        }
      } catch (error) {
        console.error("Error fetching or creating conversation:", error);
      }
    };

    if (selectedUser) {
      fetchOrCreateConversation();
    }
  }, [selectedUser]);

  const fetchMessages = async (conversationId, page = 1, limit = 10) => {
    //console.log("Fetching messages for conversation ID:", conversationId);
    try {
      const response = await axios.get(
        `https://bakbak.onrender.com/api/conversations/${conversationId}/messages`,
        { params: { page, limit } }
      );

      const formattedMessages = response.data.map((msg) => ({
        ...msg,
        timestamp: new Date(msg.timestamp).toLocaleString("en-US", {
          hour: "2-digit",
          minute: "2-digit",
          hour12: true,
          day: "2-digit",
          month: "2-digit",
          year: "2-digit",
        }),
      }));

      // Update the messages state with fetched messages for the selected user
      setMessages((prevMessages) => ({
        ...prevMessages,
        [selectedUser._id]: formattedMessages,
      }));
    } catch (error) {
      console.error("Error fetching messages:", error);
    }
  };

  //handel Delete masage

  const handleDeleteMessage = async (messageId) => {
    console.log(
      `Deleting message with ID ${messageId} in conversation ${conversationId}`
    );
    try {
      // Send DELETE request to backend to remove the message
      await axios.delete(
        `https://bakbak.onrender.com/api/conversations/${conversationId}/messages/${messageId}`
      );

      // Remove the message from the state (optimistic update)
      setMessages((prevMessages) => {
        const updatedMessages = { ...prevMessages };
        updatedMessages[selectedUser._id] = updatedMessages[
          selectedUser._id
        ].filter((msg) => msg._id !== messageId);
        return updatedMessages;
      });
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  useEffect(() => {
    socket.on("receive_message", (newMessage) => {
      setMessages((prevMessages) => {
        const userId =
          newMessage.senderId === currentUserId
            ? selectedUser._id
            : newMessage.senderId;
        return {
          ...prevMessages,
          [userId]: [...(prevMessages[userId] || []), newMessage],
        };
      });
    });

    return () => {
      socket.off("receive_message");
    };
  }, [currentUserId, selectedUser]);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const addUserToChat = (user) => {
    setSelectedUsers((prev) => [...prev, user]);
  };

  const handleUserSelect = (user) => {
    setSelectedUser(user);
  };

  const toggleProfile = () => {
    if (isProfileOpen) {
      setIsAnimating(true); // Trigger the closing animation
      setTimeout(() => {
        setIsProfileOpen(false); // Close the popup after animation completes
        setIsAnimating(false); // Reset animation state
      }, 300); // Duration of the animation (in ms)
    } else {
      setIsProfileOpen(true);
    }
  };

  const toggleContect = () => {
    if (isContectOpen) {
      setIsAnimating(true); // Trigger the closing animation
      setTimeout(() => {
        setIsContectOpen(false); // Close the popup after animation completes
        setIsAnimating(false); // Reset animation state
      }, 300); // Duration of the animation (in ms)
    } else {
      setIsContectOpen(true);
    }
  };

  const toggleSetting = () => {
    if (isSettingOpen) {
      setIsAnimating(true); // Trigger the closing animation
      setTimeout(() => {
        setIsSettingOpen(false); // Close the popup after animation completes
        setIsAnimating(false); // Reset animation state
      }, 300); // Duration of the animation (in ms)
    } else {
      setIsSettingOpen(true);
    }
  };
  const toggleHackChat = () => {
    if (isHackChatOpen) {
      setIsAnimating(true); // Trigger the closing animation
      setTimeout(() => {
        setIsHackChatOpen(false); // Close the popup after animation completes
        setIsAnimating(false); // Reset animation state
      }, 300); // Duration of the animation (in ms)
    } else {
      setIsHackChatOpen(true);
    }
  };

  return (
    <div className="flex h-screen bg-gray-200 text-gray-800 overflow-hidden">
      {/* Sidebar */}
      <div
        className={`${
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        } transform transition-transform duration-300 ease-in-out fixed inset-y-0 left-0 z-30 w-64 bg-gray-200 flex flex-col md:relative md:translate-x-0`}
      >
        <div className="p-4 bg-gray-200">
          <img src="bk.png" alt="logo" className="h-14 " />
          <h1 className="text-xl font-bold text-gray-800">Chats</h1>
          <button
            className="md:hidden absolute top-4 right-4 text-gray-600 hover:text-gray-800 focus:outline-none"
            onClick={toggleSidebar}
          >
            <X className="h-6 w-6" />
          </button>
        </div>
        <div className="flex-grow overflow-y-scroll no-scrollbar">
          <UserSearch
            onAddUser={addUserToChat}
            onUserSelect={handleUserSelect}
            currentUserId={currentUserId}
          />
        </div>
        <div className="p-4 bg-gray-200 flex justify-between">
          <button
            onClick={toggleProfile}
            className="text-[#6b4ad4] hover:text-black font-extrabold"
          >
            <User className="h-5 w-5" />
          </button>
          <button
            onClick={toggleContect}
            className="text-[#6b4ad4] hover:text-gray-800 focus:outline-none"
          >
            <Users className="h-5 w-5" />
          </button>
          <button
            onClick={toggleSetting}
            className="text-[#6b4ad4] hover:text-gray-800 focus:outline-none"
          >
            <Settings className="h-5 w-5" />
          </button>
          <button 
          onClick={toggleHackChat}
          className="text-[red] hover:text-yellow-300 focus:outline-none bg-black rounded-full ">
            <Skull className="h-7 w-7" />
          </button>
        </div>
      </div>

      {isProfileOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
          <div
            className={`bg-gray-200 p-6 rounded-lg w-96 h-[70%] shadow-lg relative ml-9 mt-40 max-sm:ml-0  text-black ${
              isAnimating ? "slide-down" : "slide-up"
            }`}
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
              onClick={toggleProfile}
            >
              <X className="h-5 w-5 text-red-800" />
            </button>
            <Profile /> {/* Render the profile component */}
          </div>
        </div>
      )}

      {/* Contect Popup */}
      {isContectOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
          <div
            className={`bg-gray-200 p-6 rounded-lg w-96 h-[70%] shadow-lg relative ml-12 mt-40 max-sm:ml-0  text-black ${
              isAnimating ? "slide-down" : "slide-up"
            }`}
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
              onClick={toggleContect}
            >
              <X className="h-5 w-5 text-red-950 font-extrabold" />
            </button>
            <Contect currentUserId={currentUserId} />{" "}
            {/* Render the contecrt component */}
          </div>
        </div>
      )}

      {/* Setting Popup */}
      {isSettingOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex">
          <div
            className={`bg-gray-200 p-6 rounded-lg w-96 h-[70%] shadow-lg relative ml-8 mt-40 max-sm:ml-0   text-black ${
              isAnimating ? "slide-down" : "slide-up"
            }`}
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
              onClick={toggleSetting}
            >
              <X className="h-5 w-5" />
            </button>
            <Setting /> {/* Render the Setting component */}
          </div>
        </div>
      )}
      {/* Hack chat */}
      {isHackChatOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-100 z-50 flex">
          <div
            className={`p-6 rounded-lg w-[100%] h-[100%] shadow-lg relative ml-8 mt-8 mr-8 max-sm:ml-0 max-sm:mr-0  bg-black text-white ${
              isAnimating ? "slide-down" : "slide-up"
            }`}
          >
            <button
              className="absolute top-2 right-2 text-gray-400 hover:text-gray-200"
              onClick={toggleHackChat}
            >
              <X className="h-5 w-5" />
            </button>
            <HackChat />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col rounded-xl">
        <ChatHeader
          toggleSidebar={toggleSidebar}
          selectedUser={selectedUser}
          token={token}
        />

        {/* Chat area */}
        <div
          ref={chatContainerRef}
          className="flex-1 bg-gray-300 p-4 overflow-y-scroll no-scrollbar rounded-xl"
        >
          {selectedUser &&
            (messages[selectedUser._id] || []).map((msg, index) => (
              <div
                key={index}
                onClick={() => handleMessageSelect(msg._id)}
                className={`mb-4 flex ${
                  msg.senderId === currentUserId
                    ? "justify-end"
                    : "justify-start"
                }`}
              >
                <div
                  className={`p-3 rounded-lg max-w-xs lg:max-w-md ${
                    msg.senderId === currentUserId
                      ? "bg-[#6b4ad4] text-white"
                      : "bg-white text-black"
                  }`}
                >
                  <span
                    className={`text-[7px] font-bold flex justify-center  ${
                      msg.senderId === currentUserId
                        ? "text-blue-100"
                        : "text-gray-900"
                    } block text-right mt-1`}
                  >
                    <span className="text-[16px] font-bold mr-3 mt-[-8px]">
                      {msg.text}
                    </span>
                    <br />

                    {msg.timestamp.split(", ")[1]}
                    <br />
                    {/* {msg.timestamp.split(", ")[0]} */}
                  </span>
                </div>
                {/* Conditionally render delete pop-up */}
                {selectedMessageId === msg._id &&
                  msg.senderId === currentUserId && (
                    <div
                      className="relative top-0 right-0 bg-red-600 p-2 shadow-lg rounded-full"
                      style={{ marginTop: "5px", marginRight: "5px", marginLeft: '5px' }} // Adjust position as needed
                    >
                      <button
                        onClick={(e) => {
                          e.stopPropagation(); // Prevent triggering handleMessageSelect
                          handleDeleteMessage(msg._id); // Call delete handler
                          setSelectedMessageId(null); // Deselect after deletion
                        }}
                        className="text-red-500 text-xs"
                      >
                        <Trash className="font-extrabold text-white mt-1" />
                      </button>
                    </div>
                  )}
              </div>
            ))}
        </div>

        {/* Message input */}
        <div className="bg-gray-200 p-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              placeholder="Type a message"
              className="flex-1 bg-white border border-gray-300 rounded-full px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
            />
            <button
              className="bg-[#6b4ad4] hover:bg-blue-600 text-white p-2 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500"
              onClick={handleSendMessage}
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
