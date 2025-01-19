import React, { useEffect, useState } from 'react';
import AddUserForm from '../components/AddUserForm';

const AdminPage = () => {
    const [user, setUser] = useState(null); 
    const [userTable, setUserTable] = useState([]);
    const [showAddUserForm, setShowAddUserForm] = useState(false); 


    const token = localStorage.getItem('token');
    if (!token) {
        throw new Error('User not authenticated');
    }

    useEffect(() => {
      const fetchUser = async () => {
          try {
  
              const response = await fetch('/api/users/current', {
                  method: 'GET',
                  headers: {
                      'Authorization': token,
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
                        'Authorization': token,
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

    // Function to get creator's details by ID
    const getCreatorDetails = (creatorId) => {
        if (!creatorId) return 'N/A'; // Handle null or undefined values
        const creator = userTable.find((user) => user.ID === creatorId);
        return creator ? `${creator.Role} - ${creator.Name} ${creator.LastName}` : 'Unknown';
    };

     // Action handlers
     const handleAddUser = () => {
        setShowAddUserForm(true);
    };
    
    const handleSaveUser = async (newUser) => {
        try {
            const response = await fetch('/api/users/register', {
                method: 'POST',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(newUser),
            });
    
            if (!response.ok) {
                alert('User creation failed');
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            const responseBody = await response.json(); 
            const createdUser = responseBody.user;
            console.log(createdUser);
            setUserTable((prev) => [...prev, createdUser]);
            setShowAddUserForm(false);
            alert('User added successfully!');
        } catch (error) {
            console.error('Error adding user:', error);
        }
    };

    const handleDeactivateActivate = (userId, isActive) => {
        alert(`${isActive ? 'Deactivate' : 'Activate'} User ID: ${userId}`);
        // Implement deactivate/activate functionality here
    };

    const handleEditUser = (userId) => {
        alert(`Edit User ID: ${userId}`);
        // Implement edit user functionality here
    };

    const handleChangePassword = (userId) => {
        alert(`Change Password for User ID: ${userId}`);
        // Implement change password functionality here
    };

    const handleDeleteUser = async (userId) => {
        const confirmDelete = window.confirm(`Are you sure you want to delete User ID: ${userId}?`);
        if (!confirmDelete) {
            return; // Exit if the user cancels the action
        }
    
        try {
            const response = await fetch(`/api/users/delete/${userId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': token,
                    'Content-Type': 'application/json',
                },
            });
    
            if (!response.ok) {
                alert('Failed to delete user');
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
    
            // Remove the deleted user from the table
            setUserTable((prev) => prev.filter((user) => user.ID !== userId));
            alert('User deleted successfully!');
        } catch (error) {
            console.error('Error deleting user:', error);
            alert('An error occurred while deleting the user.');
        }
    };



    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Welcome to the Admin Page</h1>
            <div style={{ alignContent: 'left', textAlign: 'left' }}>
                <h2>Current User Information</h2>
                <p>
                    <strong>Name:</strong> {user.name}
                </p>
                <p>
                    <strong>Last Name:</strong> {user.lastName}
                </p>
                <p>
                    <strong>Role:</strong> {user.role}
                </p>

                <button
                onClick={handleAddUser}
                style={{
                    alignContent: 'left',
                    margin: '20px 0',
                    padding: '10px 20px',
                    backgroundColor: '#007BFF',
                    color: '#FFF',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                }}
            >
                Add New User
            </button>

            {showAddUserForm && (
                <AddUserForm
                    onClose={() => setShowAddUserForm(false)} // Close the form
                    onSave={handleSaveUser} // Handle user saving
                />
            )}
            </div>

           
            <h2>All Users Table</h2>
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
                <thead>
                    <tr>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Email</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Name</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Last Name</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Job Title</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Role</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Status</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Create Date</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Created By</th>
                        <th style={{ border: '1px solid #ddd', padding: '8px' }}>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {userTable.map((user) => (
                        <tr key={user.ID}>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.ID}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.Email}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.Name}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.LastName}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.JobTitle}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.Role}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{user.IsEnable ? 'Active' : 'Inactive'}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{new Date(user.CreateDate).toLocaleDateString()}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>{getCreatorDetails(user.CreatedBy)}</td>
                            <td style={{ border: '1px solid #ddd', padding: '8px' }}>
                                <button
                                    onClick={() => handleDeactivateActivate(user.ID, user.IsEnable)}
                                    style={{
                                        marginRight: '5px',
                                        padding: '5px 10px',
                                        backgroundColor: user.IsEnable ? '#FFC107' : '#28A745',
                                        color: '#FFF',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    {user.IsEnable ? 'Deactivate' : 'Activate'}
                                </button>
                                <button
                                    onClick={() => handleEditUser(user.ID)}
                                    style={{
                                        marginRight: '5px',
                                        padding: '5px 10px',
                                        backgroundColor: '#17A2B8',
                                        color: '#FFF',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Edit
                                </button>
                                <button
                                    onClick={() => handleChangePassword(user.ID)}
                                    style={{
                                        padding: '5px 10px',
                                        backgroundColor: '#DC3545',
                                        color: '#FFF',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Change Password
                                </button>
                                <button
                                    onClick={() => handleDeleteUser(user.ID)}
                                    style={{
                                        padding: '5px 10px',
                                        backgroundColor: '#DC3545',
                                        color: '#FFF',
                                        border: 'none',
                                        borderRadius: '4px',
                                        cursor: 'pointer',
                                    }}
                                >
                                    Delete
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminPage;