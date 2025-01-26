import React, { useEffect, useState } from 'react'; 
import axios from 'axios';
import './App.css';
import Login from './components/Login';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Ensure React Router is imported

const App = () => {
  const [message, setMessage] = useState('');
  const [count, setCount] = useState(0);
  const [isLoginVisible, setLoginVisible] = useState(false);  // Defaulting to true to show login form

  useEffect(() => {
    axios.get('/api/hello') // Relative path works on the same domain
        .then((response) => setMessage(response.data.message))
        .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const toggleLogin = () => {
    setLoginVisible(!isLoginVisible);
  };

  return (
    <Router>
      <div>
        <div>
          <h1>Frontend Connected to Backend</h1>
          <p>{message}</p>
        </div>
        <div className="card">
          <button onClick={() => setCount(count + 1)}>
            count is {count}
          </button>
        </div>

        {/* Login Button */}
        <button onClick={toggleLogin}>Login</button>

        {/* Conditional Login Form */}
        {isLoginVisible && <Login />}

        {/* Add routes to redirect after login */}
        <Routes>
          <Route path="/page" element={<div>Admin Page</div>} />
        </Routes>
      </div>
    </Router>
  );
};

export default App;