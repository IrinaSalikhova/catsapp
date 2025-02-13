const User = require('../model/User');
const bcrypt = require('bcryptjs');
const db = require('../db');
const util = require('util');
const Joi = require('joi');

// Mock db functions
jest.mock('../db', () => {
    return {
        query: jest.fn().mockResolvedValue([]),  // Mock query function to return resolved value
        connect: jest.fn((callback) => callback(null)), // Mock connect function
        end: jest.fn() // Mock end function
    };
});

// Promisify the query function
const queryAsync = util.promisify(db.query).bind(db);

describe('User Model', () => {
    afterEach(() => {
        jest.clearAllMocks();  // Clear all mocks after each test
    });

    describe('Constructor', () => {
        it('should create a User instance with valid data', () => {
            const userData = {
                email: 'test@example.com',
                role: 'admin',
                firstName: 'John',
                lastName: 'Doe'
            };
            const user = new User(userData);
            expect(user.email).toBe(userData.email);
            expect(user.role).toBe(userData.role);
        });

        it('should throw an error for invalid data', () => {
            const invalidUserData = {
                email: 'invalid-email',
                role: 'invalid-role'
            };
            expect(() => new User(invalidUserData)).toThrowError('Validation error');
        });
    });


});