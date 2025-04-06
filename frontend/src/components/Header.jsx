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
          <button className='main-page-button' onClick={() => navigate('/')}>Go to Main Page</button>
        )}
        {!isLoggedIn && <button className='login-button' onClick={toggleLoginModal}>Login</button>}
        {isLoggedIn && userRole === 'admin' && location.pathname !== '/adminpage' && (
          <button className='admin-page-button' onClick={() => navigate('/adminpage')}>Admin Page</button>
        )}
        {isLoggedIn && userRole === 'navigator' && (
          <button className='navigator-page-button' onClick={() => navigate('/navigatorpage')}>
            Navigator Page
          </button>
        )}
        {isLoggedIn && <button className= 'logout-button' onClick={onLogout}>Logout</button>}
        <button className='add-asset-button' onClick={toggleNewAssetModal}>Add New Asset</button>
      </div>
    </header>
  );
};

export default Header;
