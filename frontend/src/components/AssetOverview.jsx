import React, { useEffect, useState } from 'react';
import '../assets/AssetOverview.css';

const AssetOverview = ({ assetId, onRequestClose }) => {
    const [asset, setAsset] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const mockAsset = {
        id: 1275,
        name: "Central Library",
        description: "A large library with a wide selection of books and resources.",
        isVolunOpp: true,
        volunOppText: "Volunteers needed for event organization.",
        languagesOffered: ["English", "Spanish", "French"],
        address: {
            cityName: "Metropolis",
            address: "1234 Main St"
        },
        contactInfo: {
            email: ["info@centrallibrary.com"],
            phoneNumber: ["555-1234"],
            website: ["www.centrallibrary.com"]
        },
        categoryIds: [1, 3, 5]
    };

    // useEffect(() => {
    //     const fetchAsset = async () => {
    //         if (!assetId) return;

    //         setLoading(true);
    //         const token = localStorage.getItem('token'); // Ensure token is retrieved inside useEffect
    //         if (!token) {
    //             setError('User not authenticated');
    //             console.error('User not authenticated');
    //             setLoading(false);
    //             return;
    //         }

    //         try {
    //             const response = await fetch(`/api/assets/getAsset`, { // /${assetId}
    //                 method: "GET",
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                     'assetId': assetId,
    //                 }
    //             });

    //             if (!response.ok) {
    //                 const data = await response.json();
    //                 throw new Error(data.message || "Failed to retrieve asset");
    //             }

    //             const data = await response.json();
    //             setAsset(data);
    //         } catch (error) {
    //             console.error("Error retrieving asset:", error);
    //             setError(error.message);
    //         } finally {
    //             setLoading(false);
    //         }
    //     };

    //     fetchAsset();
    // }, [assetId]);

    useEffect(() => {
        setLoading(true);
        try {
            // Simulate fetching data by setting the mock data after a delay
            setTimeout(() => {
                setAsset(mockAsset);
                setLoading(false);
            }, 1000); // Delay to mimic an API call
        } catch (error) {
            console.error("Failed to load mock data:", error);
            setError("Failed to load data");
            setLoading(false);
        }
    }, []);

    if (loading) return;
    if (error) return <div className="asset-overview-error">Error: {error}</div>;
    if (!asset) return <div className="asset-overview-no-data">No asset found</div>;

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
