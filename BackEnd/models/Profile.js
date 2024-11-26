const mongoose = require('mongoose');

const ProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  name: { type: String, default: '' },
  about: { type: String, default: '' },
  phoneNumber: { type: String, default: '' },
  profileImage: { type: String }, // URL of the uploaded image
});

module.exports = mongoose.model('Profile', ProfileSchema);
