import React from "react";
import { GoogleMap, Marker, Polygon } from "@react-google-maps/api";
import markerIcon from "/marker_red.png";

const containerStyle = {
  width: "100%",
  height: "100%"
};

const center = { lat: 45.383539135902325, lng: -75.73337435906367 };

const polygonCoords = [
  { lat: 45.379200, lng: -75.750300 }, // Clyde & Carling
  { lat: 45.390954, lng: -75.723079 }, // Carling & Fisher
  { lat: 45.376876, lng: -75.719600 }, // Fisher & Experimental Farm Pathway
  { lat: 45.376156, lng: -75.721184 },
  { lat: 45.377579, lng: -75.722851 },
  { lat: 45.368557, lng: -75.743898 }, // Experimental Farm Pathway & Clyde
  { lat: 45.379200, lng: -75.750300 }  // Back to start (Clyde & Carling)
];

const GoogleMapContainer = ({ isLoaded, loadError }) => {
  if (!isLoaded) return <div>Loading map...</div>; 
  if (loadError) return <div>Error loading maps</div>;

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={15}
    >
      <Marker 
      position={center} 
      icon={{
      url: markerIcon,
      scaledSize: new window.google.maps.Size(40, 40),
      }} />
      <Polygon
        paths={polygonCoords}
        options={{
          fillColor: "#eeb75c", 
          fillOpacity: 0.1,
          strokeColor: "#eeb75c",
          strokeOpacity: 0.9,
          strokeWeight: 2,
        }}
      />
    </GoogleMap>
  );
};

export default GoogleMapContainer;
