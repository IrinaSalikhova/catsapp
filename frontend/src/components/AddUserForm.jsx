import React, { useState, useEffect } from 'react';
import './AddUserForm.css'; // Import the new CSS file

const AddUserForm = ({ onClose, onSave, userData }) => {
    const [formData, setFormData] = useState({
        email: '',
        firstName: '',
        lastName: '',
        jobTitle: '',
        role: ''
    });

    useEffect(() => {
        if (userData) {
            setFormData({
                email: userData.email || '',
                firstName: userData.firstName || '',
                lastName: userData.lastName || '',
                jobTitle: userData.jobTitle || '',
                role: userData.role || '',
            });
        }
    }, [userData]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData({ ...formData, [name]: value });
    };

    const handleRoleChange = (role) => {
        setFormData({ ...formData, role });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
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
                />
                
                <label>Name:</label>
                <input 
                    type="text" 
                    name="firstName" 
                    value={formData.firstName} 
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
                    <div className="role-toggle">
                        <button
                            type="button"
                            className={formData.role === 'navigator' ? 'active' : ''}
                            onClick={() => handleRoleChange('navigator')}
                        >
                            Navigator
                        </button>
                        <button
                            type="button"
                            className={formData.role === 'admin' ? 'active' : ''}
                            onClick={() => handleRoleChange('admin')}
                        >
                            Admin
                        </button>
                    </div>

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
    </div>
    );
};

export default AddUserForm;
