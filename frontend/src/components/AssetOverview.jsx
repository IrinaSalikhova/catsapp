import React, { useState } from 'react';
import '../assets/AssetOverview.css';
import GoogleMapContainer from "./GoogleMapContainer";

const AssetOverview = ({ isLoggedIn, userRole, asset, onRequestClose, isLoaded, loadError }) => {
    const [selectedChild, setSelectedChild] = useState(null);
    const [selectedParent, setSelectedParent] = useState(null);

    const handleChildAssetClick = (child) => {
        console.log("Selected child asset details:", child);  // Logging child asset details
        setSelectedChild(child);
    };

    const handleCloseChildModal = () => {
        setSelectedChild(null);
    };


    const handleParentAssetClick = async () => {
        const parentId = asset.parentAssetId || asset.parentAssetDraftId;
        console.log("Opening parent asset details for ID:", parentId);

        const token = localStorage.getItem('token');
        if (!token) {
            console.error('User not authenticated');
            window.location.href = '/login';
            return;
        }

        try {
            let response;
            if (asset.parentAssetId) {
                // Fetch the regular asset if parentAssetId is available
                response = await fetch(`/api/assets/getAsset`, {
                    method: "GET",
                    headers: {
                        'Content-Type': 'application/json',
                        'assetid': parentId
                    }
                });
            } else if (asset.parentAssetDraftId) {
                // Fetch the draft asset if parentAssetDraftId is available
                response = await fetch(`/api/assets/getAssetDraft`, {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'draftid': parentId
                    }
                });
            }

            if (!response.ok) {
                throw new Error("Failed to fetch asset details");
            }

            const parentData = await response.json();
            console.log("Fetched parent asset details:", parentData);

            // Adjust the condition to check for the existence of specific object keys
            if (parentData && 'asset' in parentData && parentData.asset) {
                setSelectedParent(parentData.asset);
            } else if (parentData && 'assetDraft' in parentData && parentData.assetDraft) {
                setSelectedParent(parentData.assetDraft);
            } else {
                console.error("No valid data found in response:", parentData);
                // Optionally set some default state or handle the error visually
            }

        } catch (error) {
            console.error("Error fetching parent asset details:", error);
        }
    };

    const handleCloseParentModal = () => {
        setSelectedParent(null);
    };

    const handleEditAsset = () => {
    };

    const handleDeleteAsset = () => {
    };

    const handleSuggestEdit = () => { 
    }

    const formatPhoneNumber = (input) => {
        const digits = input.replace(/\D/g, ""); // Remove non-numeric characters
        if (digits.length === 0) return "";
        let formatted = `(${digits.slice(0, 3)}`;
        if (digits.length > 3) formatted += `) ${digits.slice(3, 6)}`;
        if (digits.length > 6) formatted += `-${digits.slice(6, 10)}`;
        if (digits.length > 10) formatted += ` ext. ${digits.slice(10)}`;
        return formatted;
    };

    const renderAddress = (address) => {
        // Check if the address object is provided
        if (!address || !address.cityName && !address.address && !address.postCode) {
            return 'No address provided';
        }
        return `${address.cityName || ''}, ${address.address || ''}, ${address.postCode || ''}`.trim();
    };

    return (
        <div className="asset-overview-modal">
            <div className="asset-overview-content">
                <button onClick={onRequestClose} className="asset-overview-close">Close</button>
                <h2>{asset.name}</h2>
                <p><strong>Description: </strong> {asset.description || 'No description provided'}</p>
                <p><strong>Categories: </strong> {asset.categoryNames || 'No categories specified'}</p>
                <p><strong>Address: </strong> {renderAddress(asset.address)}</p>
                <p><strong>Contact: </strong></p>
                <div className="overview-contact-info">
                    <p>Email: {asset.contactInfo?.email?.join(', ') || 'No email provided'}</p>
                    <p>Phone Number: {asset.contactInfo?.phoneNumber?.map(phone => formatPhoneNumber(phone)).join(', ') || 'No phone number provided'}</p>
                    <p>Website: {asset.contactInfo?.website?.length ? (
                        asset.contactInfo.website.map((url, index) => (
                            <React.Fragment key={index}>
                                <a href={url.trim()} target="_blank" rel="noopener noreferrer">{url.trim()}</a>
                                {index < asset.contactInfo.website.length - 1 ? ', ' : ''}
                            </React.Fragment>
                        ))
                    ) : 'No website provided'}
                    </p>
                </div>
                <p><strong>Transportation:</strong> {asset.address.transportation || 'No transportation info'}</p>
                <p><strong>Format:</strong> {asset.format || 'No format info'}</p>
                <p><strong>Volunteer Opportunities:</strong> {asset.isVolunOpp ? asset.volunOppText : 'No volunteer opportunities'}</p>
                <p><strong>Languages Offered:</strong> {asset.languagesOffered?.join(', ') || 'Not specified'}</p>
                {isLoggedIn && userRole === 'navigator' && (
                    <p><strong>Social Worker Only Note:</strong> {asset.socialWorkerOnlyNote || 'No specific notes'}</p>
                )}
                {asset.children && asset.children.length > 0 && (
                    <p><strong>Programs: </strong>
                        {asset.children?.map((child, index) => (
                            <React.Fragment key={index}>
                                <a onClick={() => handleChildAssetClick(child)} className="child-asset-link" style={{ cursor: 'pointer', color: 'blue' }}>
                                    {child.name}
                                </a>
                                {index < asset.children.length - 1 ? ', ' : ''}
                            </React.Fragment>
                        ))}
                    </p>
                )}
                {(asset.parentAssetName || asset.parentAssetDraftName) && (
                    <p><strong>Part of: </strong>
                        <React.Fragment >
                            <a onClick={handleParentAssetClick} className="child-asset-link" style={{ cursor: 'pointer', color: 'blue' }}>
                                {asset.parentAssetName} {asset.parentAssetDraftName}
                            </a>

                        </React.Fragment>
                    </p>
                )}

                {asset.address.longitude && asset.address.latitude && (
                    <div className="overview-map-container">
                        <GoogleMapContainer
                            isLoaded={isLoaded}
                            loadError={loadError}
                            longitude={asset.address.longitude}
                            latitude={asset.address.latitude}
                        />
                    </div>
                )}

                {isLoggedIn && userRole === 'navigator' && (
                    <>
                        <button className='add-asset-button' onClick={handleEditAsset}>Edit Asset</button>
                        <button className='add-asset-button' onClick={handleDeleteAsset}>Delete Asset</button>
                    </>
                )}
                <button className='add-asset-button' onClick={handleSuggestEdit}>Suggest Edit</button>
            </div>
            {/* Recursive modal for child asset */}
            {selectedChild && (
                <AssetOverview
                    asset={selectedChild}
                    onRequestClose={handleCloseChildModal}
                    isLoaded={isLoaded}
                    loadError={loadError}
                />
            )}

            {selectedParent && (
                <AssetOverview
                    asset={selectedParent}
                    onRequestClose={handleCloseParentModal}
                    isLoaded={isLoaded}
                    loadError={loadError}
                />
            )}
        </div>
    );
};

export default AssetOverview;
