// App.jsx
import React, { useEffect, useState } from 'react'; 
import axios from 'axios';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import MainPage from './components/MainPage';
import Login from './components/Login';
import AdminPage from './components/AdminPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; 


const App = () => {
  const [message, setMessage] = useState('');
  const [count, setCount] = useState(0);
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');

  // token and role rehydration
  useEffect(() => {
    const token = localStorage.getItem('token'); 
    const role = localStorage.getItem('role');
    if (token) {
      setIsLoggedIn(true);
      setUserRole(role || ''); 
    }
  }, []);

  useEffect(() => {
    axios.get('/api/hello') // Relative path works on the same domain
        .then((response) => setMessage(response.data.message))
        .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const toggleLoginModal = () => {
    setLoginModalVisible(!isLoginModalVisible);  // Toggle modal visibility
  };

  const handleLogout = () => {
    localStorage.removeItem('token'); 
    localStorage.removeItem('role'); 
    setIsLoggedIn(false);
    setUserRole(''); 
  };

  return (
    <Router>
      <Header 
        isLoggedIn={isLoggedIn} 
        userRole={userRole} 
        onLogout={handleLogout} 
        toggleLoginModal={toggleLoginModal}
      />
      <main className="app-content">
      <Routes>
        <Route
          path="/"
          element={
            <MainPage
              message={message}
              count={count}
              setCount={setCount}
            />
          }
        >
        </Route>

        {/* Admin page route */}
        <Route
          path="/adminpage"
          element={
            isLoggedIn ? <AdminPage /> : <div>Please login first.</div>
          }
        />
      </Routes>

      {/* Login modal */}
      {isLoginModalVisible && (
        <Login
          onClose={toggleLoginModal}
          setIsLoggedIn={setIsLoggedIn}
          setUserRole={setUserRole}
        />
      )}
    </main>
    <Footer />
    </Router>
  );
};


export default App;