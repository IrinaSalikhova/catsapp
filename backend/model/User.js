const bcrypt = require('bcryptjs');
const db = require('../db');
const util = require('util');
const validator = require('validator');
const Joi = require('joi');

const queryAsync = util.promisify(db.query).bind(db);

const userSchema = Joi.object({
    id: Joi.number().integer().optional(), //because of create
    email: Joi.string().email().required(),
    role: Joi.string().valid("admin", "navigator").required(),
    firstName: Joi.string().min(2).max(50).allow(null).optional(),
    lastName: Joi.string().min(2).max(50).allow(null).optional(),
    jobTitle: Joi.string().allow(null).optional(),
    password: Joi.string().max(260).allow(null).optional(),
    isEnable: Joi.boolean().allow(null).default(false),
    createdBy: Joi.string().allow(null).optional(),
    createDate: Joi.date().allow(null).optional(),
    lastUpdateBy: Joi.string().allow(null).optional(),
    lastUpdateDate: Joi.date().allow(null).optional()
});

class User {
    constructor(data) {
        const { error, value } = userSchema.validate(data);
        if (error) throw new Error(`Validation error: ${error.details.map(d => d.message).join(', ')}`);
        this.id = value.id;
        this.email = value.email;
        this.role = value.role;
        this.firstName = value.firstName;
        this.lastName = value.lastName;
        this.jobTitle = value.jobTitle;
        this.password = value.password;
        this.isEnable = value.isEnable instanceof Buffer ? Boolean(value.isEnable.readUInt8(0)) : value.isEnable;
        this.createdBy = value.createdBy;
        this.createDate = value.createDate;
        this.lastUpdateBy = value.lastUpdateBy;
        this.lastUpdateDate = value.lastUpdateDate;
    }

