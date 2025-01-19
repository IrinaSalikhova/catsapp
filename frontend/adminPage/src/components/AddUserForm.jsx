import React, { useState } from 'react';

const AddUserForm = ({ onClose, onSave }) => {
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        lastName: '',
        jobTitle: '',
        role: '',
        password: '',
    });

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
            <h2>Add New User</h2>
            <form onSubmit={handleSubmit}>
                <div style={{ marginBottom: '10px' }}>
                    <label>Email:</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        style={{ marginLeft: '10px', padding: '5px', width: '200px' }}
                        required
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Name:</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        style={{ marginLeft: '10px', padding: '5px', width: '200px' }}
                        required
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Last Name:</label>
                    <input
                        type="text"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        style={{ marginLeft: '10px', padding: '5px', width: '200px' }}
                        required
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Job Title:</label>
                    <input
                        type="text"
                        name="jobTitle"
                        value={formData.jobTitle}
                        onChange={handleChange}
                        style={{ marginLeft: '10px', padding: '5px', width: '200px' }}
                        required
                    />
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Role:</label>
                    <div style={{ marginLeft: '10px' }}>
                        <label>
                            <input
                                type="radio"
                                name="role"
                                value="navigator"
                                checked={formData.role === 'Navigator'}
                                onChange={handleChange}
                                style={{ marginRight: '5px' }}
                                required
                            />
                            Navigator
                        </label>
                        <label style={{ marginLeft: '15px' }}>
                            <input
                                type="radio"
                                name="role"
                                value="admin"
                                checked={formData.role === 'Admin'}
                                onChange={handleChange}
                                style={{ marginRight: '5px' }}
                                required
                            />
                            Admin
                        </label>
                    </div>
                </div>
                <div style={{ marginBottom: '10px' }}>
                    <label>Initial password:</label>
                    <input
                        type="text"
                        name="password"
                        value={formData.password}
                        onChange={handleChange}
                        style={{ marginLeft: '10px', padding: '5px', width: '200px' }}
                        required
                    />
                </div>
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
                    Save
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
