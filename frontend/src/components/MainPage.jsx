import React, { useState, useEffect } from 'react'; 
import CategoryDropdown from './CategoryDropdown';
import AssetOverview from './AssetOverview';
import '../assets/MainPage.css';
import GoogleMapContainer from "./GoogleMapContainer";
import searchIcon from "/search.png";



const MainPage = ({ isLoaded, loadError }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [isVolunOpp, setIsVolunOpp] = useState(false);
  const [searchPhrase, setSearchPhrase] = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [assets, setAssets] = useState([]);

  const handleCategorySelect = (categories) => {
    const categoryIds = categories.map(category => category.id);
    setSelectedCategories(categoryIds);
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch("/api/assets/findAssets", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            categoryIds: selectedCategories,
            isVolunOpp,
            searchPhrase,
          }),
        });

        const data = await response.json();
        if (!response.ok) {
          throw new Error(data.message || "Failed to retrieve assets");
        }

        setAssets(data.assets);
      } catch (error) {
        console.error("Error retrieving assets:", error);
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [selectedCategories, isVolunOpp, searchPhrase]);

  const openModal = (asset) => {
    setSelectedAsset(asset);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedAsset(null);
  };

  const handleSearchChange = (event) => {
    setSearchInput(event.target.value);
  };
  const toggleVolunFilter = () => {
    setIsVolunOpp((prev) => !prev);
  };
  const handleSearchClick = () => {
    setSearchPhrase(searchInput);
  };

  if (error) return <div className="error-message">{error}</div>;

  return (
    <div className="main-page">

      <div className="main-selection">
        <div className="search-bar">
          <CategoryDropdown onCategorySelect={handleCategorySelect} />
          <input
            type="text"
            className="search-input"
            placeholder="Search for resources..."
            value={searchInput}
            onChange={handleSearchChange}
            onKeyDown={(e) => e.key === "Enter" && handleSearchClick()}
          />
          <button
            className="search-button"
            title="Search"
            onClick={handleSearchClick}>
            <img src={searchIcon} alt="Search" />
          </button>
        </div>
        <div className="filter-buttons">
          <button
            className={`filter-button ${isVolunOpp ? "active" : ""}`}
            onClick={toggleVolunFilter}>
            Look for volunteering opportunities
          </button>
        </div>
      </div>
      <div className="main">
        <div className="sidebar">
          <div className="title">Community Resources</div>
          <div className="listing-container">
            {loading ? (
              <div className="loading-message">Loading assets...</div>
            ) : (
              assets.map(asset => (
                <div key={asset.id} onClick={() => openModal(asset)} className="listing">
                  <div className="listing-info">
                    <div className="listing-title">{asset.name}</div>
                    <div className="listing-details">{asset.categoryNames.join(', ')}</div>
                  </div>
                  {asset.children && asset.children.length > 0 && (
          <div className="children-badge">{asset.children.length}</div>
        )}
                </div>
              ))
            )}
            {isModalOpen && selectedAsset && <AssetOverview
              asset={selectedAsset}
              onRequestClose={closeModal}
              isLoaded={isLoaded}
              loadError={loadError} />}
          </div>
        </div>
        <div className="mapcontainer">
         <GoogleMapContainer isLoaded={isLoaded} loadError={loadError} assets={assets} />
        </div>
      </div>
    </div>
  );
};

export default MainPage;