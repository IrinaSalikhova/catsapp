const express = require('express');
const bcrypt = require('bcryptjs');
const User = require('../model/User');
const jwt = require("jsonwebtoken");
const {sendEmail, sendPasswordResetEmail} = require("../emailService");
const {authenticateJWT, generatePasswordResetToken } = require("../middleware");

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET;

router.patch('/update/:id', authenticateJWT, async (req, res) => {
    try {
        const userIdToUpdate = req.params.id;
        const updates = req.body;
        const initiatorId = req.userFromToken.id;

        if (req.userFromToken.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied: Admins only' });
        }

        if (!userIdToUpdate || !updates || Object.keys(updates).length === 0) {
            return res.status(400).json({ message: 'Invalid request: No fields to update' });
        }

        const response = await User.update(userIdToUpdate, updates, initiatorId);

        res.status(200).json(response);
    } catch (err) {
        console.error('Error updating user:', err);
        res.status(500).json({ message: 'Error updating user', error: err.message });
    }
});


router.patch('/togglestatus/:id', authenticateJWT, async (req, res) => {
    try {
        if (req.userFromToken.role !== 'admin') {
            return res.status(403).json({ message: 'User does not have rights for this action' });
        }

        const userId = req.params.id;
        const { isEnable } = req.body; 

        if (typeof isEnable !== 'boolean') {
            return res.status(400).json({ message: 'Invalid status value' });
        }

        const result = await User.toggleUserStatus(userId, isEnable);

        res.status(200).json({ message: result.message });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error updating user status', error: err.message });
    }
});

router.post('/changepassword/:token', async (req, res) => {
    try {
        const { token } = req.params;
        const { newPassword } = req.body;
        if (!newPassword) {
            return res.status(400).json({ message: 'New password is required' });
        }

        const decoded = jwt.verify(token, JWT_SECRET);
        const userId = decoded.userId;

        await User.changePassword(userId, newPassword, userId);

        res.status(200).json({ message: 'Password changed successfully' });
    } catch (err) {
        console.error(err);
        if (err.name === 'TokenExpiredError') {
            return res.status(401).json({ message: 'Token expired' });
        }
        res.status(500).json({ message: 'Error changing password', error: err.message });
    }

});

router.post('/sendpasswordreset', async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) {
            return res.status(400).json({ message: 'Email is required' });
        }
        const user = await User.findByEmail(email);
        if (!user) {
            res.status(200).json({ message: 'Password reset email sent' });
        }
        const token = await generatePasswordResetToken(user.ID);
        await sendPasswordResetEmail(email, user.Name, token);

        res.status(200).json({ message: 'Password reset email sent' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error sending password reset email', error: err.message });
    }
});

router.post('/register', authenticateJWT, async (req, res) => { 
    try {
        if (req.userFromToken.role !== 'admin') {
            return res.status(403).json({ message: 'User does not have rights for this action' });
        }
        const { email, name, lastName, jobTitle, role} = req.body;
        const createdBy = req.userFromToken.id;

        if (!email || !name || !lastName || !role ) {
            return res.status(400).json({ message: 'Missing required fields' });
        }

        const response = await User.create({ email, name, lastName, jobTitle, role, createdBy });

        const token = await generatePasswordResetToken(response.userId);
        sendPasswordResetEmail(email, name, token, 'welcome');

    

        res.status(201).json({ 
            message: 'User created successfully!',  
            user: {
                ID: response.userId,
                Email: email,
                Name: name,
                LastName: lastName,
                JobTitle: jobTitle,
                Role: role,
                IsEnable: false,
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
        const isMatch = await bcrypt.compare(password, user.PasswordHash);
        if (!isMatch) {
          return res.status(400).json({ message: 'Invalid credentials' });
        }
        const token = jwt.sign({ 
            id: user.ID,
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