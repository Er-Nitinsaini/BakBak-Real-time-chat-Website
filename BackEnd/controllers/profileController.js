const Profile = require('../models/Profile');

// Controller to handle image upload
exports.updateProfile = async (req, res) => {
  const { userId, name, about, phoneNumber } = req.body;

  try {
    let profile = await Profile.findOne({ user: userId });
    if (!profile) {
      profile = new Profile({ user: userId });
    }

    if (name) profile.name = name;
    if (about) profile.about = about;
    if (phoneNumber) profile.phoneNumber = phoneNumber;

    if (req.file) {
      profile.profileImage = `http://localhost:8000/uploads/${req.file.filename}`;
    }

    await profile.save();
    res.status(200).json({ message: 'Profile updated successfully', profile });
  } catch (error) {
    console.error('Error updating profile:', error);
    res.status(500).json({ message: 'Server error' });
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




