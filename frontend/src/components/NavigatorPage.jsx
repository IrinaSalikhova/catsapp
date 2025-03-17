import React, { useState } from 'react';
import AssetOverview from './AssetOverview'; // Import the AssetOverview component
import '../assets/NavigatorPage.css'; // Ensure your CSS is correctly linked

const NavigatorPage = () => {
    const [activeSection, setActiveSection] = useState('notification');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedAsset, setSelectedAsset] = useState(null);

    // Mock data for assets
    const assets = [
        {
            id: 1,
            name: "Community Library",
            description: "A public library offering a wide range of books and digital materials.",
            isVolunOpp: true,
            volunOppText: "Looking for volunteers to help manage weekend operations.",
            languagesOffered: ["English", "French", "Spanish"],
            contactInfo: {
                email: ["info@communitylib.org"],
                phoneNumber: ["555-0123"],
                website: ["www.communitylib.org"]
            },
            address: "101 Library Street, Knowledge Town",
            operationalHours: "Mon-Fri 9:00 AM to 5:00 PM",
            volunteerOpportunities: [
                { opportunity: "Book Sorting", requiredHours: "10 hours per week" },
                { opportunity: "Event Management", requiredHours: "5 hours per week" }
            ]
        },
        {
            id: 2,
            name: "City Park",
            description: "A large urban park with playgrounds, sports facilities, and walking trails.",
            isVolunOpp: false,
            languagesOffered: ["English"],
            contactInfo: {
                email: [],
                phoneNumber: ["555-0456"],
                website: ["www.citypark.com"]
            },
            address: "202 Park Ave, Green City",
            operationalHours: "Open 24/7",
            volunteerOpportunities: []
        },
        {
            id: 3,
            name: "Senior Center",
            description: "A community center offering activities and support for the elderly.",
            isVolunOpp: true,
            volunOppText: "Volunteers needed for meal service and event planning.",
            languagesOffered: ["English", "Italian"],
            contactInfo: {
                email: ["contact@seniorcenter.com"],
                phoneNumber: ["555-0789"],
                website: ["www.seniorcenter.com"]
            },
            address: "303 Aging St, Elder Town",
            operationalHours: "Mon-Sat 8:00 AM to 8:00 PM",
            volunteerOpportunities: [
                { opportunity: "Meal Preparation", requiredHours: "15 hours per week" },
                { opportunity: "Workshop Hosting", requiredHours: "10 hours per week" }
            ]
        }
    ];    

    const openModal = (asset) => {
        setSelectedAsset(asset);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setSelectedAsset(null); // Clear the selected asset when closing the modal
    };

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            console.error('User not authenticated');
            window.location.href = '/login';
            return;
        }

        const fetchData = async () => {
            try {
                const response = await fetch("/api/assets/getAllPendingAssets", {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    }
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || "Failed to retrieve pending assets");
                }

                console.log("!!!!!!!!!!!!!!", result);

            } catch (error) {
                console.error("Error retrieving pending assets:", error.message);
            }

            try {
                const response = await fetch("/api/assets/getAssetDraft", {
                    method: "GET",
                    headers: {
                        'Authorization': `Bearer ${token}`,
                        'Content-Type': 'application/json',
                        'draftid': '563' // it should be added by code to load whatever is needed. 
                    }
                });

                const result = await response.json();

                if (!response.ok) {
                    throw new Error(result.message || "Failed to retrieve draft by id");
                }

                console.log("???????????????????", result);

            } catch (error) {
                console.error("Error retrieving draft by id:", error.message);
            }
        };

        fetchData();
    }, []); // Run only on component mount

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
                <div className={`navigator-section ${activeSection === 'notification' ? 'active' : ''}`}>
                    <h2>Notification</h2>
                </div>
                <div className={`navigator-section ${activeSection === 'assetReview' ? 'active' : ''}`}>
                    <h2>Asset Review</h2>
                    <ul>
                        {assets.map(asset => (
                            <li key={asset.id} onClick={() => openModal(asset)} className="asset-item">
                                {asset.name}
                            </li>
                        ))}
                    </ul>
                    {selectedAsset && <AssetOverview
                        isOpen={isModalOpen}
                        onRequestClose={closeModal}
                        asset={selectedAsset}
                    />}
                </div>
            </div>
        </div>
    );
};

export default NavigatorPage;
