const User = require('./model/User');
const jwt = require("jsonwebtoken");
const JWT_SECRET = process.env.JWT_SECRET;

// Middleware to check JWT

const authenticateJWT = async (req, res, next) => {
    const token = req.headers.authorization?.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Token required" });

    try {
        const decoded = jwt.verify(token, JWT_SECRET);
        const user = await User.findById(decoded.id); 

        if (!user || !user.IsEnable) {
            return res.status(403).json({ error: "User account is disabled or deleted" });
        }
        req.userFromToken = decoded;
        next();
    } catch (err) {
        return res.status(403).json({ error: "Invalid token" });
    }
};

const generatePasswordResetToken = (userId) => {
    return jwt.sign({ userId }, JWT_SECRET, { expiresIn: '1d' });
};



module.exports = { authenticateJWT, generatePasswordResetToken };
