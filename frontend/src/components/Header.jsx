import React from 'react';
import '../assets/Header.css';
import { useLocation, useNavigate } from 'react-router-dom';

import cchclogo from "/big_logo.png";


const Header = ({ isLoggedIn, userRole, onLogout, toggleLoginModal, toggleNewAssetModal }) => {
  const location = useLocation();
  const navigate = useNavigate();

  const handleLogoClick = () => {
    if (location.pathname !== '/') {
      navigate('/');
    }
  };

console.log("Is logged in:", isLoggedIn);
console.log("User role:", userRole);

  return (
    <header className="app-header">
           <div className="logo" onClick={handleLogoClick} style={{ cursor: 'pointer' }}>
        <img src={cchclogo} alt="CCHC Logo" style={{ width: '400px', height: 'auto' }}/>
      </div>
      <div className="auth-buttons">
        {location.pathname !== '/' && (
          <button className='btn-primary' onClick={() => navigate('/')}>Go to Main Page</button>
        )}
        {!isLoggedIn && <button className='btn-primary' onClick={toggleLoginModal}>Login</button>}
        {isLoggedIn && userRole === 'admin' && location.pathname !== '/adminpage' && (
          <button className='btn-primary' onClick={() => navigate('/adminpage')}>Admin Page</button>
        )}
        {isLoggedIn && userRole === 'navigator' && location.pathname !== '/navigatorpage' && (
          <button className='btn-primary' onClick={() => navigate('/navigatorpage')}>
            Navigator Page
          </button>
        )}
        {isLoggedIn && <button className= 'btn-primary' onClick={onLogout}>Logout</button>}
        <button className='btn-primary' onClick={toggleNewAssetModal}>Add New Asset</button>
      </div>
    </header>
  );
};

export default Header;
