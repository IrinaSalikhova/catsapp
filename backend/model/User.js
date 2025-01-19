const bcrypt = require('bcryptjs');
const db = require('../db');

// User model
class User {
    static async create({ email, name, lastName, jobTitle, role, password, createdBy }) {
        // Hash the password
        const passwordHash = await bcrypt.hash(password, 10);

        const query = `
           INSERT INTO Users (Email, Name, LastName, JobTitle, Role, PasswordHash, IsEnable, CreatedBy)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        `;
        
        return new Promise((resolve, reject) => {
            db.query(
                query, 
                [email, name, lastName, jobTitle, role, passwordHash, true, createdBy || null], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    static async findById(userId) {
        const query = 'SELECT * FROM Users WHERE Id = ?';

        return new Promise((resolve, reject) => {
            db.query(query, [userId], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]); // Returns the first matched user
            });
        });
    }

    static async deleteById(userId) {
        const query = 'DELETE FROM Users WHERE Id = ?';
    
        return new Promise((resolve, reject) => {
            db.query(query, [userId], (err, results) => {
                if (err) return reject(err);
                if (results.affectedRows === 0) {
                    return reject(new Error('No user found with the provided ID'));
                }
                resolve({ message: 'User deleted successfully', userId });
            });
        });
    }


    static async findByEmail(email) {
        const query = 'SELECT * FROM Users WHERE Email = ?';

        return new Promise((resolve, reject) => {
            db.query(query, [email], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]); // Returns the first matched user
            });
        });
    }

    static async returnAllUsers() {
        const query = 'SELECT * FROM Users';

        return new Promise((resolve, reject) => {
            db.query(query, (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    static async comparePassword(inputPassword, storedPasswordHash) {
        return bcrypt.compare(inputPassword, storedPasswordHash);
    }

    static async createSession(userId, token) {
        const query = 'INSERT INTO Sessions (userId, token, expiresAt) VALUES (?, ?, ?)';
        const expiresAt = new Date(Date.now() + 10 * 24 * 60 * 60 * 1000); // Default expiry: 10 days

        return new Promise((resolve, reject) => {
            db.query(
                query, 
                [userId, token, expiresAt], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    static async deleteSession(token) {
        const query = 'DELETE FROM Sessions WHERE token = ?';

        return new Promise((resolve, reject) => {
            db.query(query, 
                [token], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    static async authenticateToken(token) {
        const query = 'SELECT * FROM Sessions WHERE token = ? AND expiresAt > ?';

        return new Promise((resolve, reject) => {
            db.query(query, 
                [token, new Date()], (err, results) => {
                if (err) return reject(err);
                resolve(results[0]);
            });
        });

    }
}


module.exports = User;