import { Router } from 'express';
import { findById, createNewUser, deleteById, findByEmail, returnAllUsers } from '../model/User';
const router = Router();
import { randomBytes } from 'crypto';


// Create a new user
router.post('/register', async (req, res) => {
    const { email, name, lastName, jobTitle, role, password} = req.body;
    if (!email || !name || !lastName || !role || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
    }
   try {
        const response = await createNewUser({ email, name, lastName, jobTitle, role, password });
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

router.delete('/delete/:id', async (req, res) => {
   
    try {
        const userIdToDelete = req.params.id; // Get the ID of the user to delete from the request parameters

        if (!userIdToDelete) {
            return res.status(400).json({ message: 'User ID is required' });
        }

        try {
            const deleteResult = await deleteById(userIdToDelete);
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
    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Error validating token' });
    }
});


router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Missing required fields' });
    }

    try {
        const user = await findByEmail(email);

        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        if (!user.IsEnable) {
            return res.status(403).json({ message: 'User account is disabled' });
        }

        const isMatch = await comparePassword(password, user.PasswordHash);

        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

    
        res.status(200).json({ 
            message: 'Login successful', 
            userId: user.ID });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Error logging in', error: err.message });
    }
});


router.get('/current', async (req, res) => {
        res.status(200).json({
            name: "Name",
            lastName: "LName",
            role: "Role",
        });
});


router.get('/usertable', async (req, res) => {
   
    try {
       
        const users = await returnAllUsers();
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

export default router;