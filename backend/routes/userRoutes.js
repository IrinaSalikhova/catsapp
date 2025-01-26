const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../model/User');
const jwt = require("jsonwebtoken");

const router = express.Router();
const crypto = require('crypto');

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

router.post('/register', async (req, res) => {
    
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {

        const session = await User.authenticateToken(token);
        if (!session) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

 
        const currentUser = await User.findById(session.UserID);
        if (currentUser.Role !== 'admin') {
            return res.status(403).json({ message: 'User does not have rights for this action' });
        }

    const { email, name, lastName, jobTitle, role, password} = req.body;
    const createdBy = currentUser.UserID;

    if (!email || !name || !lastName || !role || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

   try {
        const response = await User.create({ email, name, lastName, jobTitle, role, password, createdBy });
        res.status(201).json({ 
            message: 'User created successfully!',  
            user: {
                ID: response.insertId,
                Email: email,
                Name: name,
                LastName: lastName,
                JobTitle: jobTitle,
                Role: role,
                IsEnable: true,
                CreateDate: new Date(),
                CreatedBy: createdBy,
            }
         });
    } catch (err) {
        console.error(err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Email already in use' });
        }
        res.status(500).json({ message: 'Error creating user', error: err.message });
    }
} catch (err) {
    console.error(err);
    return res.status(500).json({ message: 'Error validating token' });
}
});

router.delete('/delete/:id', async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1]; // Extract token from Authorization header
    if (!token) {
        return res.status(401).json({ message: 'Unauthorized' });
    }

    try {
        // Validate the token and fetch the user's ID
        const session = await User.authenticateToken(token);
        if (!session) {
            return res.status(401).json({ message: 'Invalid or expired token' });
        }

        // Fetch current user details using the userId from the session
        const currentUser = await User.findById(session.UserID);
        if (currentUser.Role !== 'admin') {
            return res.status(403).json({ message: 'User does not have rights for this action' });
        }

        const userIdToDelete = req.params.id; // Get the ID of the user to delete from the request parameters

        if (!userIdToDelete) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        try {
            const deleteResult = await User.deleteById(userIdToDelete);
            res.status(200).json({
                message: 'User deleted successfully',
                userId: deleteResult.userId,
            });
        } catch (err) {
            console.error(err);
            if (err.message === 'No user found with the provided ID') {
                return res.status(404).json({ message: 'User not found' });
            }
            res.status(500).json({ message: 'Error deleting user', error: err.message });
        }
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error validating token' });
    }
});

// Login user and return token and role
router.post('/login', async (req, res) => {
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

        const isMatch = await bcrypt.compare(password, user.PasswordHash);
        if (!isMatch) {
             return res.status(400).json({ message: 'Invalid credentials' });
         }

        
        const token = jwt.sign({ 
            id: user.UserID,
            name: user.Name,
            lastName: user.LastName,
            role: user.Role
        }, JWT_SECRET, {
            expiresIn: "10d",
        });
        
        res.status(200).json({ 
            message: 'Login successful', 
            token: token,
            role: user.Role
        });
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

router.get('/current', authenticateJWT, async (req, res) => {
    res.status(200).json({
        name: req.userFromToken.name,
        lastName: req.userFromToken.lastName,
        role: req.userFromToken.role,
        });
});


router.get('/usertable', authenticateJWT, async (req, res) => {
   
    try {
        if (req.userFromToken.role !== 'admin') {
            return res.status(403).json({ message: 'User does not have rights to access this table' });
        }
        const users = await User.returnAllUsers();
        
        if (!users) {
            return res.status(404).json({ message: 'No users found' });
        }
        res.status(200).json({
           users
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error fetching users table' });
    }
});

module.exports = router;