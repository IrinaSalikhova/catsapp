import React, { useState, useEffect } from 'react';
import AssetOverview from './AssetOverview';
import '../assets/NavigatorPage.css';

const NavigatorPage = ({ userRole, isLoaded, loadError }) => {
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
                        headers: { 'Content-Type': 'application/json' }
                    }),
                    fetch("/api/assets/getAssetDraft", {
                        method: "GET",
                        headers: { 'Authorization': `Bearer ${token}`, 'Content-Type': 'application/json', 'draftid': 1058 }
                    }),
                    fetch("/api/assets/getAsset", {
                        method: "GET",
                        headers: { 'Content-Type': 'application/json', 'assetid': 1 }
                    })
                ]);

                if (!draftResponse.ok || !enabledResponse.ok || !draftDetailResponse.ok) {
                    throw new Error("One or more requests failed");
                }

                const draftData = await draftResponse.json();
                const enabledData = await enabledResponse.json();
                const draftDetails = await draftDetailResponse.json();
                const assetDetails = await assetDetailsResponse.json();

                console.log("enabled:", assetDetails);
                console.log("enabledassets:", enabledData);
                console.log("draft:", draftDetails);
                console.log("draftassets:", draftData);
                setAssetDrafts(draftData.pendingAssets);
                setEnabledAssets(enabledData.allAssets);
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
        console.log('Selected Asset:', asset);  // Log the selected asset details
        setSelectedAsset(asset);
        setIsModalOpen(true);
    };
    

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedAsset(null);
    };

    const handleApprove = () => {
    };

    const handleReject = () => {
    };

    const handleEdit = () => { 
    }


    if (error) return <div>Error: {error}</div>;
    if (loading) return <div>Loading...</div>;

    return (
        <div className="navigator-container">
            <div className="navigator-sidebar">
                <ul className="navigator-nav">
                    <li onClick={() => setActiveSection('notification')} className={activeSection === 'notification' ? 'active' : ''}>Notification</li>
                    <li onClick={() => setActiveSection('assetReview')} className={activeSection === 'assetReview' ? 'active' : ''}>Asset Management</li>
                </ul>
            </div>
            <div className="navigator-content">
                <h2>Asset Management</h2>
                <div className={`navigator-section ${activeSection === 'assetReview' ? 'active' : ''}`}>
                    <div className="nav-list-container">
                        <h3>Draft Assets</h3>
                        <div className="nav-list">
                            {assetDrafts.map(asset => (
                                <div key={asset.id} className="nav-asset-item">
                                <div onClick={() => openModal(asset)}>
                                    <strong>{asset.name}</strong> {asset.id}
                                </div>
                                <div className="asset-actions">
                                    <button className='approve-button' onClick={ handleApprove(asset) }>Approve</button>
                                    <button className='reject-button' onClick={ handleReject(asset) }>Reject</button>
                                    <button className='edit-button' onClick={ handleEdit(asset) }>Edit</button>
                                </div>
                            </div>
                            ))}
                        </div>
                    </div>
                    <div className="nav-list-container">
                        <h3>Available Assets</h3>
                        <div className="nav-list">
                            {enabledAssets.map(asset => (
                                <div key={asset.id} onClick={() => openModal(asset)} className="nav-asset-item">
                                    <strong>{asset.name}</strong> {asset.id}
                                </div>
                            ))}
                        </div>
                    </div>
                    {isModalOpen && selectedAsset && <AssetOverview 
                    asset={selectedAsset} 
                    onRequestClose={closeModal} 
                    isLoaded={isLoaded}
                    loadError={loadError}
                    userRole={userRole} 
                    />}
                </div>
            </div>
        </div>
    );
};

export default NavigatorPage;
