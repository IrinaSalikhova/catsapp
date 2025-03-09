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
    const token = localStorage.getItem('token'); 
    const role = localStorage.getItem('role');
    if (token) {
      setIsLoggedIn(true);
      setUserRole(role || ''); 
    }
  }, []);



  const toggleLoginModal = () => {
    setLoginModalVisible(!isLoginModalVisible);  // Toggle modal visibility
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
            <MainPage 
            isLoaded={isLoaded}
            loadError={loadError}
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
        <Route 
          path="/reset-password/:token" 
          element={<ResetPasswordPage />} />
          
        <Route 
          path="/navigatorpage" 
          element={<NavigatorPage />} />
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
        />
      )}
    </main>
    <Footer />
    </Router>
  );
};


export default App;