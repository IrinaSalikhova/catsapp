const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../model/User');
const jwt = require("jsonwebtoken");

const router = express.Router();

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

router.post('/register', authenticateJWT, async (req, res) => { 
    try {
        if (req.userFromToken.role !== 'admin') {
            return res.status(403).json({ message: 'User does not have rights for this action' });
        }
        const { email, name, lastName, jobTitle, role, password} = req.body;
        const createdBy = req.userFromToken.id;

        if (!email || !name || !lastName || !role || !password) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

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
});

router.delete('/delete/:id', authenticateJWT, async (req, res) => { 
    try {
        if (req.userFromToken.role !== 'admin') {
            return res.status(403).json({ message: 'User does not have rights for this action' });
        }
        
        const userIdToDelete = req.params.id;
        if (!userIdToDelete) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        
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
});

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
        // const isMatch = await bcrypt.compare(password, user.PasswordHash);
        // if (!isMatch) {
        //      return res.status(400).json({ message: 'Invalid credentials' });
        //  }
        
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