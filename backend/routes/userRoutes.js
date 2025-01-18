const express = require('express');
const User = require('../model/User');
const router = express.Router();
const crypto = require('crypto');


// Function to generate a random 10-character token
const generateShortToken = () => {
    return crypto.randomBytes(5).toString('hex'); // Generates 10 characters
};

// Create a new user
router.post('/register', async (req, res) => {
    const { email, name, lastName, jobTitle, role, password, createdBy } = req.body;

    if (!email || !name || !lastName || !role || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

   try {
        const user = await User.create({ email, name, lastName, jobTitle, role, password, createdBy });
        res.status(201).json({ message: 'User created successfully!', userId: user.insertId });
    } catch (err) {
        console.error(err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Email already in use' });
        }
        res.status(500).json({ message: 'Error creating user', error: err.message });
    }
});

// Login user and return token and role
router.post('/login', async (req, res) => {
    console.log("Login request received");

    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
    }


    try {
        const user = await User.findByEmail(email);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.IsEnable) {
            return res.status(403).json({ message: 'User account is disabled' });
        }

        const isMatch = await User.comparePassword(password, user.PasswordHash);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate the random 10-character token
        const token = generateShortToken();

        // Store the token in the Sessions table
        await User.createSession(user.ID, token);

        res.status(200).json({ 
            message: 'Login successful', 
            token: `Bearer ${token}`, 
            userId: user.ID });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error logging in', error: err.message });
    }
});

// Logout user and remove token
router.post('/logout', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
        return res.status(400).json({ message: 'Token is required' });
    }

    try {
        // Delete the session from the database
        await User.deleteSession(token);
        res.status(200).json({ message: 'Logged out successfully' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error logging out', error: err.message });
    }
});

router.get('/current', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
    console.log("Token:", token);

    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // Validate the token and fetch the user's ID
        const session = await User.findSessionByToken(token);
        if (!session) {
            return res.status(401).json({ message: 'Invalid token' });
        }
        console.log(session);

        // Fetch user details using the userId from the session
        const user = await User.findById(session.UserID);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        res.status(200).json({
            name: user.Name,
            lastName: user.LastName,
            role: user.Role,
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching user details' });
    }
});

module.exports = router;