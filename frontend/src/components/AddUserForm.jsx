import React, { useState, useEffect } from 'react';

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

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    return (
        <div style={{ border: '1px solid #ddd', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
            <h2>{userData ? 'Edit User' : 'Add New User'}</h2>
            <form onSubmit={handleSubmit}>
                <label>Email:</label>
                <input 
                    type="email" 
                    name="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    style={{ marginLeft: '10px', padding: '5px', width: '200px' }}
                    required 
                />
                
                <label>Name:</label>
                <input 
                    type="text" 
                    name="firstName" 
                    value={formData.firstName} 
                    onChange={handleChange} 
                    style={{ marginLeft: '10px', padding: '5px', width: '200px' }}
                    required 
                />

                <label>Last Name:</label>
                <input 
                    type="text" 
                    name="lastName" 
                    value={formData.lastName} 
                    onChange={handleChange}
                    style={{ marginLeft: '10px', padding: '5px', width: '200px' }} 
                    required 
                />

                <label>Job Title:</label>
                <input 
                    type="text" 
                    name="jobTitle" 
                    value={formData.jobTitle} 
                    onChange={handleChange} 
                    style={{ marginLeft: '10px', padding: '5px', width: '200px' }}
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
                        style={{ marginRight: '5px' }}
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
                        style={{ marginRight: '5px' }}
                        required
                    />
                    Admin
                </label>

                <button 
                    type="submit" 
                    style={{
                        padding: '10px 20px',
                        backgroundColor: '#28A745',
                        color: '#FFF',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                >
                    {userData ? 'Save Changes' : 'Save'}
                </button>
                <button 
                    type="button" 
                    onClick={onClose} 
                    style={{
                        marginLeft: '10px',
                        padding: '10px 20px',
                        backgroundColor: '#DC3545',
                        color: '#FFF',
                        border: 'none',
                        borderRadius: '4px',
                        cursor: 'pointer',
                    }}
                >
                Cancel
                </button>    
            </form>
        </div>
    );
};

export default AddUserForm;