    static async create({ email, firstName, lastName, jobTitle, role, createdBy }) {
        try {
            const { error, value } = userSchema.validate({
                email, 
                firstName, 
                lastName, 
                jobTitle, 
                role
            });
            if (error) {
                throw new Error(`Validation error: ${error.details.map(detail => detail.message).join(', ')}`);
            }

            const existingUser = await User.findByEmail(value.email);
            if (existingUser) {
                throw new Error("A user with this email already exists");
            }

            const roleQuery = 'SELECT id FROM roles WHERE name = ?';
            const roleResult = await queryAsync(roleQuery, [value.role]);
            if (!roleResult.length) {
                throw new Error('Invalid role specified');
            }
            const roleId = roleResult[0].id;

            const query = `
                INSERT INTO users (email, firstName, lastName, jobTitle, roleId, isEnable, createdBy, lastupdateBy)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            const result = await queryAsync(
                query, 
                [
                    value.email, 
                    value.firstName, 
                    value.lastName, 
                    value.jobTitle || null,
                    roleId, 
                    value.isEnable, 
                    createdBy || null, 
                    createdBy || null, 
                ]
            );
            return await User.findById(result.insertId);

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

            const query = `
                    SELECT 
                        u.*, 
                        r.name AS role,
                        c.firstName AS createdByFirstName, c.lastName AS createdByLastName, c.jobTitle AS createdByJobTitle,
                        l.firstName AS lastUpdateByFirstName, l.lastName AS lastUpdateByLastName, l.jobTitle AS lastUpdateByJobTitle
                    FROM users u
                    JOIN roles r ON u.roleId = r.id
                    LEFT JOIN users c ON u.createdBy = c.id
                    LEFT JOIN users l ON u.lastUpdateBy = l.id
                    WHERE u.id = ?;
            `;
            const results = await queryAsync(query, [userId]);
            
            if (!results.length) return null;
            
            const userData = results[0];
            delete userData.roleId;
            userData.isEnable = userData.isEnable instanceof Buffer ? Boolean(userData.isEnable.readUInt8(0)) : userData.isEnable;

  
            userData.createdBy = userData.createdByFirstName 
              ? `${userData.createdByFirstName} ${userData.createdByLastName} - ${userData.createdByJobTitle || ''}`.trim()
              : "User removed from database";
  
            userData.lastUpdateBy = userData.lastUpdateByFirstName 
              ? `${userData.lastUpdateByFirstName} ${userData.lastUpdateByLastName} - ${userData.lastUpdateByJobTitle || ''}`.trim()
              : "User removed from database";
  
            delete userData.createdByFirstName;
            delete userData.createdByLastName;
            delete userData.createdByJobTitle;
            delete userData.lastUpdateByFirstName;
            delete userData.lastUpdateByLastName;
            delete userData.lastUpdateByJobTitle;
   
            return new User(userData);

        } catch (err) {
            throw new Error(`Error finding user by ID: ${err.message}`);
        }

    }

    
    static async findByEmail(email) {
        try {
            if (!email || !validator.isEmail(email)) {
                return null;
            }
            const query = `
                    SELECT 
                        u.*, 
                        r.name AS role,
                        c.firstName AS createdByFirstName, c.lastName AS createdByLastName, c.jobTitle AS createdByJobTitle,
                        l.firstName AS lastUpdateByFirstName, l.lastName AS lastUpdateByLastName, l.jobTitle AS lastUpdateByJobTitle
                    FROM users u
                    JOIN roles r ON u.roleId = r.id
                    LEFT JOIN users c ON u.createdBy = c.id
                    LEFT JOIN users l ON u.lastUpdateBy = l.id
                    WHERE u.email = ?;
            `;
            
            const results = await queryAsync(query, [email]);
            if (!results.length) return null;
            
            const userData = results[0];
            delete userData.roleId;
            userData.isEnable = userData.isEnable instanceof Buffer ? Boolean(userData.isEnable.readUInt8(0)) : userData.isEnable;
        
            userData.createdBy = userData.createdByFirstName 
              ? `${userData.createdByFirstName} ${userData.createdByLastName} - ${userData.createdByJobTitle || ''}`.trim()
              : "User removed from database";

            userData.lastUpdateBy = userData.lastUpdateByFirstName 
              ? `${userData.lastUpdateByFirstName} ${userData.lastUpdateByLastName} - ${userData.lastUpdateByJobTitle || ''}`.trim()
              : "User removed from database";

            delete userData.createdByFirstName;
            delete userData.createdByLastName;
            delete userData.createdByJobTitle;
            delete userData.lastUpdateByFirstName;
            delete userData.lastUpdateByLastName;
            delete userData.lastUpdateByJobTitle;

            return new User(userData);

        } catch (err) {
            throw new Error(`Error finding user by email: ${err.message}`);
        }

        
        
    }

    static async returnAllUsers() {
        try {
            const query = `
                SELECT 
                    u.*, 
                    r.name AS role,
                    c.firstName AS createdByFirstName, c.lastName AS createdByLastName, c.jobTitle AS createdByJobTitle,
                    l.firstName AS lastUpdateByFirstName, l.lastName AS lastUpdateByLastName, l.jobTitle AS lastUpdateByJobTitle
                FROM users u
                JOIN roles r ON u.roleId = r.id
                LEFT JOIN users c ON u.createdBy = c.id
                LEFT JOIN users l ON u.lastUpdateBy = l.id;
            `;
            const results = await queryAsync(query);
            return results.length ? results.map(user => {
                delete user.roleId;
                user.isEnable = user.isEnable instanceof Buffer ? Boolean(user.isEnable.readUInt8(0)) : user.isEnable;
                user.createdBy = user.createdByFirstName 
                  ? `${user.createdByFirstName} ${user.createdByLastName} - ${user.createdByJobTitle || ''}`.trim()
                  : "User removed from database";

                user.lastUpdateBy = user.lastUpdateByFirstName 
                  ? `${user.lastUpdateByFirstName} ${user.lastUpdateByLastName} - ${user.lastUpdateByJobTitle || ''}`.trim()
                  : "User removed from database";

                delete user.createdByFirstName;
                delete user.createdByLastName;
                delete user.createdByJobTitle;
                delete user.lastUpdateByFirstName;
                delete user.lastUpdateByLastName;
                delete user.lastUpdateByJobTitle;

                return new User(user);

            }) : [];

        } catch (err) {
            throw new Error(`Error fetching all users: ${err.message}`);
        }
    }

    async changePassword(newPassword, initiatorId) {
        try {
            if (!newPassword || newPassword.length < 3 || newPassword.length > 20) {
                throw new Error("Password must be between 3 and 20 characters");
            }
            const passwordHash = await bcrypt.hash(newPassword, 10);
            const query = 'UPDATE users SET password = ?, lastUpdateBy = ? WHERE id = ?';
            
            const result = await queryAsync(query, [passwordHash, initiatorId, this.id]);
            if (result.affectedRows === 0) {
                throw new Error('Failed to update password');
            }
            return { message: 'Password changed successfully' };
        } catch (err) {
            throw new Error(`Error changing password: ${err.message}`);
        }
    }

    async toggleUserStatus(isEnable, initiatorId) {
        try {
            const isEnableBit = isEnable ? 1 : 0; // Convert boolean to bit value (1 or 0)
        
            const query = 'UPDATE users SET isEnable = ?, lastUpdateBy = ? WHERE id = ?';
            const result = await queryAsync(query, [isEnableBit, initiatorId, this.id]);

            if (result.affectedRows === 0) {
                throw new Error('Failed to update user status');
            }
            this.isEnable = isEnable;
            return { message: isEnable ? 'User activated successfully' : 'User deactivated successfully' };
        } catch (err) {
            throw new Error(`Error updating user status: ${err.message}`);
        }
    }

    async update(updates, initiatorId) {
        try {
            const allowedFields = ['email', 'firstName', 'lastName', 'jobTitle', 'roleId'];
            const updatesToApply = {};

            const roleQuery = 'SELECT id FROM roles WHERE name = ?';
            const roleResult = await queryAsync(roleQuery, [updates.role]);
            if (!roleResult.length) {
                throw new Error('Invalid role specified');
            }
            const roleId = roleResult[0].id;
            updates.roleId = roleId;
            delete updates.role;

            for (const key of Object.keys(updates)) {
                if (!allowedFields.includes(key)) {
                    throw new Error(`Cannot update field: ${key}`);
                }
                updatesToApply[key] = updates[key];
            }

            if (Object.keys(updatesToApply).length === 0) {
                throw new Error('No valid fields to update');
            }

            updatesToApply.lastUpdateBy = initiatorId;

            const updateFields = Object.keys(updatesToApply).map(key => `${key} = ?`).join(', ');
            const query = `UPDATE users SET ${updateFields} WHERE id = ?`;

            const result = await queryAsync(query, [...Object.values(updatesToApply), this.id]);

            if (result.affectedRows === 0) {
                throw new Error('Failed to update user');
            }
        
            Object.assign(this, updatesToApply);

            return { message: 'User updated successfully' };
        } catch (err) {
            throw new Error(`Error updating user: ${err.message}`);
        }
    }


    async delete() {
        try {
            const query = 'DELETE FROM users WHERE id = ?';
            const results = await queryAsync(query, [this.id]);

            if (results.affectedRows === 0) {
                throw new Error('No user found with the provided ID');
            }

            return { message: 'User deleted successfully'};
        } catch (err) {
            throw new Error(`Error deleting user: ${err.message}`);
        }
    }

}

module.exports = User;
