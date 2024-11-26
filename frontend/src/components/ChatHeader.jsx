import React, { useEffect, useState } from "react";
import { Phone, Video, MoreHorizontal, Menu, X } from "lucide-react";
import io from "socket.io-client";

const socket = io("http://localhost:8000");

export default function ChatHeader({ selectedUser, toggleSidebar, token }) {
  const [username, setUsername] = useState("User");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [onlineUsers, setOnlineUsers] = useState({});
  const [profileImage, setProfileImage] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);

  const fetchUserDataa = async () => {
    const userId = getUserIdFromToken(token);
    try {
      const response = await fetch(
        `http://localhost:8000/api/profile/profile/${userId}`
      );
      if (!response.ok) {
        setProfileImage(""); // Set profile image
      }

      const userData = await response.json();
      setProfileImage(userData.profileImage); // Set profile image
     // console.log("response  jhjbjkhhj hbkjkj  :" + response);
    } catch (error) {
      console.error("Error fetching user data:", error);
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const userId = selectedUser._id;

        const response = await fetch(
          `http://localhost:8000/api/profile/profile/${userId}`
        );
        if (!response.ok) {
          setProfileImage(""); // Set profile image
        }

        const userData = await response.json();
        setProfileImage(userData.profileImage || ""); // Set profile image
        // console.log("response :" + response);
      } catch (error) {
        console.error("Error fetching user data:", error);
      }
    };

    fetchUserData();
  }, [selectedUser]);

  const getUserIdFromToken = (token) => {
    if (token) {
      try {
        const decodedToken = JSON.parse(atob(token.split(".")[1]));
        return decodedToken.userId;
      } catch (error) {
        console.error("Invalid token", error);
        return null;
      }
    }
    return null;
  };

  const fetchUserData = async () => {
    const userId = getUserIdFromToken(token);
    if (userId) {
      try {
        const response = await fetch(
          `http://localhost:8000/api/username/${userId}`
        );

        if (!response.ok) throw new Error("Failed to fetch user data");

        const data = await response.json();
        setUsername(data.username);
      } catch (error) {
        setError(error.message);
        console.error("Error fetching user data:", error);
      } finally {
        setLoading(false);
      }
    } else {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchUserData();
      fetchUserDataa();
      const userId = getUserIdFromToken(token);
      if (userId) {
        socket.emit("user_online", userId);
      }
    } else {
      setLoading(false);
    }

    socket.on("online_users", (users) => {
      setOnlineUsers(users);
    });

    return () => {
      socket.off("online_users");
    };
  }, [token]);

  const getUserStatus = (userId) =>
    onlineUsers[userId] ? "Online" : "Offline";

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  const isSelectedUserOnline = getUserStatus(selectedUser?._id) === "Online";
  const isLoggedInUserOnline =
    getUserStatus(getUserIdFromToken(token)) === "Online";

  // Function to open the modal
  const openModal = () => {
    setIsModalOpen(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <div className="bg-gray-200 p-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <button
          className="md:hidden text-[#6b4ad4] hover:text-gray-800 focus:outline-none"
          onClick={toggleSidebar}
        >
          <Menu className="h-6 w-6" />
        </button>
        <div className="w-10 h-10 rounded-full bg-gray-400 flex items-center justify-center cursor-pointer">
          {profileImage ? (
            <img
              src={profileImage}
              alt="Profile"
              className="w-full h-full rounded-full object-cover"
              style={{border:"2px solid #6b4ad4"}}
              onClick={openModal}
            />
          ) : (
            <span className="text-black font-bold text-lg"  >
              {selectedUser?.username?.charAt(0).toUpperCase() ||
                username.charAt(0).toUpperCase()}
            </span>
          )}
        </div>
        <div>
          <h2 className="font-semibold text-gray-800 " >
            {selectedUser
              ? selectedUser.Username
              : `Welcome, ${username}. (you)`}
          </h2>
          <p
            className={`text-xs ${
              selectedUser
                ? isSelectedUserOnline
                  ? "text-green-500"
                  : "text-gray-500"
                : isLoggedInUserOnline
                ? "text-green-500"
                : "text-gray-500"
            }`}
          >
            {selectedUser
              ? isSelectedUserOnline
                ? "Online"
                : "Offline"
              : isLoggedInUserOnline
              ? "Online"
              : "Offline"}
          </p>
        </div>
      </div>
      <div className="flex space-x-2">
        {[<Phone />, <Video />, <MoreHorizontal />].map((Icon, idx) => (
          <button
            key={idx}
            className="text-[#6b4ad4] hover:text-gray-800 focus:outline-none"
          >
            {Icon}
          </button>
        ))}
      </div>

      {isModalOpen && (
        <div
          className="fixed inset-0 bg-gray-700 bg-opacity-50 flex items-center justify-center z-50 cursor-pointer"
          onClick={closeModal}
        >
          <div
            className="bg-gray-200 p-5 rounded-3xl"
            onClick={(e) => e.stopPropagation()} // Prevent modal close when clicking inside
          >
            <button className="mt-[-10px] text-red-500 " onClick={closeModal}>
              <X />
            </button>
            <img
              src={profileImage}
              alt="Profile"
              className="w-96 h-96 object-cover rounded-full cursor-pointer"
            />
          </div>
        </div>
      )}
    </div>
  );
}
