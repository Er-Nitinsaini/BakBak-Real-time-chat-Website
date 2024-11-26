//index.js
require('dotenv').config();
const express = require("express");
const mongoose = require("./config/db");
const bodyParser = require('body-parser');
const cors = require("cors");
const http = require("http");

const { Server } = require("socket.io");

// Import routes
const loginRoute = require("./router/login");
const signUpRoute = require("./router/signup");
const userRoutes = require('./router/userListRoutes');
const profileRoute = require('./router/profileRoute')
const messageRoute = require('./router/messageRoutes')
const otpRoutes = require('./router/otproute');
const resetPasswordRoute = require('./router/resetPasswordRoutes')
const authenticateToken = require('./middleware/authMiddleware');
const profileEditRoute = require('./router/profileRoutes') // JWT middleware

// Import socket setup
const initializeSocket = require("./socket");

const app = express();
const port = process.env.PORT || 8000;

const corsOptions = {
  origin: 'https://bak-bak-sigma.vercel.app',
  methods: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"],
  credentials: true,
};

// Middleware setup
app.use(cors(corsOptions));
app.use(express.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(express.json());
app.use('/uploads', express.static('uploads'));

// Public Routes (No Authentication Needed)
app.use('/login', loginRoute);
app.use('/re-set', resetPasswordRoute)
app.use('/signup', signUpRoute);
app.use('/otp', otpRoutes);
app.use('/api/users', userRoutes);
app.use('/api',profileRoute);
app.use('/api/conversations', messageRoute)
// Protected Routes (JWT Authentication Required)
app.use('/api/profile', profileEditRoute);
app.use('/api/userss', authenticateToken); // Protect user-related routes

// Create HTTP server and Socket.IO instance
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "https://bak-bak-sigma.vercel.app",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

// Initialize Socket.IO logic from external file
initializeSocket(io);

// Start server
server.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
