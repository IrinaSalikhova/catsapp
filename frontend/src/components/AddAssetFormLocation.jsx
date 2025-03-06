import React, { useState, useCallback } from "react";
import "../assets/AddAssetForm.css";
import { GoogleMap, Marker, useLoadScript } from '@react-google-maps/api';


const mapContainerStyle = {
  width: '100%',
  height: '300px',
};
const center = { lat: 45.4215, lng: -75.6972 };

const AddAssetFormLocation = ({ handleChange, service, index }) => {


    const [marker, setMarker] = useState(null);
    const { isLoaded, loadError } = useLoadScript({
      googleMapsApiKey: "AIzaSyDgfO9FOsujiJR5OU9VuJdgb35lWCWu6Os",
    });

    const handleMapClick = useCallback(async (event) => {
      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setMarker({ lat, lng });
  
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === 'OK' && results[0]) {
              handleChange({ target: { dataset: { field: "address" }, value: results[0].formatted_address } }, index);
          }
      });
  }, [handleChange, index]);
    

      return(
                      <div>
                      <div>
                          <div className="asset-form-field-container">
                          <label>Address</label>
                          <textarea
                            data-field="address"
                            placeholder="900 Merivale Road"
                            maxLength="200"
                            value={service.address}
                            onChange={(e) => handleChange(e, index)}
                          />
                          </div>
      
                          <div className="asset-form-field-container">
                          <label>City</label>
                          <textarea
                            data-field="cityName"
                            placeholder="Ottawa"
                            maxLength="30"
                            value={service.cityName}
                            onChange={(e) => handleChange(e, index)}
                          />
                          </div>
      
                          <div className="asset-form-field-container">
                          <label>Postal Code</label>
                          <textarea
                            data-field="postCode"
                            placeholder="K1Z 5Z8"
                            maxLength="7"
                            value={service.postCode}
                            onChange={(e) => handleChange(e, index)}
                          />
                          </div>
      
                          <div className="asset-form-field-container">
                          <label>Transportation options</label>
                          <textarea
                            data-field="transportation"
                            placeholder="bus 80"
                            maxLength="300"
                            value={service.transportation}
                            onChange={(e) => handleChange(e, index)}
                          />
                          </div>
                      </div>
                      
                      <div style={{ marginTop: '10px' }}>
                  {loadError ? (
                    <p>Error loading maps</p>
                  ) : !isLoaded ? (
                    <p>Loading maps...</p>
                  ) : (
                    <GoogleMap mapContainerStyle={mapContainerStyle} zoom={12} center={marker || center} onClick={handleMapClick}>
                      {marker && <Marker position={marker} />}
                    </GoogleMap>
                  )}
                        </div>
                      </div>
      
                      
                    )

};

export default AddAssetFormLocation;