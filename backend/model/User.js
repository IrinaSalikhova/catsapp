const bcrypt = require('bcryptjs');
const db = require('../db');

// User model
class User {
    static async create({ email, name, lastName, jobTitle, role, password }) {
        // Hash the password
        const passwordHash = await bcrypt.hash(password, 10);

        const query = `
            INSERT INTO Users (Email, Name, LastName, JobTitle, Role, PasswordHash)
            VALUES (?, ?, ?, ?, ?, ?)
        `;
        
        return new Promise((resolve, reject) => {
            db.query(query, [email, name, lastName, jobTitle, role, passwordHash], (err, results) => {
                if (err) return reject(err);
                resolve(results);
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

    static async comparePassword(inputPassword, storedPasswordHash) {
        return bcrypt.compare(inputPassword, storedPasswordHash);
    }

    static async createSession(userId, token) {
        const query = 'INSERT INTO Sessions (userId, token, expiresAt) VALUES (?, ?, ?)';
        
        return new Promise((resolve, reject) => {
            db.query(query, [userId, token, new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }

    static async deleteSession(token) {
        const query = 'DELETE FROM Sessions WHERE token = ?';

        return new Promise((resolve, reject) => {
            db.query(query, [token], (err, results) => {
                if (err) return reject(err);
                resolve(results);
            });
        });
    }
}


module.exports = User;