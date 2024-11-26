const mongoose = require('mongoose');

const connectDB = async () => {
  try {
    // Connect to MongoDB using environment variable for connection string
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected...');
  } catch (error) {
    console.error('Database connection failed:', error.message);
    process.exit(1);  // Exit the process if connection fails
  }
};

connectDB();
module.exports = mongoose;
