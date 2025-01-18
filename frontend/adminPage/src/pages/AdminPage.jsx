// src/pages/AdminPage.js
import React, { useEffect, useState } from 'react';

const AdminPage = () => {
    const [user, setUser] = useState(null); // State to store user information


    useEffect(() => {
      const fetchUser = async () => {
          try {
              const token = localStorage.getItem('token');
  
              if (!token) {
                  throw new Error('User not authenticated');
              }
  
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
          } catch (err) {
              console.error('Error fetching user data:', err);
          }
      };
  
      fetchUser();
  }, []);

    if (!user) {
        return <p>Loading...</p>; // Display a loading message while fetching user data
    }

    return (
        <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
            <h1>Welcome to the Admin Page</h1>
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
        </div>
    );
};

export default AdminPage;