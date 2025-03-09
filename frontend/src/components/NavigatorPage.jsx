import React, { useState } from 'react';
import '../assets/NavigatorPage.css';

const NavigatorPage = () => {
    const [activeSection, setActiveSection] = useState('notification');

    return (
        <div className="navigator-container">
            <div className="navigator-sidebar">
                <ul className="navigator-nav">
                    <li onClick={() => setActiveSection('notification')} className={activeSection === 'notification' ? 'active' : ''}>
                        Notification
                    </li>
                    <li onClick={() => setActiveSection('database')} className={activeSection === 'database' ? 'active' : ''}>
                        Database
                    </li>
                    <li onClick={() => setActiveSection('assetReview')} className={activeSection === 'assetReview' ? 'active' : ''}>
                        Asset Review
                    </li>
                </ul>
            </div>
            <div className="navigator-content">
                <div className={`navigator-section ${activeSection === 'notification' ? 'active' : ''}`}>
                    <h2>Notification</h2>
                    {/* Notification content goes here */}
                </div>
                <div className={`navigator-section ${activeSection === 'database' ? 'active' : ''}`}>
                    <h2>Database</h2>
                    {/* Database content goes here */}
                </div>
                <div className={`navigator-section ${activeSection === 'assetReview' ? 'active' : ''}`}>
                    <h2>Asset Review</h2>
                    {/* Asset Review content goes here */}
                </div>
            </div>
        </div>
    );
};

export default NavigatorPage;
