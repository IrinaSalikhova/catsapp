const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../model/User');
const jwt = require("jsonwebtoken");
const {sendEmail, sendPasswordResetEmail} = require("../emailService");
const {authenticateJWT, generatePasswordResetToken, generateToken, userRateLimiter } = require("../middleware");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.patch('/update/:id', authenticateJWT, userRateLimiter, async (req, res) => {
    try {
        const userId = req.params.id;
        const updates = req.body;
        const initiatorId = req.userFromToken.id;

        if (req.userFromToken.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied: Admins only' });
        }

        if (!userId || !updates || Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'Invalid request: No fields to update' });
        }

        const userToUpdate = await User.findById(userId);
        const response = await userToUpdate.update(updates, initiatorId);

        res.status(200).json(response);
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ message: 'Error updating user', error: err.message });
    }
});

router.patch('/togglestatus/:id', authenticateJWT, userRateLimiter, async (req, res) => {
    try {
        if (req.userFromToken.role !== 'admin') {
            return res.status(403).json({ message: 'User does not have rights for this action' });
        }

        const userId = req.params.id;
        const { isEnable } = req.body; 
        const initiatorId = req.userFromToken.id;

        if (typeof isEnable !== 'boolean') {
            return res.status(400).json({ message: 'Invalid status value' });
        }
        const userToUpdate = await User.findById(userId);
        const result = await userToUpdate.toggleUserStatus(isEnable, initiatorId);

        res.status(200).json({ message: result.message });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating user status', error: err.message });
    }
});

router.post('/changepassword', authenticateJWT, userRateLimiter, async (req, res) => {
    try {
        const { newPassword } = req.body;
        if (!newPassword) {
            return res.status(400).json({ message: 'New password is required' });
        }
        console.log(req.userFromToken);
        const userToUpdate = req.userFromToken;

        await userToUpdate.changePassword(newPassword, userToUpdate.id);

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (err) {
        console.error(err);
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        res.status(500).json({ message: 'Error changing password', error: err.message });
    }

});

router.post('/sendpasswordreset', userRateLimiter, async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        const user = await User.findByEmail(email);
        if (!user) {
            res.status(200).json({ message: 'Password reset email sent' });
        }
        const token = await generatePasswordResetToken(user.id);
        await sendPasswordResetEmail(email, user.firstName, token);

        res.status(200).json({ message: 'Password reset email sent' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error sending password reset email', error: err.message });
    }
});

router.post('/register', authenticateJWT, userRateLimiter, async (req, res) => { 
    try {
        if (req.userFromToken.role !== 'admin') {
            return res.status(403).json({ message: 'User does not have rights for this action' });
        }
        const { email, firstName, lastName, jobTitle, role} = req.body;
        const createdBy = req.userFromToken.id;

        if (!email || !firstName || !lastName || !role ) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const createdUser = await User.create({ email, firstName, lastName, jobTitle, role, createdBy });

        const token = await generatePasswordResetToken(createdUser.id);
        sendPasswordResetEmail(email, firstName, token, 'welcome');

        res.status(201).json({ 
            message: 'User created successfully!',  
            user: createdUser
         });
    } catch (err) {
        console.error(err);
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ message: 'Email already in use' });
        }
        res.status(500).json({ message: 'Error creating user', error: err.message });
    }
});

router.delete('/delete/:id', authenticateJWT, userRateLimiter, async (req, res) => { 
    try {
        if (req.userFromToken.role !== 'admin') {
            return res.status(403).json({ message: 'User does not have rights for this action' });
        }
        
        const userId = req.params.id;
        if (!userId) {
            return res.status(400).json({ message: 'User ID is required' });
        }
        const userToDelete = await User.findById(userId);
        
        const deleteResponse = await userToDelete.delete();
        res.status(200).json({
            deleteResponse
        });
    } catch (err) {
        console.error(err);
        if (err.message === 'No user found with the provided ID') {
            return res.status(404).json({ message: 'User not found' });
        }
        res.status(500).json({ message: 'Error deleting user', error: err.message });
    }
});

router.post('/login', userRateLimiter, async (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const user = await User.findByEmail(email);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }
        if (!user.isEnable) {
            return res.status(403).json({ message: 'User account is disabled' });
        }
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = generateToken(user);
        
        res.status(200).json({ 
            message: 'Login successful', 
            token: token,
            role: user.role
        });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error logging in', error: err.message });
    }
});

router.get('/current', authenticateJWT, userRateLimiter, async (req, res) => {
    res.status(200).json({
        firstName: req.userFromToken.firstName,
        lastName: req.userFromToken.lastName,
        role: req.userFromToken.role,
        });
});

router.get('/usertable', authenticateJWT, userRateLimiter, async (req, res) => {
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