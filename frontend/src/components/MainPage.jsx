import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

import { Outlet } from 'react-router-dom';
import '../assets/MainPage.css';


const MainPage = () => {
  const navigate = useNavigate();
  const [showOverlay, setShowOverlay] = useState(false);

  return (
    <div className="main-page">
      <div className="container">
      <div className="search-bar">
        <input type="text" className="search-input" placeholder="Search for resources..."/>
        <button className="search-button" title="Search">

          <i className="fas fa-search"></i>

        </button>
      </div>
    <div className="main">
      <div className="sidebar">
        <div className="title">Community Resources</div>
        <div className="filter-buttons">
          <button className="filter-button">All</button>
          <button className="filter-button">Filter 1</button>
          <button className="filter-button">Filter 2</button>
          <button className="filter-button">Filter 3</button>

        </div>
      </div>
    </div>


    </div>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"></link>
    </div>
  );
};

export default MainPage;
