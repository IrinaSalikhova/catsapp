
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to check JWT
const authenticateJWT = (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token required" });

    jwt.verify(token, JWT_SECRET, (err, user) => {
        if (err) return res.status(403).json({ error: "Invalid token" });
        req.userFromToken = user;
        next();
    });
};

const generatePasswordResetToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1d' });
};

const generateLoginToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1d' });
};

module.exports = { authenticateJWT, generatePasswordResetToken };
