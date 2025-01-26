import React from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const Header = ({ isLoggedIn, userRole, onLogout, toggleLoginModal }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header className="app-header">
      <h1>My App</h1>
      <div className="header-buttons">
        {location.pathname !== '/' && (
          <button onClick={() => navigate('/')}>Go to Main Page</button>
        )}
        {!isLoggedIn && <button onClick={toggleLoginModal}>Login</button>}
        {isLoggedIn && userRole === 'admin' && location.pathname !== '/adminpage' && (
          <button onClick={() => navigate('/adminpage')}>Admin Page</button>
        )}
        {isLoggedIn && userRole === 'navigator' && (
          <button onClick={() => alert('Navigator page is under development')}>
            Navigator Page
          </button>
        )}
        {isLoggedIn && <button onClick={onLogout}>Logout</button>}
      </div>
    </header>
  );
};

export default Header;
