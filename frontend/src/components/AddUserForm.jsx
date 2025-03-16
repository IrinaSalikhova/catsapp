import React, { useState, useEffect } from 'react';
import tlds from 'tlds'; // Import tlds package
import '../assets/AddUserForm.css';

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
    const [emailError, setEmailError] = useState('');

    // Handle opening form for editing vs. adding a new user
    useEffect(() => {
        if (userData) {
            setFormData({
                email: userData.email || '',
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                jobTitle: userData.jobTitle || '',
                role: userData.role || '',
            });
            localStorage.removeItem(STORAGE_KEY); // Clear saved data when editing
        } else {
            const savedData = localStorage.getItem(STORAGE_KEY);
            if (savedData) {
                setFormData(JSON.parse(savedData));
            }
        }
    }, [userData]);

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

    // Enhanced email validation using tlds
    const validateEmail = (email) => {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email)) {
            return false;  // Return false if email doesn't match basic pattern
        }

        const domain = email.split('@')[1];
        const tld = domain.split('.').pop().toLowerCase(); // Get TLD (part after last dot)

        // Check if the TLD is in the valid list of TLDs from tlds package
        if (!tlds.includes(tld)) {
            return false; // Invalid TLD, reject email
        }

        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (isSubmitting) return;
        setIsSubmitting(true);

        // Validate email before proceeding
        if (!validateEmail(formData.email)) {
            setEmailError('Please enter a valid email address.');
            setIsSubmitting(false);
            return;
        } else {
            setEmailError('');
        }

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
                        maxlength="100"
                    />
                    {emailError && <p className="error-message">{emailError}</p>}

                    <label>First Name:</label>
                    <input
                        type="text"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        maxlength="50"
                    />

                    <label>Last Name:</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        maxlength="50"
                    />

                    <label>Job Title:</label>
                    <input
                        type="text"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleChange}
                        required
                        disabled={isSubmitting}
                        maxlength="100"
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
