"use client";

import React, { useEffect, useState } from "react";
import { UserPlus, Users } from "lucide-react";

export default function UserConnections({ currentUserId }) {
  const [addedUsers, setAddedUsers] = useState([]);
  const [followers, setFollowers] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("added");

  useEffect(() => {
    const fetchUsers = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const [addedResponse, followersResponse] = await Promise.all([
          fetch(`http://localhost:8000/api/users/${currentUserId}`),
          fetch(`http://localhost:8000/api/users/${currentUserId}/followers`),
        ]);

        const addedData = await addedResponse.json();
        const followersData = await followersResponse.json();

        setAddedUsers(Array.isArray(addedData) ? addedData : []);
        setFollowers(Array.isArray(followersData) ? followersData : []);
      } catch (error) {
        console.error("Error fetching users:", error);
        setError("Failed to fetch user connections. Please try again later.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchUsers();
  }, [currentUserId]);

  const UserList = ({ users }) => (
    <div className="space-y-4">
      {users.map((user) => (
        <div key={user._id} className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
            {user.AvatarUrl ? (
              <img
                src={user.AvatarUrl}
                alt={user.Username}
                className="w-full h-full object-cover"
              />
            ) : (
              <span className="text-lg font-semibold">
                {user.Username.slice(0, 2).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <p className="text-sm font-medium">{user.Username}</p>
          </div>
        </div>
      ))}
    </div>
  );

  const LoadingSkeleton = () => (
    <div className="space-y-4">
      {[...Array(3)].map((_, i) => (
        <div key={i} className="flex items-center space-x-4">
          <div className="w-12 h-12 rounded-full bg-gray-200 animate-pulse" />
          <div className="h-4 bg-gray-200 rounded w-[200px] animate-pulse" />
        </div>
      ))}
    </div>
  );

  return (
    <>
        <div className="">
          <h2 className="text-2xl font-bold  ">Connections</h2>
          <p className="text-gray-600 mb-2 ">View your network connections</p>

          <div className="mb-6">
            <div className="flex border-b">
              <button
                className={`flex items-center px-4 py-2 font-medium ${
                  activeTab === "added"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("added")}
              >
                <UserPlus className="mr-2 h-4 w-4" />
                Added Users
              </button>
              <button
                className={`flex items-center px-4 py-2 font-medium ${
                  activeTab === "followers"
                    ? "text-blue-600 border-b-2 border-blue-600"
                    : "text-gray-500"
                }`}
                onClick={() => setActiveTab("followers")}
              >
                <Users className="mr-2 h-4 w-4" />
                Followers
              </button>
            </div>
          </div>
        </div>
    <div className="w-full max-w-md bg-gray-300 shadow-md rounded-lg overflow-y-scroll scrollbar-hide h-[70%] max-sm:h-[65%] ">
      <div className="p-6">

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4"
            role="alert"
          >
            <p>{error}</p>
          </div>
        )}

        {isLoading ? (
          <LoadingSkeleton />
        ) : (
          <div className="overflow-y-auto max-h-[400px]">
            {activeTab === "added" &&
              (addedUsers.length > 0 ? (
                <UserList users={addedUsers} />
              ) : (
                <p className="text-sm text-gray-500">No users added yet.</p>
              ))}
            {activeTab === "followers" &&
              (followers.length > 0 ? (
                <UserList users={followers} />
              ) : (
                <p className="text-sm text-gray-500">No followers yet.</p>
              ))}
          </div>
        )}
      </div>
    </div>
    </>
  );
}
