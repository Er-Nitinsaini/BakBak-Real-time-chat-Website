const Profile = require('../models/Profile');

// Update Profile Controller
exports.updateProfile = async (req, res) => {
  const { userId, name, about, phoneNumber } = req.body;

  try {
    // Validate input
    if (!userId) {
      return res.status(400).json({ message: "User ID is required" });
    }

    let profile = await Profile.findOne({ user: userId });
    if (!profile) {
      profile = new Profile({ user: userId });
    }

    // Update fields
    if (name) profile.name = name;
    if (about) profile.about = about;
    if (phoneNumber) profile.phoneNumber = phoneNumber;

    // Update profile image if uploaded
    if (req.file) {
      profile.profileImage = req.file.path; // URL from Cloudinary
    }

    await profile.save();
    res.status(200).json({ message: "Profile updated successfully", profile });
  } catch (error) {
    console.error("Error updating profile:", error);
    res.status(500).json({ message: "Server error" });
  }
};




exports.getUserProfile = async (req, res) => {
  const { userId } = req.params;

  try {
    const user = await Profile.findOne({ user: userId }).populate('user', 'username'); // Populate username from user collection
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json(user);
  } catch (error) {
    console.error('Error fetching user profile:', error);
    res.status(500).json({ message: 'Server error' });
  }
};




