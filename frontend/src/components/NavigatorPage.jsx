import React, { useState, useEffect } from 'react';
import AssetOverview from './AssetOverview';
import '../assets/NavigatorPage.css';
import GoogleMapContainer from "./GoogleMapContainer";

const NavigatorPage = ({ isLoaded, loadError }) => {
    const [activeSection, setActiveSection] = useState('notification');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(null);
    const [assetDrafts, setAssetDrafts] = useState([]);
    const [enabledAssets, setEnabledAssets] = useState([]);    
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(false);

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
                const [draftResponse, enabledResponse, draftDetailResponse, assetDetailsResponse] = await Promise.all([
                    fetch("/api/assets/getAllPendingAssets", {
                        method: "GET",
                        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
                    }),
                    fetch("/api/assets/getAllEnabledAssets", {
                        method: "GET",
                        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json' }
                    }),
                    fetch("/api/assets/getAssetDraft", {
                        method: "GET",
                        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'draftid': 1058 }
                    }),
                    fetch("/api/assets/getAsset", {
                        method: "GET",
                        headers: { 'Content-Type': 'application/json', 'assetId': 862 }
                    })
                ]);

                if (!draftResponse.ok || !enabledResponse.ok || !draftDetailResponse.ok) {
                    throw new Error("One or more requests failed");
                }

                const draftData = await draftResponse.json();
                const enabledData = await enabledResponse.json();
                const draftDetails = await draftDetailResponse.json();
                const assetDetails = await assetDetailsResponse.json();
                
                console.log("Draft:", assetDetails);
                console.log("assets:", enabledData);
                console.log("Draft details:", draftDetails);
                setAssetDrafts(draftData.pendingAssets);
                setEnabledAssets(enabledData.enabledAssets);
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
        setSelectedAsset(asset);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedAsset(null);
    };

    if (error) return <div>Error: {error}</div>;
    if (loading) return <div>Loading...</div>;

    return (
        <div className="navigator-container">
            <div className="navigator-sidebar">
                <ul className="navigator-nav">
                    <li onClick={() => setActiveSection('notification')} className={activeSection === 'notification' ? 'active' : ''}>Notification</li>
                    <li onClick={() => setActiveSection('assetReview')} className={activeSection === 'assetReview' ? 'active' : ''}>Asset Review</li>
                </ul>
            </div>
            <div className="navigator-content">
                <div className={`navigator-section ${activeSection === 'assetReview' ? 'active' : ''}`}>
                    <h2>Asset Management</h2>
                    <ul>
                        {assetDrafts.map(asset => (
                            <li key={asset.id} onClick={() => openModal(asset)} className="asset-item">{asset.name}, {asset.id}</li>
                        ))}
                    </ul>
                    <ul>
                        {enabledAssets.map(asset => (
                            <li key={asset.id} onClick={() => openModal(asset)} className="asset-item">{asset.name}, {asset.id}</li>
                        ))}
                    </ul>
                    {isModalOpen && selectedAsset && <AssetOverview asset={selectedAsset} onRequestClose={closeModal} />}
                </div>
                <div className="mapcontainer">
                    <GoogleMapContainer isLoaded={isLoaded} loadError={loadError} />
                </div>
            </div>
        </div>
    );
};

export default NavigatorPage;
