// signupController.js
const User = require("../models/user");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const handleSignup = async (req, res) => {
    const { Username, email, password } = req.body;
    if (!Username || !email || !password) {
        return res.status(400).json({ msg: "Please provide Username, Email, and Password" });
    }

    try {
        const existingUserEmail = await User.findOne({ email });
        if (existingUserEmail) {
            return res.status(400).json({ error: "Email already exists" });
        }
         
        const existingUserName = await User.findOne({ Username });
        if (existingUserName) {
            return res.status(400).json({ error: "Username already exists" });
        }
        

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = new User({ Username, email, password: hashedPassword });
        await newUser.save();

        const token = jwt.sign({ userId: newUser._id }, process.env.SECRET_KEY, { expiresIn: '1h' });
        res.status(201).json({ msg: "Signup successful", token });
    } catch (error) {
        console.error("Error during signup:", error);
        res.status(500).json({ error: "Server error, please try again later" });
    }
};

// Validate username route
const validateUsername = async (req, res) => {
    const { q } = req.query; // `q` is the query parameter
    if (!q) {
      return res.status(400).json({ error: "Username query is missing" });
    }
  
    try {
      const user = await User.findOne({ Username: q });
      res.status(200).json({ exists: !!user }); // Return true if username exists
    } catch (error) {
      console.error("Error validating username:", error);
      res.status(500).json({ error: "Server error" });
    }
  };

module.exports = { handleSignup, validateUsername};
