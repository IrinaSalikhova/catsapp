// MainPage
import React, { useState } from 'react';
import CategoryDropdown from './CategoryDropdown';
import { useNavigate } from 'react-router-dom';

import { Outlet } from 'react-router-dom';
import '../assets/MainPage.css';
import GoogleMapContainer from "./GoogleMapContainer";

const MainPage = ({ isLoaded, loadError }) => {
  const navigate = useNavigate();
  const [showOverlay, setShowOverlay] = useState(false);
const [selectedCategories, setSelectedCategories] = useState([]);

  const handleCategorySelect = (categories) => {
    setSelectedCategories(categories);
    console.log('Selected categories:', categories);
  };

  return (
    <div className="main-page">
      <div className="container">
      <div className="search-bar">
        <input type="text" className="search-input" placeholder="Search for resources..."/>
        <button className="search-button" title="Search">
          <i className="fas fa-search"></i>
        </button>
      </div>
      <div className="main-selection">
        <CategoryDropdown onCategorySelect={handleCategorySelect} />
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
      <div className="listing card">

          <div className="listing-title">St. Elizabeth Church</div>
          <div className="listing-info">
            <span className="listing-icon">⭐</span>
            <span className="listing-rating">4.7 Stars - 25 ratings</span>
          </div>
          <div className="listing-details">1303 Leaside Av, Ottawa, ON K1Z 7R2</div>
          <div className="listing-details">(613) 725-2242</div>
        </div>
        <div className="listing card">

          <div className="listing-title">Alexander Park</div>
          <div className="listing-info">
            <span className="listing-icon">⭐</span>
            <span className="listing-rating">4.3 Stars - 75 ratings</span>
          </div>
          <div className="listing-details">960 Silver St, Ottawa, ON K1Z 6H5</div>
        </div>
        <div className="listing card">

          <div className="listing-title">Kehillat Beth Israel</div>
          <div className="listing-info">
            <span className="listing-icon">⭐</span>
            <span className="listing-rating">4.5 Stars - 22 ratings</span>
          </div>
          <div className="listing-details">1400 Coldrey Ave, Ottawa, ON K1Z 7P9</div>
          <div className="listing-details">(613) 728-3501</div>
        </div>
        <div className="listing card">

          <div className="listing-title">Carlington Community Health Centre</div>
          <div className="listing-details">1303 Leaside Av, Ottawa</div>
          <div className="listing-details">(613) 725-2242</div>
        </div>
        </div>
        <div className="mapcontainer">
       <GoogleMapContainer 
        isLoaded={isLoaded}
        loadError={loadError}
       />
      </div>
      </div>
    </div>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css"/>
    </div>
  );
};

export default MainPage;
