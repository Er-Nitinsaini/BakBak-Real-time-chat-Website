const jwt = require("jsonwebtoken");

const SECRET_KEY = process.env.SECRET_KEY; // Ensure this is set in your .env file

const authenticateToken = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) {
        return res.status(401).json({ msg: "No token provided, please log in" });
    }

    jwt.verify(token, SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ msg: "Invalid or expired token" });
        }
        req.userId = decoded.userId; // Pass userId to the next handler
        next();
    });
};

module.exports = authenticateToken;
