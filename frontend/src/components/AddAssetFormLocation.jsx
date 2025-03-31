import React, { useState, useCallback, useEffect } from "react";
import "../assets/AddAssetForm.css";
import { GoogleMap, Marker, Polygon, useLoadScript, Autocomplete } from '@react-google-maps/api';
import markerIcon from "/marker_red.png";

const mapContainerStyle = {
  width: '100%',
  height: '400px',
};

const center = { lat: 45.383476, lng: -75.735704 };

const cchcPolygonCoords = [
  { lat: 45.379200, lng: -75.750300 }, // Clyde & Carling
  { lat: 45.389241, lng: -75.726979 }, // Carling & Fisher
  { lat: 45.376876, lng: -75.719600 }, // Fisher & Experimental Farm Pathway
  { lat: 45.376156, lng: -75.721184 },
  { lat: 45.377579, lng: -75.722851 },
  { lat: 45.368557, lng: -75.743898 }, // Experimental Farm Pathway & Clyde
  { lat: 45.379200, lng: -75.750300 }  // Back to start (Clyde & Carling)
];

const AddAssetFormLocation = ({ handleChange, service, index, isLoaded, loadError }) => {

    const [marker, setMarker] = useState(null);
    const [autocomplete, setAutocomplete] = useState(null);
    const [map, setMap] = useState(null);
    const [shouldCenterMap, setShouldCenterMap] = useState(true);


    const updateLocationFields = (place, lat, lng) => {
      let address = "";
      let city = "";
      let postalCode = "";
      lat = parseFloat(lat).toFixed(6);
      lng = parseFloat(lng).toFixed(6);
  
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
      handleChange({ target: { dataset: { field: "latitude" }, value: lat } }, index);
      handleChange({ target: { dataset: { field: "longitude" }, value: lng } }, index);
    };

    const handleMapClick = useCallback(async (event) => {
      if (!window.google || !window.google.maps) return;

      const lat = event.latLng.lat();
      const lng = event.latLng.lng();
      setMarker({ lat, lng });
  
      const geocoder = new window.google.maps.Geocoder();
      geocoder.geocode({ location: { lat, lng } }, (results, status) => {
          if (status === 'OK' && results[0]) {
            updateLocationFields(results[0], lat, lng);
          }
      });
  }, [handleChange, index]);
  
  
  const handleMarkerDragStart = () => {
    setShouldCenterMap(false); 
  };
  
  const handleMarkerDragEnd = (event) => {
    if (!window.google || !window.google.maps) return;
    const lat = event.latLng.lat();
    const lng = event.latLng.lng();
    setMarker({ lat, lng });
    
    const geocoder = new window.google.maps.Geocoder();
    geocoder.geocode({ location: { lat, lng } }, (results, status) => {
      if (status === "OK" && results[0]) {
        updateLocationFields(results[0], lat, lng);
      }
    });
  };

  const handlePlaceChanged = () => {
    if (autocomplete) {
      const place = autocomplete.getPlace();
      if (place.geometry) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          setMarker({ lat, lng });
          setShouldCenterMap(true);
          updateLocationFields(place, lat, lng);
      }
    }
  };

  const onMapLoad = useCallback((mapInstance) => {
    setMap(mapInstance);
  }, []);

  useEffect(() => {
    if (isLoaded) {
        if (service.latitude && service.longitude) {
            setMarker({ lat: parseFloat(service.latitude), lng: parseFloat(service.longitude) });
        } else {
            setMarker(center);
        }
    }
}, [isLoaded, service.latitude, service.longitude]);

  useEffect(() => {
    if (marker && map && shouldCenterMap) {
      map.panTo(marker);
    }
  }, [marker, map, shouldCenterMap]);
   

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
              componentRestrictions: { country: "ca" }
            }}
          >
        <input 
            className="autocomplete-input"
            data-field="address"
            placeholder="ex. 900 Merivale Road"
            maxLength="200"
            value={service.address}
            onChange={(e) => handleChange(e, index)} 
            autoComplete="off"
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
          Click or drag marker to the correct spot.
            </p>
      <GoogleMap 
        mapContainerStyle={mapContainerStyle} 
        zoom={15} 
        center={center} 
        onClick={handleMapClick}
        onLoad={onMapLoad}
        options={{
          zoomControl: true,
          streetViewControl: false,
          mapTypeControl: false,
          fullscreenControl: false,
          scrollwheel: true
        }}
      >

      {marker && (
        <Marker 
          position={marker} 
          draggable={true} 
          onDragStart={handleMarkerDragStart}
          onDragEnd={handleMarkerDragEnd}
          icon={{
            url: markerIcon,
            scaledSize: new window.google.maps.Size(40, 40),
          }} />
      )}
         <Polygon 
        paths={cchcPolygonCoords}
        options={{
          fillColor: "#eeb75c", 
          fillOpacity: 0.1,
          strokeColor: "#eeb75c",
          strokeOpacity: 0.9,
          strokeWeight: 3,
        }}
      />   
    </GoogleMap>
    </div>
  )}
</div>
</div>

      );

};

export default AddAssetFormLocation;