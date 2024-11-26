const User = require('../models/user');
const mongoose = require('mongoose');

// Search for users by Username
exports.searchUsers = async (req, res) => {
  const searchTerm = req.query.q || ''; // Use query parameter `q` for the search term
  try {
    const users = await User.find({
      Username: { $regex: searchTerm, $options: 'i' } // Case insensitive search based on "Username"
    });
    res.json(users);
    
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//AddUser 

exports.addUser = async (req, res) => {
  const userIdToAdd = req.params.userId.trim(); // Trim whitespace/newlines
  const currentUserId = req.params.id.trim();

  try {
    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return res.status(404).json({ message: "Current user not found" });
    }
    
    if (!currentUser.addedUsers.includes(userIdToAdd)) {
      currentUser.addedUsers.push(userIdToAdd);
      await currentUser.save();
    }

    const updatedUserList = await User.findById(currentUserId).populate("addedUsers");
    res.status(200).json(updatedUserList.addedUsers);
  } catch (error) {
    res.status(500).json({ message: "Error adding user", error });
  }
};


// Get added users for the current user
exports.getAddedUsers = async (req, res) => {
  const currentUserId = req.params.id; // Check if `id` is correctly retrieved

  if (!currentUserId) {
      return res.status(400).json({ message: "User ID is required" });
  }

  try {
      const user = await User.findById(currentUserId).populate("addedUsers");
      if (!user) {
          return res.status(404).json({ message: "User not found" });
      }
      res.status(200).json(user.addedUsers);
  } catch (error) {
      res.status(500).json({ message: "Error retrieving added users", error });
  }
};


// delete user
exports.deleteUser = async (req, res) => {
  const { currentUserId, userId } = req.params;

  //console.log(`Attempting to remove user ${userId} from ${currentUserId}'s added users`);

  if (!mongoose.Types.ObjectId.isValid(currentUserId) || !mongoose.Types.ObjectId.isValid(userId)) {
    console.log('Invalid ObjectId:', { currentUserId, userId });
    return res.status(400).json({ message: "Invalid user ID format" });
  }

  try {
    const currentUser = await User.findById(currentUserId);
    
    if (!currentUser) {
      console.log(`User not found: ${currentUserId}`);
      return res.status(404).json({ message: "User not found" });
    }

    console.log('Current user addedUsers before deletion:', currentUser.addedUsers);

    if (!Array.isArray(currentUser.addedUsers)) {
      console.log('addedUsers is not an array:', currentUser.addedUsers);
      return res.status(500).json({ message: "Internal error: addedUsers is not an array" });
    }

    const initialLength = currentUser.addedUsers.length;
    currentUser.addedUsers = currentUser.addedUsers.filter(
      (id) => id.toString() !== userId
    );

    if (currentUser.addedUsers.length === initialLength) {
      console.log(`User ${userId} not found in addedUsers`);
      return res.status(404).json({ message: "User to delete not found in the list" });
    }

    

    await currentUser.save();

    // Fetch the updated user data to ensure we have the most recent state
    const updatedUser = await User.findById(currentUserId);

    // Return the updated list of added users
    return res.status(200).json({ 
      message: "User successfully removed", 
      addedUsers: updatedUser.addedUsers 
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error", error: error.message });
  }
};


//get follower


exports.getFollowers = async (req, res) => {
  const { userId } = req.params; 

  try {
      
      const followers = await User.find({ addedUsers: userId }, 'Username');

      res.status(200).json(followers);
  } catch (error) {
      console.error("Error fetching followers:", error);
      res.status(500).json({ message: "Error fetching followers", error });
  }
};


