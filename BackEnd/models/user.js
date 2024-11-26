const mongoose = require("mongoose");

const UserSchema = new mongoose.Schema(
  {
    Username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
    }, 
    onlineStatus: {
      type: Boolean,
      default: false,
    },
    lastSeen: {
      type: Date,
      default: Date.now,
    },
    addedUsers:[{
      type: mongoose.Schema.Types.ObjectId, ref: 'User'
    }],
    followers: [{ 
      type: mongoose.Schema.Types.ObjectId, ref: 'User' 
    }]
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
