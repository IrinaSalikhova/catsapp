// App.jsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLoadScript } from '@react-google-maps/api';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import MainPage from './components/MainPage';
import Login from './components/Login';
import AddAssetForm from './components/AddAssetForm';
import AdminPage from './components/AdminPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import NavigatorPage from './components/NavigatorPage';
import AssetOverview from './components/AssetOverview';
import GoogleMapContainer from './components/GoogleMapContainer';


const libraries = ['places', 'marker', 'geometry'];
const googleMapsApiKey = "AIzaSyDgfO9FOsujiJR5OU9VuJdgb35lWCWu6Os";

const App = () => {
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  const [isNewAssetModalVisible, setNewAssetModalVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');
  const [token, setToken] = useState('');
  const [selectedAsset, setSelectedAsset] = useState(null);

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey,
    libraries,
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    
    if (token) {
      setIsLoggedIn(true);
      setUserRole(role || '');
      setToken(token);
    }
  }, []);


  useEffect(() => {
    const inactivityTimeout = 5 * 60 * 60 * 1000; // 5 hours in milliseconds
    let hiddenStartTime;

    const handleVisibilityChange = () => {
        if (document.hidden) {
            hiddenStartTime = Date.now();
        } else {
            if (hiddenStartTime) {
                const elapsedTime = Date.now() - hiddenStartTime;
                if (elapsedTime > inactivityTimeout) {
                    window.location.reload();
                }
                hiddenStartTime = null;
            }
        }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    return () => {
        document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
}, []);
  

  const toggleLoginModal = () => {
    setLoginModalVisible(!isLoginModalVisible);  
  };

  const toggleNewAssetModal = () => {
    setNewAssetModalVisible((prev) => !prev);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setUserRole('');
  };

  const closeModal = () => setSelectedAsset(null);

  return (
    <Router>
      <Header
        isLoggedIn={isLoggedIn}
        userRole={userRole}
        onLogout={handleLogout}
        toggleLoginModal={toggleLoginModal}
        toggleNewAssetModal={toggleNewAssetModal}
      />
      <main className="app-content">
        <Routes>
          <Route
            path="/"
            element={
              <MainPage isLoaded={isLoaded} loadError={loadError} />
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
          <Route
            path="/reset-password/:token"
            element={<ResetPasswordPage />} />

          <Route
            path="/navigatorpage"
            element={<NavigatorPage isLoaded={isLoaded} loadError={loadError} />}
          />
        </Routes>

        {/* modals */}
        {isLoginModalVisible && (
          <Login
            onClose={toggleLoginModal}
            setIsLoggedIn={setIsLoggedIn}
            setUserRole={setUserRole}
          />
        )}
        {isNewAssetModalVisible && (
          <AddAssetForm
            onClose={toggleNewAssetModal}
            userRole={userRole}
            isLoaded={isLoaded}
            loadError={loadError}
            token={token}
          />
        )}
        {selectedAsset && (
          <AssetOverview
            asset={selectedAsset}
            onRequestClose={closeModal}
            isLoaded={isLoaded}
            loadError={loadError}
            isLoggedIn={isLoggedIn}
            userRole={userRole}
          />
        )}

      </main>
      <Footer />
    </Router>
  );
};


export default App;