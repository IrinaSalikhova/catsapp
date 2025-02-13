import React, { useState, useEffect } from 'react';
import './AddUserForm.css';

const AddUserForm = ({ onClose, onSave, userData }) => {
    const STORAGE_KEY = "addUserFormData"; // Key for local storage

    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        jobTitle: '',
        role: ''
    });

    const [isSubmitting, setIsSubmitting] = useState(false);

    // Handle opening form for editing vs. adding a new user
    useEffect(() => {
        if (userData) {
            // If editing, use userData and clear local storage to avoid mixing data
            setFormData({
                email: userData.email || '',
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                jobTitle: userData.jobTitle || '',
                role: userData.role || '',
            });
            localStorage.removeItem(STORAGE_KEY); // Clear saved data when editing
        } else {
            // If adding a new user, load stored data from localStorage (if available)
            const savedData = localStorage.getItem(STORAGE_KEY);
            if (savedData) {
                setFormData(JSON.parse(savedData));
            }
        }
    }, [userData]); // Runs when userData changes (i.e., opening add/edit form)

    // Save form data to localStorage when it changes (only if adding a new user)
    useEffect(() => {
        if (!userData) {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(formData));
        }
    }, [formData, userData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRoleChange = (role) => {
        setFormData({ ...formData, role });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return; // Prevent multiple submissions
        setIsSubmitting(true);

        try {
            await onSave(formData);
            localStorage.removeItem(STORAGE_KEY); // Clear storage after save
            onClose();
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
    <div className="modal-overlay">
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
                    disabled={isSubmitting} 
                />
                
                <label>Name:</label>
                <input 
                    type="text" 
                    name="firstName" 
                    value={formData.firstName} 
                    onChange={handleChange} 
                    required 
                    disabled={isSubmitting}
                />

                <label>Last Name:</label>
                <input 
                    type="text" 
                    name="lastName" 
                    value={formData.lastName} 
                    onChange={handleChange}
                    required 
                    disabled={isSubmitting}
                />

                <label>Job Title:</label>
                <input 
                    type="text" 
                    name="jobTitle" 
                    value={formData.jobTitle} 
                    onChange={handleChange} 
                    required
                    disabled={isSubmitting}
                />

                <label>Role:</label>
                <div className="role-toggle">
                    <button
                        type="button"
                        className={formData.role === 'navigator' ? 'active' : ''}
                        onClick={() => handleRoleChange('navigator')}
                        disabled={isSubmitting} 
                    >
                        Navigator
                    </button>
                    <button
                        type="button"
                        className={formData.role === 'admin' ? 'active' : ''}
                        onClick={() => handleRoleChange('admin')}
                        disabled={isSubmitting}
                    >
                        Admin
                    </button>
                </div>

                <button 
                    type="submit" 
                    className="button button-save"
                    disabled={isSubmitting}
                >
                    {isSubmitting ? 'Saving...' : userData ? 'Save Changes' : 'Save'}
                </button>
                <button 
                    type="button" 
                    onClick={onClose} 
                    className="button button-cancel"
                    disabled={isSubmitting}
                >
                    Cancel
                </button>    
            </form>
        </div>
    </div>
    );
};

export default AddUserForm;

