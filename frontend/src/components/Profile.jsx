import React, { useState, useRef, useEffect } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const [username, setUsername] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [about, setAbout] = useState("");
  const [name, setName] = useState("");
  const [profileImage, setProfileImage] = useState("");
  const [isEditing, setIsEditing] = useState({ about: false, phone: false });
  const fileInputRef = useRef(null);
  const navigate = useNavigate();
  const [loading, setLoading] = useState(true); // Add loading state
  const [error, setError] = useState(null);

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("profileImage", file);

    const token = localStorage.getItem("token");
    const payload = JSON.parse(atob(token.split(".")[1])); // Decode JWT
    const userId = payload.userId;
    formData.append("userId", userId); // Include userId in the request body

    try {
      const response = await fetch(
        "https://bakbak.onrender.com/api/profile/update-profile",
        {
          method: "POST",
          body: formData,
        }
      );

      if (!response.ok) {
        throw new Error("Failed to upload image");
      }

      const data = await response.json();
      setProfileImage(data.profile.profileImage); // Update state with the new image URL
      alert("Profile photo updated successfully");
    } catch (error) {
      console.error("Error uploading profile image:", error);
      alert("Failed to upload profile photo");
    }
  };

  useEffect(() => {
    const fetchUserData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          const userId = payload.userId;

          const response = await fetch(
            `https://bakbak.onrender.com/api/profile/profile/${userId}`
          );
          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }

          const userData = await response.json();
          setUsername(userData.username);
          setProfileImage(userData.profileImage || ""); // Set profile image
          setAbout(userData.about || "");
          setName(userData.name || "");
          setPhoneNumber(userData.phoneNumber || "");
        } catch (error) {
          console.error("Error fetching user data:", error);
        }
      }
    };

    fetchUserData();
  }, []);

  const handleUpdateField = async (field, value) => {
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("User is not authenticated");

      const payload = JSON.parse(atob(token.split(".")[1]));
      const userId = payload.userId;

      const response = await fetch(
        `https://bakbak.onrender.com/api/profile/update-profile`,
        {
          method: "POST", // Ensure you're using PUT for updating
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ userId, [field]: value }),
        }
      );

      if (!response.ok) {
        throw new Error("Failed to update profile field");
      }

      const responseData = await response.json();

      // Log the response data to check if it returns the updated profile
      //console.log("Profile update response:", responseData);

      // Update frontend state after successful update
      if (responseData.profile) {
        // Update the profile state
        const updatedProfile = responseData.profile;
        if (field === "about") setAbout(updatedProfile.about);
        if (field === "phoneNumber") setPhoneNumber(updatedProfile.phoneNumber);
        if (field === "name") setName(updatedProfile.name);
      }

      //alert(`${field.charAt(0).toUpperCase() + field.slice(1)} updated successfully`);
    } catch (error) {
      console.error("Error updating profile field:", error);
      alert("Failed to update profile field");
    } finally {
      setIsEditing({ ...isEditing, [field]: false });
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem("token");
      if (token) {
        try {
          const payload = JSON.parse(atob(token.split(".")[1]));
          const userId = payload.userId; // Ensure 'id' is correct

          // Fetch user data from your API
          const response = await fetch(
            `https://bakbak.onrender.com/api/username/${userId}`
          ); // Adjust URL if necessary
          if (!response.ok) {
            throw new Error("Failed to fetch user data");
          }
          const userData = await response.json();
          setUsername(userData.username);
        } catch (error) {
          setError(error.message); // Set error message
          console.error("Error fetching user data:", error);
        } finally {
          setLoading(false); // Set loading to false when done
        }
      } else {
        setLoading(false); // Handle case when no token is found
      }
    };

    fetchData();
  });

  if (loading) {
    return <p>Loading...</p>; // Display loading message
  }

  if (error) {
    return <p className="text-red-500">{error}</p>; // Display error message
  }

  return (
    <div className="text-black  h-[100%] overflow-y-scroll scrollbar-hide  ">
      <h2 className="text-xl font-bold text-center">Welcome, {username}!</h2>
      <div className="max-w-md mx-auto bg-gray-200 rounded-lg  p-4 text-black">
        <div className="relative">
          <div className="w-24 h-24 mx-auto relative group">
            <img
              src={profileImage}
              alt={username}
              className="w-full h-full rounded-full object-cover text-center border-4 border-[#6b4ad4]"
            />
            <button
              onClick={() => fileInputRef.current?.click()}
              className="absolute inset-0 bg-black bg-opacity-70 text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
            >
             {profileImage ? "Change Photo" : "Add Photo"}
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              accept="image/*"
              className="hidden"
            />
          </div>
          <div className="mt-4">
            <div className="flex justify-between items-center">
              <label className="text-black">Name :</label>
              <button
                onClick={() =>
                  setIsEditing({ ...isEditing, name: !isEditing.name })
                }
                className="text-blue-900 text-sm"
              >
                {isEditing.name ? "Save" : "Edit"}
              </button>
            </div>
            {isEditing.name ? (
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                onBlur={() => handleUpdateField("name", name)}
                placeholder="Enter your Name"
                className="w-full bg-gray-300 rounded p-2 text-black font-extrabold"
              />
            ) : (
              <p className="text-black font-extrabold">{name}</p>
            )}
          </div>
        </div>

        <div className="mt-3 space-y-6">
          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <label className="text-black">About :</label>
              <button
                onClick={() =>
                  setIsEditing({ ...isEditing, about: !isEditing.about })
                }
                className="text-blue-800 text-sm"
              >
                {isEditing.about ? "Save" : "Edit"}
              </button>
            </div>
            {isEditing.about ? (
              <input
                value={about}
                onChange={(e) => setAbout(e.target.value)}
                onBlur={() => handleUpdateField("about", about)}
                className="w-full bg-gray-300 rounded p-2 text-black font-extrabold"
                placeholder="Bio"
              />
            ) : (
              <p className="text-black font-semibold">{about}</p>
            )}
          </div>

          <div className="">
            <div className="flex justify-between items-center">
              <label className="text-black">Phone Number :</label>
              <button
                onClick={() =>
                  setIsEditing({ ...isEditing, phone: !isEditing.phone })
                }
                className="text-blue-800 text-sm"
              >
                {isEditing.phone ? "Save" : "Edit"}
              </button>
            </div>
            {isEditing.phone ? (
              <input
                type="tel"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                onBlur={() => handleUpdateField("phoneNumber", phoneNumber)}
                className="w-full bg-gray-300 rounded p-2 text-black"
                placeholder=""
              />
            ) : (
              <p className="text-black font-extrabold">+91 {phoneNumber}</p>
            )}
          </div>
        </div>

        <button
          onClick={handleLogout}
          className="w-full mt-2 bg-red-500 hover:bg-red-600 text-white font-bold py-2 px-4 rounded transition-colors"
        >
          Log out
        </button>
        
      </div>
    </div>
  );
}
