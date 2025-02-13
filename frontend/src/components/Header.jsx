import React from 'react';
import '../assets/Header.css';
import { useLocation, useNavigate } from 'react-router-dom';
import facebookIcon from '/facebook_logo.png';
import twitterIcon from '/x_logo.png';
import instagramIcon from '/instagram_logo.png';
import websiteIcon from '/web_logo.png';
import cchclogo from "/big_logo.png";


const Header = ({ isLoggedIn, userRole, onLogout, toggleLoginModal, toggleNewAssetModal }) => {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <header className="app-header">
      <div class="logo">
        <img src={cchclogo} alt="CCHC Logo" style={{width: '400px', height:'auto'}}/>
    </div>
      <div className="auth-buttons">
        {location.pathname !== '/' && (
          <button class='main-page-button' onClick={() => navigate('/')}>Go to Main Page</button>
        )}
        {!isLoggedIn && <button class='login-button' onClick={toggleLoginModal}>Login</button>}
        {isLoggedIn && userRole === 'admin' && location.pathname !== '/adminpage' && (
          <button class='admin-page-button' onClick={() => navigate('/adminpage')}>Admin Page</button>
        )}
        {isLoggedIn && userRole === 'navigator' && (
          <button class='navigator-page-button' onClick={() => alert('Navigator page is under development')}>
            Navigator Page
          </button>
        )}
        {isLoggedIn && <button class= 'logout-button' onClick={onLogout}>Logout</button>}
        <button class='add-asset-button' onClick={toggleNewAssetModal}>Add New Asset</button>
      </div>
    </header>
  );
};

export default Header;
