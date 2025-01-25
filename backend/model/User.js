// User.js
import { hash, compare } from 'bcryptjs';
import pool from '../db';

class User {
    static async createNewUser({ email, name, lastName, jobTitle, role, password, createdBy }) {
        try {
            const passwordHash = await hash(password, 10);
            const query = `
                INSERT INTO Users (Email, Name, LastName, JobTitle, Role, PasswordHash, IsEnable, CreatedBy)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;
            const [results] = await pool.execute(query, [email, name, lastName, jobTitle, role, passwordHash, true, createdBy || null]);
            return results;
        } catch (error) {
            console.error('Error creating user:', error);
            throw new Error('Failed to create user');
        }
    }

    static async findById(userId) {
        try {
            const query = 'SELECT * FROM Users WHERE Id = ?';
            const [results] = await pool.execute(query, [userId]);
            if (results.length === 0) {
                throw new Error('User not found');
            }
            return results[0];
        } catch (error) {
            console.error('Error finding user by ID:', error);
            throw new Error('Failed to find user');
        }
    }

    static async deleteById(userId) {
        try {
            const query = 'DELETE FROM Users WHERE Id = ?';
            const [results] = await pool.execute(query, [userId]);
            if (results.affectedRows === 0) {
                throw new Error('No user found with the provided ID');
            }
            return { message: 'User deleted successfully', userId };
        } catch (error) {
            console.error('Error deleting user:', error);
            throw new Error('Failed to delete user');
        }
    }

    static async findByEmail(email) {
        try {
            const query = 'SELECT * FROM Users WHERE Email = ?';
            const [results] = await pool.execute(query, [email]);
            if (results.length === 0) {
                throw new Error('User not found with the provided email');
            }
            return results[0];
        } catch (error) {
            console.error('Error finding user by email:', error);
            throw new Error('Failed to find user by email');
        }
    }

    static async returnAllUsers() {
        try {
            const query = 'SELECT * FROM Users';
            const [results] = await pool.execute(query);
            return results;
        } catch (error) {
            console.error('Error retrieving all users:', error);
            throw new Error('Failed to retrieve users');
        }
    }

    static async comparePassword(inputPassword, storedPasswordHash) {
        try {
            return await compare(inputPassword, storedPasswordHash);
        } catch (error) {
            console.error('Error comparing passwords:', error);
            throw new Error('Password comparison failed');
        }
    }

}

export default User;
