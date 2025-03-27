import React from 'react';
import '../assets/AssetOverview.css';
import GoogleMapContainer from "./GoogleMapContainer";

const AssetOverview = ({ asset, onRequestClose, isLoaded, loadError }) => {
    const languagesOffered = asset.languagesOffered?.join(', ') || 'Not specified';
    const categories = asset.categoryIds?.join(', ') || 'No categories specified';
    const email = asset.contactInfo?.email?.join(', ') || 'No email provided';
    const phoneNumber = asset.contactInfo?.phoneNumber?.join(', ') || 'No phone number provided';
    const website = asset.contactInfo?.website?.join(', ') || 'No website provided';

    // Extract longitude and latitude from the asset object
    const longitude = asset.address.longitude;
    const latitude = asset.address.latitude;
    console.log(longitude, latitude);

    return (
        <div className="asset-overview-modal">
            <div className="asset-overview-content">
                <button onClick={onRequestClose} className="asset-overview-close">Close</button>
                <div key={asset.id} className="asset-overview-asset">
                    <h2>{asset.name}</h2>
                    <p><strong>Description:</strong> {asset.description || 'No description provided'}</p>
                    <p><strong>Volunteer Opportunities:</strong> {asset.isVolunOpp ? asset.volunOppText : 'No volunteer opportunities'}</p>
                    <p><strong>Languages Offered:</strong> {languagesOffered}</p>
                    <p><strong>Address:</strong> {asset.address ? `${asset.address.cityName}, ${asset.address.address}` : 'No address provided'}</p>
                    <p><strong>Contact:</strong></p>
                    <p>Email: {email}</p>
                    <p>Phone Number: {phoneNumber}</p>
                    <p>Website: {website}</p>
                    <p><strong>Categories:</strong> {categories}</p>
                </div>
                <div className="mapcontainer">
                    <GoogleMapContainer
                        isLoaded={isLoaded}
                        loadError={loadError}
                    //   longitude= {longitude}
                    //   latitude= {latitude}
                    />
                </div>
            </div>
        </div>
    );
};

export default AssetOverview;
