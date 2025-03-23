import React, { useState, useEffect } from 'react'; // Correctly import useEffect here
import CategoryDropdown from './CategoryDropdown';
import { useNavigate } from 'react-router-dom';
import AssetOverview from './AssetOverview';
import '../assets/MainPage.css';
import GoogleMapContainer from "./GoogleMapContainer";

const MainPage = ({ isLoaded, loadError }) => {
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState(null);
  const [selectedAsset, setSelectedAsset] = useState(null);  // Define state for selected asset
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [assets, setAssets] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCategorySelect = (categories) => {
    setSelectedCategories(categories);
    console.log('Selected categories:', categories);
  };

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
        console.error('User not authenticated');
        window.location.href = '/login';
        return;
    }

    const fetchData = async () => {
        setLoading(true);
        try {
            const response = await fetch("/api/assets/getAllPendingAssets", {
                method: "GET",
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json',
                }
            });

            if (!response.ok) {
                const data = await response.json();
                throw new Error(data.message || "Failed to retrieve assets");
            }

            const data = await response.json();
            setAssets(data.pendingAssets); // Assuming API returns an object with a pendingAssets array
        } catch (error) {
            console.error("Error retrieving assets:", error);
            setError(error.message);
        } finally {
            setLoading(false);
        }
    };

    fetchData();
  }, []);

const openModal = (asset) => {
    setSelectedAsset(asset); // Set the entire asset object to state
    setIsModalOpen(true);
};

const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAsset(null);
};

if (error) return <div>{error}</div>;
if (loading) return;

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
            <div className="listing card">
                          {assets.map(asset => (
                                <div key={asset.id} onClick={() => openModal(asset)} className="listing">
                                    <div className="listing-info">
                                        <div className="listing-title">{asset.name}</div>
                                        <div className="listing-details">ID: {asset.id}</div>
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
