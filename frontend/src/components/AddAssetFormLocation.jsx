import React, { useState, useCallback, useEffect } from "react";
import "../assets/AddAssetForm.css";
import { GoogleMap, Marker, useLoadScript, Autocomplete } from '@react-google-maps/api';
import markerIcon from "/marker.png";

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};
const center = { lat: 45.383476, lng: -75.735704 };
const libraries = ['places','marker'];

const AddAssetFormLocation = ({ handleChange, service, index }) => {

    const [marker, setMarker] = useState(center);
    const [autocomplete, setAutocomplete] = useState(null);

    const { isLoaded, loadError } = useLoadScript({
      googleMapsApiKey: "AIzaSyDgfO9FOsujiJR5OU9VuJdgb35lWCWu6Os",
      libraries,
    });

    const updateLocationFields = (place) => {
      let address = "";
      let city = "";
      let postalCode = "";
  
      place.address_components.forEach((component) => {
        const types = component.types;
        if (types.includes("locality")) {
          city = component.long_name;
        } else if (types.includes("postal_code")) {
          postalCode = component.long_name;
        } else if (!types.includes("administrative_area_level_1") && !types.includes("administrative_area_level_2") && !types.includes("administrative_area_level_3") && !types.includes("sublocality") && !types.includes("political") && !types.includes("country")) {
          address += component.long_name + " ";
        }
      });
  
      handleChange({ target: { dataset: { field: "address" }, value: address.trim() } }, index);
      handleChange({ target: { dataset: { field: "cityName" }, value: city } }, index);
      handleChange({ target: { dataset: { field: "postCode" }, value: postalCode } }, index);
    };

    const handleMapClick = useCallback(async (event) => {
      if (!window.google || !window.google.maps) return;

      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setMarker({ lat, lng });
  
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === 'OK' && results[0]) {
            updateLocationFields(results[0]);
          }
      });
  }, [handleChange, index]);
    
  const handleMarkerDragEnd = (event) => {
    if (!window.google || !window.google.maps) return;
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMarker({ lat, lng });
    
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        updateLocationFields(results[0]);
      }
    });
  };

  const handlePlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
        setMarker({
          lat: place.geometry.location.lat(),
          lng: place.geometry.location.lng(),
        });
        updateLocationFields(place);
      }
    }
  };

  return(<div>

    <div>
      <div className="asset-form-field-container">
        <label>Address</label>
        <div className="input-wrapper">
        {isLoaded && (
          <Autocomplete
            onLoad={(auto) => setAutocomplete(auto)}
            onPlaceChanged={handlePlaceChanged}
            options={{
              bounds: new window.google.maps.LatLngBounds(center),
              strictBounds: false,
            }}
          >
        <input 
            data-field="address"
            placeholder="ex. 900 Merivale Road"
            maxLength="200"
            value={service.address}
            onChange={(e) => handleChange(e, index)} 
            />
          </Autocomplete>
        )}
         <div className="city-postcode-container">
        <input
          data-field="cityName"
          placeholder="ex. Ottawa"
          maxLength="30"
          value={service.cityName}
          onChange={(e) => handleChange(e, index)}
        />
        <input
          data-field="postCode"
          placeholder="ex. K1Z 5Z8"
          maxLength="7"
          value={service.postCode}
          onChange={(e) => handleChange(e, index)}
        />
      </div>
      </div>
      </div>

      <div className="asset-form-field-container">
        <label>Transportation options</label>
        <textarea
          data-field="transportation"
          placeholder="ex. bus 80 buse stop Merivale / Coldrey"
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
        <div>
        <p>
              Use the marker below to drag it to the desired location on the map.
            </p>
      <GoogleMap 
        mapContainerStyle={mapContainerStyle} 
        zoom={14} 
        center={marker || center} 
        onClick={handleMapClick}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
        }}
      >
      {marker && (
        <Marker 
          position={marker} 
          draggable={true} 
          onDragEnd={handleMarkerDragEnd}
          icon={{
            url: markerIcon,
            scaledSize: new window.google.maps.Size(40, 40),
          }} />
      )}      
    </GoogleMap>
    </div>
  )}
</div>
</div>

      );

};

export default AddAssetFormLocation;