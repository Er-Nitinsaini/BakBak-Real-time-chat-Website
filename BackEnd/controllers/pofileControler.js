const User = require('../models/user');

exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json({ username: user.Username });
  } catch (error) {
    console.error('Error in getUser:', error);
    res.status(500).json({ message: 'Server error' });
  }
};