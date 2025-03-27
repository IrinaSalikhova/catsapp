import React, { useState, useEffect } from 'react'; // Correctly import useEffect here
import CategoryDropdown from './CategoryDropdown';
import AssetOverview from './AssetOverview';
import '../assets/MainPage.css';
import GoogleMapContainer from "./GoogleMapContainer";

const MainPage = ({ isLoaded, loadError }) => {
  const [selectedCategories, setSelectedCategories] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);  // Define state for selected asset
  const [isModalOpen, setIsModalOpen] = useState(false);

  const mockAssets = [
    { id: 1, name: "Community Library", description: "A large library with extensive resources available to the public.", address: { latitude: 45.380955, longitude: -75.734694 } },
    { id: 2, name: "Local Park", description: "A beautiful park with walking trails, a pond, and picnic areas.", address: { latitude: 45.377619, longitude: -75.733562 } },
    { id: 3, name: "Museum of History", description: "A museum dedicated to the history of the region with interactive exhibits.", address: { latitude: 45.385345, longitude: -75.729487 } },
    { id: 4, name: "Art Gallery", description: "Contemporary art gallery featuring local and international artists.", address: { latitude: 45.380078, longitude: -75.725889 } },
    { id: 5, name: "Senior Community Center", description: "Provides activities and support for the senior community.", address: { latitude: 45.381802, longitude: -75.737976 } },
    { id: 6, name: "Recreational Sports Complex", description: "Sports complex with facilities for various sports.", address: { latitude: 45.377961, longitude: -75.728098 } },
    { id: 7, name: "Public Swimming Pool", description: "A public facility with indoor and outdoor pools.", address: { latitude: 45.382499, longitude: -75.729980 } },
    { id: 8, name: "Botanical Gardens", description: "Expansive gardens featuring flora from around the world.", address: { latitude: 45.372159, longitude: -75.735219 } },
    { id: 9, name: "City Zoo", description: "Home to a wide range of exotic animals and educational programs.", address: { latitude: 45.389990, longitude: -75.726067 } },
    { id: 10, name: "Cultural Arts Theatre", description: "A venue for live theatre productions and cultural events.", address: { latitude: 45.374810, longitude: -75.723509 } }
];

  const handleCategorySelect = (categories) => {
    setSelectedCategories(categories);
    console.log('Selected categories:', categories);
  };

  // useEffect(() => {
  //   const token = localStorage.getItem('token');

  //   const fetchData = async () => {
  //       setLoading(true);
  //       try {
  //           const response = await fetch("/api/assets/getAllPendingAssets", {
  //               method: "GET",
  //               headers: {
  //                   'Authorization': `Bearer ${token}`,
  //                   'Content-Type': 'application/json',
  //               }
  //           });

  //           if (!response.ok) {
  //               const data = await response.json();
  //               throw new Error(data.message || "Failed to retrieve assets");
  //           }

  //           const data = await response.json();
  //           setAssets(data.pendingAssets); // Assuming API returns an object with a pendingAssets array
  //       } catch (error) {
  //           console.error("Error retrieving assets:", error);
  //           setError(error.message);
  //       } finally {
  //           setLoading(false);
  //       }
  //   };

  //   fetchData();
  // }, []);

  const openModal = (asset) => {
    setSelectedAsset(asset); // Set the entire asset object to state
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAsset(null);
  };

  return (
    <div className="main-page">
      <div className="container">
        <div className="search-bar">
          <input type="text" className="search-input" placeholder="Search for resources..." />
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
            <div className="listing-container">
              {mockAssets.map(asset => (
                <div key={asset.id} onClick={() => openModal(asset)} className="listing">
                  <div className="listing-info">
                    <div className="listing-title">{asset.name}</div>
                    <div className="listing-details">ID: {asset.id}</div>
                    <div className="listing-details">Des: {asset.description}</div>
                  </div>
                </div>
              ))}
              {isModalOpen && selectedAsset && <AssetOverview
                asset={selectedAsset}
                onRequestClose={closeModal}
              />}
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
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/5.15.3/css/all.min.css" />
    </div>
  );
};

export default MainPage;
