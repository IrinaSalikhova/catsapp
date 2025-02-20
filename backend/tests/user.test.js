// user.test.js
const User = require('../model/User');
const db = require('../db');


jest.mock('../db'); 

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

    describe('formatUserDetails', () => {
        it('should format user details correctly', () => {
            const userData = {
                isEnable: Buffer.from([1]),
                createdByFirstName: 'John',
                createdByLastName: 'Doe',
                createdByJobTitle: 'Manager'
            };
            const formatted = User.formatUserDetails(userData);
            expect(formatted.isEnable).toBe(true);
            expect(formatted.createdBy).toBe('John Doe - Manager');
        });

        it('should handle missing createdBy fields', () => {
            const userData = { isEnable: null };
            const formatted = User.formatUserDetails(userData);
            expect(formatted.createdBy).toBe('Deleted user');
        });
    });

    describe('cleanupUserData', () => {
        it('should remove unnecessary fields', () => {
            const userData = {
                roleId: 1,
                createdByFirstName: 'John',
                createdByLastName: 'Doe',
                createdByJobTitle: 'Manager',
                lastUpdateByFirstName: 'Jane',
                lastUpdateByLastName: 'Smith',
                lastUpdateByJobTitle: 'Supervisor'
            };
            User.cleanupUserData(userData);
            expect(userData).toEqual({});
        });
    });

    describe('findById', () => {
        it('should return a user when a valid user ID is provided', async () => {
            // Mock the database query
            const mockUserData = [{
                id: 1,
                email: 'test@example.com',
                role: 'admin',
                firstName: 'John',
                lastName: 'Doe',
                jobTitle: 'Developer',
                isEnable: true,
                createdBy: 'admin',
                createDate: '2025-02-17T00:00:00Z',
                lastUpdateBy: 'admin',
                lastUpdateDate: '2025-02-17T01:00:00Z',
                createdByFirstName: 'Admin',
                createdByLastName: 'User',
                createdByJobTitle: 'Admin',
                lastUpdateByFirstName: 'Admin',
                lastUpdateByLastName: 'User',
                lastUpdateByJobTitle: 'Admin',
            }];
            
            db.query.mockResolvedValue([mockUserData]); // Mock resolved value for query
    
            const userId = 1;
            const user = await User.findById(userId);
    
            expect(db.query).toHaveBeenCalledWith(expect.stringContaining('SELECT'), [userId]);
            expect(user).toBeInstanceOf(User); // Ensures it returns an instance of User
            expect(user.email).toBe('test@example.com');
            expect(user.role).toBe('admin');
        });
    
        it('should return null when no user is found for a given ID', async () => {
            // Mock the database query for a non-existing user
            db.query.mockResolvedValue([[]]); // No data returned
    
            const userId = 999; // Assuming 999 doesn't exist
            const user = await User.findById(userId);
    
            expect(user).toBeNull();
        });
    
        it('should throw an error when an invalid user ID is provided', async () => {
            const invalidUserId = 'invalid'; // Not a number
    
            await expect(User.findById(invalidUserId)).rejects.toThrow('Invalid user ID');
        });
    
        it('should throw an error if the database query fails', async () => {
            // Mock a database error
            db.query.mockRejectedValue(new Error('Database error'));
    
            const userId = 1;
    
            await expect(User.findById(userId)).rejects.toThrow('Error finding user by ID: Database error');
        });
    });

    describe('findByEmail', () => {
        it('should return a user when a valid email is provided', async () => {
            // Mock the database query
            const mockUserData = [{
                id: 1,
                email: 'test@example.com',
                role: 'admin',
                firstName: 'John',
                lastName: 'Doe',
                jobTitle: 'Developer',
                isEnable: true,
                createdBy: 'admin',
                createDate: '2025-02-17T00:00:00Z',
                lastUpdateBy: 'admin',
                lastUpdateDate: '2025-02-17T01:00:00Z',
                createdByFirstName: 'Admin',
                createdByLastName: 'User',
                createdByJobTitle: 'Admin',
                lastUpdateByFirstName: 'Admin',
                lastUpdateByLastName: 'User',
                lastUpdateByJobTitle: 'Admin',
            }];
            
            db.query.mockResolvedValue([mockUserData]); // Mock resolved value for query
    
            const email = 'test@example.com';
            const user = await User.findByEmail(email);
    
            expect(db.query).toHaveBeenCalledWith(expect.stringContaining('SELECT'), [email]);
            expect(user).toBeInstanceOf(User); // Ensures it returns an instance of User
            expect(user.email).toBe('test@example.com');
            expect(user.role).toBe('admin');
        });
    
        it('should return null when no user is found for the given email', async () => {
            // Mock the database query for a non-existing email
            db.query.mockResolvedValue([[]]); // No data returned
    
            const email = 'nonexistent@example.com'; // Assuming this email doesn't exist
            const user = await User.findByEmail(email);
    
            expect(user).toBeNull();
        });
    
        it('should return null when an invalid email is provided', async () => {
            const invalidEmail = 'invalid-email'; // Invalid email format
    
            const user = await User.findByEmail(invalidEmail);
    
            expect(user).toBeNull(); // Invalid email should return null
        });
    
        it('should throw an error if the database query fails', async () => {
            // Mock a database error
            db.query.mockRejectedValue(new Error('Database error'));
    
            const email = 'test@example.com';
    
            await expect(User.findByEmail(email)).rejects.toThrow('Error finding user by email: Database error');
        });
    });

    describe('create', () => {
        it('should throw an error if user with the same email already exists', async () => {
            // Mock the findByEmail method to simulate an existing user with the same email
            User.findByEmail = jest.fn().mockResolvedValue(true);  // Simulate an existing user
    
            const userData = {
                email: 'user@example.com',
                firstName: 'John',
                lastName: 'Doe',
                role: 'admin'
            };
    
            await expect(User.create(userData)).rejects.toThrow('Error creating user: A user with this email already exists');
        });
    
        it('should throw an error if database insert fails', async () => {
            const userData = {
                email: 'user@example.com',
                firstName: 'John',
                lastName: 'Doe',
                role: 'admin'
            };
            User.findByEmail = jest.fn().mockResolvedValue(null);
    
            db.query.mockRejectedValue(new Error('Database insert failed'));
    
            await expect(User.create(userData)).rejects.toThrow('Error creating user: Database insert failed');
        });
    
        it('should create a user successfully when all data is valid', async () => {
            const userData = {
                email: 'user@example.com',
                firstName: 'John',
                lastName: 'Doe',
                role: 'admin',
                createdBy: null
            };
        
            db.query.mockResolvedValueOnce([[]]);
        
            // Mock the role query to return a valid role ID
            db.query.mockResolvedValueOnce({id: 1}); // This simulates the role query returning a valid role ID
            db.query.mockResolvedValueOnce([{insertId: 1 }]); 
        
            // Mock findById to return the created user after insertion
            const mockCreatedUser = new User({
                id: 1,
                email: 'user@example.com',
                firstName: 'John',
                lastName: 'Doe',
                role: 'admin'
            });
            User.findById = jest.fn().mockResolvedValue(mockCreatedUser);
        
            // Call create and handle the result
            const result = await User.create(userData);
        
            // Ensure the role lookup query was called
            expect(db.query).toHaveBeenCalledWith('SELECT id FROM roles WHERE name = ?', ['admin']);
            expect(db.query).toHaveBeenCalledWith(expect.stringContaining('INSERT INTO users'));
        
            // Ensure the result is the correct user instance
            expect(result).toBeInstanceOf(User);
            expect(result.email).toBe('user@example.com');
        });
    });

    describe('returnAllUsers', () => {
        it('should return an array of users', async () => {
            // Mock the database query to return multiple users
            const mockUserData = [
                {
                    id: 1,
                    email: 'user1@example.com',
                    firstName: 'John',
                    lastName: 'Doe',
                    role: 'admin',
                    createdByFirstName: 'Admin',
                    createdByLastName: 'User',
                    createdByJobTitle: 'Admin',
                    lastUpdateByFirstName: 'Admin',
                    lastUpdateByLastName: 'User',
                    lastUpdateByJobTitle: 'Admin'
                },
                {
                    id: 2,
                    email: 'user2@example.com',
                    firstName: 'Jane',
                    lastName: 'Smith',
                    role: 'navigator',
                    createdByFirstName: 'Admin',
                    createdByLastName: 'User',
                    createdByJobTitle: 'Admin',
                    lastUpdateByFirstName: 'Admin',
                    lastUpdateByLastName: 'User',
                    lastUpdateByJobTitle: 'Admin'
                }
            ];

            db.query.mockResolvedValue([mockUserData]); // Mock database result

            const users = await User.returnAllUsers();

            expect(db.query).toHaveBeenCalledWith(expect.stringContaining('SELECT'));
            expect(users).toHaveLength(2); // Ensure we get two users
            expect(users[0]).toBeInstanceOf(User); // First user should be an instance of User
            expect(users[1].email).toBe('user2@example.com');
        });

        it('should return an empty array when no users are found', async () => {
            // Mock an empty database result (no users)
            db.query.mockResolvedValue([[]]);

            const users = await User.returnAllUsers();

            expect(users).toHaveLength(0); // Should return an empty array
        });

        it('should throw an error if the database query fails', async () => {
            // Mock a database error
            db.query.mockRejectedValue(new Error('Database error'));

            await expect(User.returnAllUsers()).rejects.toThrow('Error fetching all users: Database error');
        });
    });

    // Test for changePassword method
    describe('changePassword', () => {
        it('should successfully change the password', async () => {
            const mockUser = new User({
                id: 1,
                email: 'user1@example.com',
                firstName: 'John',
                lastName: 'Doe',
                role: 'admin'
            });

            const newPassword = 'newPassword123';
            const initiatorId = 2; // The ID of the user changing the password

            // Mock bcrypt.hash to return a hashed password
            bcrypt.hash.mockResolvedValue('hashedPassword123');

            // Mock the database query for updating the password
            db.query.mockResolvedValue([{}]); // Simulate successful query

            const response = await mockUser.changePassword(newPassword, initiatorId);

            expect(bcrypt.hash).toHaveBeenCalledWith(newPassword, 10); // Ensure bcrypt is called with correct arguments
            expect(db.query).toHaveBeenCalledWith('UPDATE users SET password = ?, lastUpdateBy = ? WHERE id = ?', [
                'hashedPassword123', initiatorId, mockUser.id
            ]);
            expect(response).toEqual({ message: 'Password changed successfully' });
        });

        it('should throw an error if the password length is invalid', async () => {
            const mockUser = new User({
                id: 1,
                email: 'user1@example.com',
                firstName: 'John',
                lastName: 'Doe',
                role: 'admin'
            });

            const invalidPassword = 'ab'; // Invalid password (too short)
            const initiatorId = 2;

            await expect(mockUser.changePassword(invalidPassword, initiatorId)).rejects.toThrow('Password must be between 3 and 20 characters');
        });

        it('should throw an error if bcrypt hashing fails', async () => {
            const mockUser = new User({
                id: 1,
                email: 'user1@example.com',
                firstName: 'John',
                lastName: 'Doe',
                role: 'admin'
            });

            const newPassword = 'newPassword123';
            const initiatorId = 2;

            // Mock bcrypt.hash to throw an error
            bcrypt.hash.mockRejectedValue(new Error('Bcrypt error'));

            await expect(mockUser.changePassword(newPassword, initiatorId)).rejects.toThrow('Error changing password: Bcrypt error');
        });

        it('should throw an error if the database query fails during password update', async () => {
            const mockUser = new User({
                id: 1,
                email: 'user1@example.com',
                firstName: 'John',
                lastName: 'Doe',
                role: 'admin'
            });

            const newPassword = 'newPassword123';
            const initiatorId = 2;

            // Mock bcrypt.hash to return a hashed password
            bcrypt.hash.mockResolvedValue('hashedPassword123');

            // Mock the database query to simulate an error
            db.query.mockRejectedValue(new Error('Database update failed'));

            await expect(mockUser.changePassword(newPassword, initiatorId)).rejects.toThrow('Error changing password: Database update failed');
        });
    });

    describe('toggleUserStatus', () => {
        it('should activate a user when isEnable is true', async () => {
            const user = new User({ id: 1, isEnable: false }); // mock user
            const initiatorId = 2;
            
            // Mock the db query to simulate a successful update
            db.query.mockResolvedValue([{ affectedRows: 1 }]);
    
            const result = await user.toggleUserStatus(true, initiatorId);
    
            expect(db.query).toHaveBeenCalledWith('UPDATE users SET isEnable = ?, lastUpdateBy = ? WHERE id = ?', [1, initiatorId, 1]);
            expect(result.message).toBe('User activated successfully');
            expect(user.isEnable).toBe(true);
        });
    
        it('should deactivate a user when isEnable is false', async () => {
            const user = new User({ id: 1, isEnable: true }); // mock user
            const initiatorId = 2;
            
            // Mock the db query to simulate a successful update
            db.query.mockResolvedValue([{ affectedRows: 1 }]);
    
            const result = await user.toggleUserStatus(false, initiatorId);
    
            expect(db.query).toHaveBeenCalledWith('UPDATE users SET isEnable = ?, lastUpdateBy = ? WHERE id = ?', [0, initiatorId, 1]);
            expect(result.message).toBe('User deactivated successfully');
            expect(user.isEnable).toBe(false);
        });
    
        it('should throw an error if the user status update fails', async () => {
            const user = new User({ id: 1, isEnable: false });
            const initiatorId = 2;
            
            // Mock the db query to simulate no rows affected (failure)
            db.query.mockResolvedValue([{ affectedRows: 0 }]);
    
            await expect(user.toggleUserStatus(true, initiatorId)).rejects.toThrow('Failed to update user status');
        });
    
    });


    describe('update', () => {
        it('should successfully update user data', async () => {
            const user = new User({ id: 1, email: 'old@example.com', roleId: 1 });
            const initiatorId = 2;
            
            const updates = {
                email: 'new@example.com',
                firstName: 'Jane',
                role: 'admin'
            };
            
            // Mock the db query for role lookup
            db.query.mockResolvedValueOnce([{ id: 1 }]); // Valid role ID
            
            // Mock the db query for update operation
            db.query.mockResolvedValueOnce([{ affectedRows: 1 }]);
    
            const result = await user.update(updates, initiatorId);
    
            expect(db.query).toHaveBeenCalledWith('SELECT id FROM roles WHERE name = ?', ['admin']);
            expect(db.query).toHaveBeenCalledWith(expect.stringContaining('UPDATE users SET email = ?, firstName = ?, lastUpdateBy = ? WHERE id = ?'));
            expect(result.message).toBe('User updated successfully');
            expect(user.email).toBe('new@example.com');
            expect(user.firstName).toBe('Jane');
        });
    
        it('should throw an error if an invalid role is specified', async () => {
            const user = new User({ id: 1, email: 'old@example.com', roleId: 1 });
            const initiatorId = 2;
            
            const updates = {
                email: 'new@example.com',
                role: 'invalidRole' // Invalid role
            };
            
            // Mock the db query for role lookup to return no results
            db.query.mockResolvedValueOnce([]); // No role found
            
            await expect(user.update(updates, initiatorId)).rejects.toThrow('Invalid role specified');
        });
    
        it('should throw an error if no valid fields are provided', async () => {
            const user = new User({ id: 1, email: 'old@example.com', roleId: 1 });
            const initiatorId = 2;
            
            const updates = {
                invalidField: 'someValue' // Invalid field
            };
            
            await expect(user.update(updates, initiatorId)).rejects.toThrow('Cannot update field: invalidField');
        });
    
        it('should throw an error if no fields to update are provided', async () => {
            const user = new User({ id: 1, email: 'old@example.com', roleId: 1 });
            const initiatorId = 2;
            
            const updates = {}; // No updates
            
            await expect(user.update(updates, initiatorId)).rejects.toThrow('No valid fields to update');
        });
    });

    describe('delete', () => {
        it('should successfully delete the user', async () => {
            const user = new User({ id: 1, email: 'delete@example.com' });
            
            // Mock the db query to simulate successful deletion
            db.query.mockResolvedValue([{ affectedRows: 1 }]);
    
            const result = await user.delete();
    
            expect(db.query).toHaveBeenCalledWith('DELETE FROM users WHERE id = ?', [1]);
            expect(result.message).toBe('User deleted successfully');
        });
    
        it('should throw an error if no user is found to delete', async () => {
            const user = new User({ id: 1, email: 'delete@example.com' });
            
            // Mock the db query to simulate no rows affected (failure)
            db.query.mockResolvedValue([{ affectedRows: 0 }]);
    
            await expect(user.delete()).rejects.toThrow('No user found with the provided ID');
        });
    });
});
