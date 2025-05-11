import React, { useState, useEffect } from "react";
import { Search, Trash, Plus } from "lucide-react";
import io from "socket.io-client";
import { useNavigate } from "react-router-dom";
import { ThemeContext } from "../context/ThemeContext";


const socket = io("https://bakbak.onrender.com");

export default function UserSearch({ onUserSelect, currentUserId }) {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [addedUsers, setAddedUsers] = useState([]);
  const navigate = useNavigate();
  const { isDarkMode } = React.useContext(ThemeContext);

  
  useEffect(() => {
    socket.on("unread_messages", (unreadMessages) => {
      setAddedUsers((prevUsers) =>
        prevUsers.map((user) => ({
          ...user,
          hasUnreadMessages: !!unreadMessages[user._id],
        }))
      );
    });
  
    return () => socket.off("unread_messages");
  }, []);
  
  


  useEffect(() => {
    // Listen for online users from the backend
    socket.on("online_users", (onlineUsers) => {
      //console.log("Received online users:", onlineUsers);

      // Update `isOnline` status for added users
      setAddedUsers((prevUsers) =>
        prevUsers.map((user) => ({
          ...user,
          isOnline: Boolean(onlineUsers[user._id]), // Set `isOnline` if user ID exists in `onlineUsers`
        }))
      );
    });

    // Emit user_online event when component mounts
    setInterval(() => {
      if (currentUserId) {
        socket.emit("user_online", currentUserId); // Emit user status periodically
      }
    }, 50000);

    // Cleanup event listener on component unmountgit commit -m "Switch from bcrypt to bcryptjs"
    return () => socket.off("online_users");
  }, [currentUserId]);

  useEffect(() => {
    const fetchAddedUsers = async () => {
      if (!currentUserId) return;

      try {
        const response = await fetch(
          `https://bakbak.onrender.com/api/users/${currentUserId}`
        );
        const users = await response.json();
        setAddedUsers(Array.isArray(users) ? users : []);
      } catch (error) {
        console.error("Error fetching added users:", error);
      }
    };

    fetchAddedUsers();
  }, [currentUserId]);

  useEffect(() => {
    const fetchUsers = async () => {
      if (searchTerm.trim() === "") {
        setFilteredUsers([]);
        return;
      }
      try {
        const response = await fetch(
          `https://bakbak.onrender.com/api/users/search?q=${searchTerm}`
        );
        const users = await response.json();
        const filtered = users.filter((user) => user._id !== currentUserId);
        setFilteredUsers(filtered.length ? filtered : []);
      } catch (error) {
        console.error("Error fetching users:", error);
      }
    };

    const debounceTimer = setTimeout(() => {
      fetchUsers();
    }, 300);

    return () => clearTimeout(debounceTimer);
  }, [searchTerm, currentUserId]);

  const handleAddUser = async (user) => {
    if (
      Array.isArray(addedUsers) &&
      !addedUsers.some((u) => u._id === user._id)
    ) {
      try {
        const response = await fetch(
          `https://bakbak.onrender.com/api/users/users/${currentUserId}/add/${user._id}`,
          { method: "POST" }
        );
        const updatedUsers = await response.json();
        setAddedUsers(Array.isArray(updatedUsers) ? updatedUsers : []);
      } catch (error) {
        console.error("Error adding user:", error);
      }
    }
  };

  const handleRemoveUser = async (userId) => {
    try {
      const response = await fetch(
        `https://bakbak.onrender.com/api/users/${currentUserId}/remove/${userId}`,
        {
          method: "DELETE",
        }
      );

      if (response.ok) {
        setAddedUsers((prevAddedUsers) =>
          prevAddedUsers.filter((user) => user._id !== userId)
        );
        navigate("/");
      } else {
        console.error("Failed to remove user");
      }
    } catch (error) {
      console.error("Error removing user:", error);
    }
  };

  const handleUserSelect = (user) => {
    if (!user || !user._id) {
      console.warn("Invalid user selected:", user);
      return;
    }
  
    onUserSelect(user); // Notify parent component about selected user
  
    // Emit the `clear_unread` event to backend
    socket.emit("clear_unread", { userId: currentUserId, senderId: user._id });
  
    // Update the unread indicator locally with defensive checks
    setAddedUsers((prevUsers) =>
      (prevUsers || []).map((u) => {
        if (!u || !u._id) return null; // Handle null or invalid users
        return u._id === user._id ? { ...u, hasUnreadMessages: false } : u;
      }).filter(Boolean) // Remove any `null` entries
    );
  };
  
  
  

  return (
    <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-800'} p-4 bg-gray-200`}>
      <div className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-800'} relative mb-4`}>
        <Search className="absolute left-2 top-2.5 h-4 w-4 text-gray-500" />
        <input
          type="text"
          placeholder="Search Users"
          className={`${isDarkMode ? 'bg-gray-900 text-white' : 'bg-gray-200 text-gray-800'} w-full pl-8 pr-2 py-2  border border-gray-300 rounded-md text-sm focus:outline-none`}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="overflow-y-scroll scrollbar-hide h-auto">
        {searchTerm.trim() === "" ? (
          <div className="text-gray-500"></div>
        ) : filteredUsers.length === 0 ? (
          <div className="text-red-500">User not found</div>
        ) : (
          filteredUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between p-2 hover:bg-gray-300 rounded-full"
              
            >
              <span>{user.Username}</span>
              <button
                className="bg-blue-500 text-white rounded-full px-2 py-1"
                onClick={() => handleAddUser(user) && setSearchTerm("")}
              >
                <Plus className="h-[20px] w-[15px]" />
              </button>
            </div>
          ))
        )}
      </div>

      <div className="mt-4">
        <h3 className="text-lg font-semibold">Added Users:</h3>
        {addedUsers.length > 0 ? (
          addedUsers.map((user) => (
            <div
              key={user._id}
              className="flex items-center justify-between p-2 bg-gray-100 rounded-full mt-2 cursor-pointer hover:bg-gray-300 hover:font-bold"
              onClick={() => handleUserSelect(user)}
              //onClick={() => onUserSelect(user)}
            >
              <span className="flex items-center">
              {user.hasUnreadMessages && (
            <span className="w-3 h-3 bg-red-500 rounded-full mr-2"></span>
          )}
                <span
                  className={`ml-2 mr-2 m w-3 h-3 flex items-end rounded-full ${
                    user.isOnline ? "bg-green-500" : "bg-gray-300"
                  }`}
                ></span>
                {user.Username}
              </span>

              <button
                className="bg-red-500 text-white rounded-full px-2 py-1"
                onClick={(e) => {
                  e.stopPropagation();
                  handleRemoveUser(user._id);
                }}
              >
                <Trash className="h-[20px] w-[15px]" />
              </button>
            </div>
          ))
        ) : (
          <div className="text-gray-500">No users added.</div>
        )}
      </div>
    </div>
  );
}
