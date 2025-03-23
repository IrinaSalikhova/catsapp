import React, { useEffect, useState } from 'react';
import '../assets/AssetOverview.css';

const AssetOverview = ({ asset: initialAsset, onRequestClose }) => {
    const [assetDetails, setAssetDetails] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchAsset = async () => {
            // Check if initialAsset has an ID to fetch further details, otherwise use it directly
            if (!initialAsset) return;

            setLoading(true);
            const token = localStorage.getItem('token'); // Ensure token is retrieved inside useEffect

            if (!token) {
                setError('User not authenticated');
                console.error('User not authenticated');
                setLoading(false);
                return;
            }

            try {
                // Assuming you need to fetch more detailed data for the asset
                const response = await fetch(`/api/assets/${initialAsset.id}`, {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });

                if (!response.ok) {
                    const data = await response.json();
                    throw new Error(data.message || "Failed to retrieve asset");
                }

                const data = await response.json();
                setAssetDetails(data); // Set the asset directly with the fetched data
            } catch (error) {
                console.error("Error retrieving asset:", error);
                setError(error.message);
            } finally {
                setLoading(false);
            }
        };

        // Call fetchAsset only if initialAsset is meant to be augmented with more data
        fetchAsset();
    }, [initialAsset]);

    if (loading) return <div className="asset-overview-loading">Loading...</div>;
    if (error) return <div className="asset-overview-error">Error: {error}</div>;
    if (!assetDetails) return <div className="asset-overview-no-data">No asset found</div>;

    const asset = assetDetails || initialAsset; // Use detailed asset data or fallback to initial asset

    return (
        <div className="asset-overview-modal">
            <div className="asset-overview-content">
                <button onClick={onRequestClose} className="asset-overview-close">Close</button>
                <h2>{asset.name}</h2>
                <p><strong>Description:</strong> {asset.description}</p>
                <p><strong>Volunteer Opportunities:</strong> {asset.isVolunOpp ? asset.volunOppText : 'N/A'}</p>
                <p><strong>Languages Offered:</strong> {asset.languagesOffered.join(', ')}</p>
                <p><strong>Address:</strong> {asset.address ? `${asset.address.cityName}, ${asset.address.address}` : 'No address provided'}</p>
                <p><strong>Contact:</strong> Email: {asset.contactInfo.email.join(', ')}, Phone: {asset.contactInfo.phoneNumber.join(', ')}</p>
                <p><strong>Categories:</strong> {asset.categoryIds.join(', ')}</p>
            </div>
        </div>
    );
};

export default AssetOverview;
