import React, { useState, useEffect } from 'react';
import '../assets/NavigatorPage.css';

const NavigatorPage = () => {
    const [activeSection, setActiveSection] = useState('notification');

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
                        'draftid': '563'
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
                </div>
            </div>
        </div>
    );
};

export default NavigatorPage;
