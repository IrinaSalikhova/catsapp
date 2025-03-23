import React, { useEffect, useState } from 'react';
import { useLoadScript } from '@react-google-maps/api';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { decode as jwt_decode } from 'jwt-decode';
import './App.css';
import Header from './components/Header';
import Footer from './components/Footer';
import MainPage from './components/MainPage';
import Login from './components/Login';
import AddAssetForm from './components/AddAssetForm';
import AdminPage from './components/AdminPage';
import ResetPasswordPage from './components/ResetPasswordPage';
import NavigatorPage from './components/NavigatorPage';

const libraries = ['places', 'marker', 'geometry'];

const App = () => {
  const [isLoginModalVisible, setLoginModalVisible] = useState(false);
  const [isNewAssetModalVisible, setNewAssetModalVisible] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [userRole, setUserRole] = useState('');

  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: "AIzaSyDgfO9FOsujiJR5OU9VuJdgb35lWCWu6Os",
    libraries,
  });

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('token');
      if (token) {
        const decoded = jwt_decode(token);
        const isExpired = decoded.exp < Date.now() / 1000;
        if (!isExpired) {
          setIsLoggedIn(true);
          setUserRole(localStorage.getItem('role') || '');
        } else {
          handleLogout();
        }
      }
    };

    checkAuth();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    setIsLoggedIn(false);
    setUserRole('');
  };

  const toggleLoginModal = () => {
    setLoginModalVisible(!isLoginModalVisible);
  };

  const toggleNewAssetModal = () => {
    setNewAssetModalVisible((prev) => !prev);
  };

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
          <Route path="/" element={<MainPage isLoaded={isLoaded} loadError={loadError} />} />
          <Route path="/adminpage" element={isLoggedIn ? <AdminPage /> : <Navigate to="/" />} />
          <Route path="/reset-password/:token" element={<ResetPasswordPage />} />
          <Route path="/navigatorpage" element={<NavigatorPage />} />
        </Routes>

        {isLoginModalVisible && (
          <Login onClose={toggleLoginModal} setIsLoggedIn={setIsLoggedIn} setUserRole={setUserRole} />
        )}
        {isNewAssetModalVisible && (
          <AddAssetForm onClose={toggleNewAssetModal} userRole={userRole} isLoaded={isLoaded} loadError={loadError} />
        )}
      </main>
      <Footer />
    </Router>
  );
};

export default App;
