import React, { useEffect, useState } from 'react'; 
import axios from 'axios';
import './App.css';
import MainPage from './components/MainPage';
import Login from './components/Login';
import AdminPage from './components/AdminPage';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Ensure React Router is imported

const App = () => {
  const [message, setMessage] = useState('');
  const [count, setCount] = useState(0);
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);


  useEffect(() => {
    axios.get('/api/hello') // Relative path works on the same domain
        .then((response) => setMessage(response.data.message))
        .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const toggleLoginModal = () => {
    setLoginModalVisible(!isLoginModalVisible);  // Toggle modal visibility
  };

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <MainPage
              message={message}
              count={count}
              setCount={setCount}
              toggleLoginModal={toggleLoginModal}
            />
          }
        >
        </Route>

        {/* Admin page route */}
        <Route
          path="/adminPage"
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
        />
      )}
    </Router>
  );
};

export default App;