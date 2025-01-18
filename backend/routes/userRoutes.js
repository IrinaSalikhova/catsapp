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
    const { email, name, lastName, jobTitle, role, password } = req.body;

    try {
        const user = await User.create({ email, name, lastName, jobTitle, role, password });
        res.status(201).json({ message: 'User created successfully!', userId: user.insertId });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error creating user', error: err.message });
    }
});

// Login user and return token
router.post('/login', async (req, res) => {
    console.log("Login request received");
    const { email, password } = req.body;

    try {
        const user = await User.findByEmail(email);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
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
            token, 
            userId: user.ID });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error logging in', error: err.message });
    }
});

// Logout user and remove token
router.post('/logout', async (req, res) => {
    const { token } = req.headers;

    try {
        // Delete the session from the database
        await User.deleteSession(token);
        res.send('Logged out successfully');
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error logging out', error: err.message });
    }
});
module.exports = router;