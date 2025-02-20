const User = require('./model/User');
const jwt = require("jsonwebtoken");
const rateLimit = require('express-rate-limit');
const JWT_SECRET = process.env.JWT_SECRET;


const authenticateJWT = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token required" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id); 

        if (!user || !user.isEnable) {
            return res.status(403).json({ error: "User account is disabled or deleted" });
        }
        req.userFromToken = user;
        next();
    } catch (err) {
        return res.status(403).json({ error: "Invalid token" });
    }
};

const generatePasswordResetToken = (userId) => {
    return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '1d' });
};

const generateToken = (user) => {
    return jwt.sign({ 
        id: user.id,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
    }, JWT_SECRET, {
        expiresIn: "10d",
    });
};


let globalRequestCount = 0;
const MAX_TOTAL_REQUESTS = 1000; 
const MAX_USER_REQUESTS = 100;
const WINDOW_MS = 20 * 60 * 1000;

setInterval(() => {
    globalRequestCount = 0; // Reset count
}, WINDOW_MS);

const globalRateLimiter = (req, res, next) => {
    if (globalRequestCount >= MAX_TOTAL_REQUESTS) {
        return res.status(429).json({ message: "Too many requests, please try again later." });
    }
    globalRequestCount++;
    next();
};
  
const userRateLimiter = rateLimit({
    windowMs: WINDOW_MS,
    max: MAX_USER_REQUESTS, // Limit each user to 30 requests per window
    keyGenerator: (req) => `${req.headers['x-user-id'] || req.ip}:${req.path}`,
    message: 'Too many requests, please try again later.',
}); 

module.exports = { authenticateJWT, generateToken, generatePasswordResetToken, globalRateLimiter, userRateLimiter };

