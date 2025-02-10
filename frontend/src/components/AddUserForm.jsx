import React, { useState, useEffect } from 'react';
import './AddUserForm.css'; // Import the new CSS file

const AddUserForm = ({ onClose, onSave, userData }) => {
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        lastName: '',
        jobTitle: '',
        role: ''
    });

    useEffect(() => {
        if (userData) {
            setFormData({
                email: userData.Email || '',
                name: userData.Name || '',
                lastName: userData.LastName || '',
                jobTitle: userData.JobTitle || '',
                role: userData.Role || '',
            });
        }
    }, [userData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <div className="add-user-form">
            <h2>{userData ? 'Edit User' : 'Add New User'}</h2>
            <form onSubmit={handleSubmit}>
                <label>Email:</label>
                <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    required 
                />
                
                <label>Name:</label>
                <input 
                    type="text" 
                    name="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    required 
                />

                <label>Last Name:</label>
                <input 
                    type="text" 
                    name="lastName" 
                    value={formData.lastName} 
                    onChange={handleChange}
                    required 
                />

                <label>Job Title:</label>
                <input 
                    type="text" 
                    name="jobTitle" 
                    value={formData.jobTitle} 
                    onChange={handleChange} 
                    required
                />

                <label>Role:</label>
                <label>
                    <input 
                        type="radio" 
                        name="role" 
                        value="navigator"
                        checked={formData.role === 'navigator'}
                        onChange={handleChange} 
                        required 
                    />
                    Navigator
                </label>
                <label>
                    <input
                        type="radio"
                        name="role"
                        value="admin"
                        checked={formData.role === 'admin'}
                        onChange={handleChange}
                        required
                    />
                    Admin
                </label>

                <button 
                    type="submit" 
                    className="button button-save"
                >
                    {userData ? 'Save Changes' : 'Save'}
                </button>
                <button 
                    type="button" 
                    onClick={onClose} 
                    className="button button-cancel"
                >
                Cancel
                </button>    
            </form>
        </div>
    );
};

export default AddUserForm;
