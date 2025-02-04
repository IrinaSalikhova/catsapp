const bcrypt = require('bcryptjs');
const db = require('../db');
const util = require('util');
const validator = require('validator');
const Joi = require('joi');

const queryAsync = util.promisify(db.query).bind(db);

const userSchema = Joi.object({
    id: Joi.number().integer().optional(), //optional because of create for now
    email: Joi.string().email().required(),
    name: Joi.string().min(2).max(50).optional(),
    lastName: Joi.string().min(2).max(50).optional(),
    jobTitle: Joi.string().optional(),
    role: Joi.string().valid("admin", "navigator").required(),
    password: Joi.string().min(3).max(20).optional(), //optional because of update
    isEnable: Joi.boolean().default(false),
    createdBy: Joi.number().allow(null).optional(),
    createDate: Joi.date().optional(),
    lastupdateBy: Joi.number().allow(null).optional(),
    lastupdateDate: Joi.date().optional()   
});

class User {
    static async create({ email, name, lastName, jobTitle, role, createdBy }) {
        try {
            const { error, value } = userSchema.validate({
                email, 
                name, 
                lastName, 
                jobTitle, 
                role, 
                createdBy
            });
            if (error) {
                throw new Error(`Validation error: ${error.details.map(detail => detail.message).join(', ')}`);
            }

            const existingUser = await User.findByEmail(value.email);
            if (existingUser) {
                throw new Error("A user with this email already exists");
            }

            const query = `
                INSERT INTO Users (Email, Name, LastName, JobTitle, Role, IsEnable, CreatedBy, LastupdateBy)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const result = await queryAsync(
                query, 
                [
                    value.email, 
                    value.name, 
                    value.lastName, 
                    value.jobTitle || null,
                    value.role, 
                    value.isEnable, 
                    value.createdBy || null, 
                    value.createdBy || null, 
                ]
            );
            return { message: "User created successfully.", userId: result.insertId };

        } catch (err) {
            throw new Error(`Error creating user: ${err.message}`);
        }
    }

    static async findById(userId) {
        try {
            userId = Number(userId);
            if (!userId || typeof userId !== 'number') {
                throw new Error("Invalid user ID");
            }

            const query = 'SELECT * FROM Users WHERE Id = ?';
            const results = await queryAsync(query, [userId]);

            return results.length ? results[0] : null;
        } catch (err) {
            throw new Error(`Error finding user by ID: ${err.message}`);
        }
    }

    static async deleteById(userId) {
        try {
            userId = Number(userId);
            if (!userId || typeof userId !== 'number') {
                throw new Error("Invalid user ID");
            }

            const query = 'DELETE FROM Users WHERE Id = ?';
            const results = await queryAsync(query, [userId]);

            if (results.affectedRows === 0) {
                throw new Error('No user found with the provided ID');
            }

            return { message: 'User deleted successfully', userId };
        } catch (err) {
            throw new Error(`Error deleting user: ${err.message}`);
        }
    }
    
    static async findByEmail(email) {
        try {
            if (!email || !validator.isEmail(email)) {
                return null;
            }
            const query = 'SELECT * FROM Users WHERE Email = ?';
            
            const results = await queryAsync(query, [email]);
            return results.length ? results[0] : null;

        } catch (err) {
            throw new Error(`Error finding user by email: ${err.message}`);
        }
    }

    static async returnAllUsers() {
        try {
            const query = 'SELECT * FROM Users';
            const results = await queryAsync(query);
            return results.length ? results : { message: "No users found" };
        } catch (err) {
            throw new Error(`Error fetching all users: ${err.message}`);
        }
    }

    static async changePassword(userId, newPassword, initiatorId) {
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }

            if (!newPassword || newPassword.length < 3 || newPassword.length > 20) {
                throw new Error("Password must be between 3 and 20 characters");
            }
            const passwordHash = await bcrypt.hash(newPassword, 10);
            const query = 'UPDATE Users SET PasswordHash = ?, LastupdateDate = ?, LastupdateBy = ? WHERE Id = ?';
            
            const result = await queryAsync(query, [passwordHash, new Date(), initiatorId, userId]);
            if (result.affectedRows === 0) {
                throw new Error('Failed to update password');
            }
            return { message: 'Password changed successfully' };
        } catch (err) {
            throw new Error(`Error changing password: ${err.message}`);
        }
    }

    static async toggleUserStatus(userId, isEnable) { // raw yet, not tested
        try {
            const user = await User.findById(userId);
            if (!user) {
                throw new Error("User not found");
            }

            const query = 'UPDATE Users SET IsEnable = ?, LastupdateDate = ? WHERE Id = ?';
            const result = await queryAsync(query, [isEnable, new Date(), userId]);

            if (result.affectedRows === 0) {
                throw new Error('Failed to update user status');
            }

            return { message: isEnable ? 'User activated successfully' : 'User deactivated successfully' };
        } catch (err) {
            throw new Error(`Error updating user status: ${err.message}`);
        }
    }

    static async update(userId, updates, initiatorId) { // raw yet, not tested
        try {
            const allowedFields = ['email', 'name', 'lastName', 'jobTitle', 'role'];
            const updatesToApply = {};

            for (const key of Object.keys(updates)) {
                if (!allowedFields.includes(key)) {
                    throw new Error(`Cannot update field: ${key}`);
                }
                updatesToApply[key] = updates[key];
            }

            if (Object.keys(updatesToApply).length === 0) {
                throw new Error('No valid fields to update');
            }

            updatesToApply.LastupdateBy = initiatorId;

            const updateFields = Object.keys(updatesToApply).map(key => `${key} = ?`).join(', ');
            const query = `UPDATE Users SET ${updateFields} WHERE Id = ?`;

            const result = await queryAsync(query, [...Object.values(updatesToApply), userId]);

            if (result.affectedRows === 0) {
                throw new Error('Failed to update user');
            }

            return { message: 'User updated successfully' };
        } catch (err) {
            throw new Error(`Error updating user: ${err.message}`);
        }
    }

}

module.exports = User;
