import React, { useEffect, useState, useRef } from 'react';
import AddUserForm from './AddUserForm';
import './AdminPage.css'; // Import the new CSS file

const AdminPage = () => {
    const [user, setUser] = useState(null); 
    const [userTable, setUserTable] = useState([]);
    const [showAddUserForm, setShowAddUserForm] = useState(false); 
    const [editingUser, setEditingUser] = useState(null); 
    const formRef = useRef(null);

    const token = localStorage.getItem('token');
    if (!token) { //add validity check and redirection to main page 
        console.error('User not authenticated');
        //window.location.href = '/login';
        return null;
    }

    useEffect(() => {
      const fetchUser = async () => {
          try {
              const response = await fetch('/api/users/current', {
                  method: 'GET',
                  headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json',
                  },
              });
  
              if (!response.ok) {
                  throw new Error(`HTTP error! Status: ${response.status}`);
              }
  
              const userData = await response.json();
              setUser(userData);

              const tableResponse = await fetch('/api/users/usertable', {
                  method: 'GET',
                  headers: {
                      'Authorization': `Bearer ${token}`,
                      'Content-Type': 'application/json',
                  },
              });

              if (!tableResponse.ok) {
                  throw new Error(`HTTP error! Status: ${tableResponse.status}`);
              }

              const tableData = await tableResponse.json();
              setUserTable(tableData.users); 

          } catch (err) {
              console.error('Error fetching user data:', err);
          }
      };
  
      fetchUser();
  }, []);

    if (!user) {
        return <p>Loading...</p>; // Display a loading message while fetching user data
    }

     // Action handlers
    const handleAddUser = () => {
        setEditingUser(null);
        setShowAddUserForm(true);
        setTimeout(() => {
            formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 100);
    };
    
    const handleSaveUser = async (userData) => {
        try {
            const url = editingUser ? `/api/users/update/${editingUser.id}` : '/api/users/register';
            const method = editingUser ? 'PATCH' : 'POST';
    
            const response = await fetch(url, {
                method,
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(userData),
            });
    
            if (!response.ok) {
                alert(editingUser ? 'User update failed' : 'User creation failed');
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            // **Re-fetch user table to get the latest data**
            const tableResponse = await fetch('/api/users/usertable', {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            if (!tableResponse.ok) {
                throw new Error(`HTTP error! Status: ${tableResponse.status}`);
            }
    
            const tableData = await tableResponse.json();
            setUserTable(tableData.users); // **Ensure UI gets fresh data from backend**
    
            alert(editingUser ? 'User updated successfully!' : 'User added successfully!');
            setShowAddUserForm(false);
            setEditingUser(null);
        } catch (error) {
            console.error('Error saving user:', error);
        }
    };

    const handleDeactivateActivate = async (userId, isActive) => {
        const confirmAction = window.confirm(
            `Are you sure you want to ${isActive ? 'deactivate' : 'activate'} User ID: ${userId}?`
        );
    
        if (!confirmAction) return;
    
        try {
            const response = await fetch(`/api/users/togglestatus/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Authorization': `Bearer ${localStorage.getItem('token')}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({  isEnable: !isActive }), // Toggle status
            });
    
            const data = await response.json();
    
            if (response.ok) {
                alert(data.message);
                setUserTable((prev) =>
                    prev.map((user) =>
                        user.id === userId ? { ...user,  isEnable: !isActive } : user
                    )
                );
            } else {
                alert(data.message || 'Failed to update user status.');
            }
        } catch (error) {
            console.error('Error updating user status:', error);
            alert('An error occurred while updating user status.');
        }
    };

    const handleEditUser = (userId) => {
        const userToEdit = userTable.find(user => user.id === userId);
        if (userToEdit) {
            setEditingUser(userToEdit);
            setShowAddUserForm(true);
            setTimeout(() => {
                formRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' });
            }, 100);
        }
    };

    const handleChangePassword = async (firstName, lastName, email) => {
        const confirmReset = window.confirm(`Are you sure you want to reset the password for ${firstName} ${lastName}?`);
        if (!confirmReset) {
            return;
        }
    
        try {
            const response = await fetch('/api/users/sendpasswordreset', {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email })
            });
    
            const data = await response.json();
            if (response.ok) {
                alert(`Password reset email sent to ${email}.`);
            } else {
                alert(data.message || 'Failed to send password reset email.');
            }
        } catch (error) {
            console.error('Error sending password reset email:', error);
            alert('An error occurred while sending the password reset email.');
        }
    };

    const handleDeleteUser = async (userId) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete User ID: ${userId}?`);
        if (!confirmDelete) {
            return; 
        }
        try {
            const response = await fetch(`/api/users/delete/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                alert('Failed to delete user');
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            setUserTable((prev) => prev.filter((user) => user.id !== userId));
            alert('User deleted successfully!');
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('An error occurred while deleting the user.');
        }
    };

    return (
        <div className="admin-page">
            <h1>Welcome to the Admin Page</h1>
            <div className="user-info">
                <h2>Current User Information</h2>
                <p><strong>Name:</strong> {user.firstName}</p>
                <p><strong>Last Name:</strong> {user.lastName}</p>
                <p><strong>Role:</strong> {user.role}</p>

                <button onClick={handleAddUser} className="button button-add">Add New User</button>

                {showAddUserForm && (
                    <div ref={formRef}>
                        <AddUserForm
                            onClose={() => setShowAddUserForm(false)}
                            onSave={handleSaveUser}
                            userData={editingUser}
                        />
                    </div>
                )}
            </div>
            
            <h2>All Users Table</h2>
            <table className="user-table">
                <thead>
                    <tr>
                        <th>ID</th>
                        <th>Email</th>
                        <th>Name</th>
                        <th>Last Name</th>
                        <th>Job Title</th>
                        <th>Role</th>
                        <th>Status</th>
                        <th>Create Date</th>
                        <th>Created By</th>
                        <th>Last Update Date</th>
                        <th>Last Update By</th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {userTable.map((user) => (
                        <tr key={user.id}>
                            <td>{user.id}</td>
                            <td>{user.email}</td>
                            <td>{user.firstName}</td>
                            <td>{user.lastName}</td>
                            <td>{user.jobTitle}</td>
                            <td>{user.role}</td>
                            <td>{user.isEnable ? 'Active' : 'Inactive'}</td>
                            <td>{new Date(user.createDate).toLocaleDateString()}</td>
                            <td>{user.createdBy}</td>
                            <td>{new Date(user.lastUpdateDate).toLocaleDateString()}</td>
                            <td>{user.lastUpdateBy}</td>
                            <td>
                                <button 
                                    onClick={() => handleDeactivateActivate(user.id, user.isEnable)} 
                                    className={`button ${user.isEnable ? 'button-deactivate' : 'button-activate'}`}>
                                    {user.isEnable ? 'Deactivate' : 'Activate'}
                                </button>
                                <button onClick={() => handleEditUser(user.id)} className="button button-edit">Edit</button>
                                <button onClick={() => handleChangePassword(user.firstName, user.lastName, user.email)} className="button button-edit">Change Password</button>
                                <button onClick={() => handleDeleteUser(user.id)} className="button button-delete">Delete</button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPage;
