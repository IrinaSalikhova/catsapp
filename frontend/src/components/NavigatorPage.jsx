import React, { useState, useEffect } from 'react';
import AssetOverview from './AssetOverview';
import '../assets/NavigatorPage.css';

const NavigatorPage = () => {
    const [activeSection, setActiveSection] = useState('notification');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(null);  // Store the entire asset object
    const [assets, setAssets] = useState([]);
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
                const response = await fetch("/api/assets/getAllPendingAssets", { //  "/api/assets/getById"
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

    if (error) return <div>Error: {error}</div>;
    if (loading) return <div>Loading...</div>;

    return (
        <div className="navigator-container">
            <div className="navigator-sidebar">
                <ul className="navigator-nav">
                    <li onClick={() => setActiveSection('notification')} className={activeSection === 'notification' ? 'active' : ''}>
                        Notification
                    </li>
                    <li onClick={() => setActiveSection('assetReview')} className={activeSection === 'assetReview' ? 'active' : ''}>
                        Asset Review
                    </li>
                </ul>
            </div>
            <div className="navigator-content">
                <div className={`navigator-section ${activeSection === 'assetReview' ? 'active' : ''}`}>
                    <h2>Asset Review</h2>
                    <ul>
                        {assets.map(asset => (
                            <li key={asset.id} onClick={() => openModal(asset)} className="asset-item">
                                {asset.name}, {asset.id}
                            </li>
                        ))}
                    </ul>
                    {isModalOpen && selectedAsset && <AssetOverview 
                        asset={selectedAsset} 
                        onRequestClose={closeModal} 
                    />}
                </div>
            </div>
        </div>
    );
};

export default NavigatorPage;
