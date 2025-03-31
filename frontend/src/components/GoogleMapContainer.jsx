import React from "react";
import { GoogleMap, Marker, Polygon } from "@react-google-maps/api";
import markerIcon from "/marker_red.png";
import transparentMarker from "/marker_transparent.svg";

const containerStyle = {
  width: "100%",
  height: "100%" 
};

const polygonCoords = [
  { lat: 45.379200, lng: -75.750300 },
  { lat: 45.389241, lng: -75.726979 },
  { lat: 45.376876, lng: -75.719600 },
  { lat: 45.376156, lng: -75.721184 },
  { lat: 45.377579, lng: -75.722851 },
  { lat: 45.368557, lng: -75.743898 },
  { lat: 45.379200, lng: -75.750300 }
];

const GoogleMapContainer = ({ isLoaded, loadError, assets, latitude, longitude }) => {
  const center = latitude && longitude ? { lat: latitude, lng: longitude } : { lat: 45.383539, lng: -75.733374 }; // Default center

  if (!isLoaded) return <div>Loading map...</div>;
  if (loadError) return <div>Error loading maps</div>;

  

  return (
    <GoogleMap
      mapContainerStyle={containerStyle}
      center={center}
      zoom={15}
      options={{
        zoomControl: true,
        scrollwheel: true,
        styles: [
          {
            featureType: "poi.business",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "poi.sports_complex",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "poi.attraction",
            stylers: [{ visibility: "off" }],
          },
          {
            featureType: "poi.place_of_worship",
            stylers: [{ visibility: "off" }],
          },

        ],
      }}
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

{assets && Array.isArray(assets) && assets.map((asset, index) => (
  asset.address.latitude && asset.address.longitude ? (
    <Marker
      key={asset.id}
      position={{ lat: asset.address.latitude, lng: asset.address.longitude }}
      icon={{
        url: transparentMarker,
        scaledSize: new window.google.maps.Size(30, 30), // Ensure Google Maps API is loaded
        fillColor: "green",
        fillOpacity: 1,
        strokeWeight: 1,
      }}
      title={asset.name}
    />
  ) : null
))}
    </GoogleMap>
  );
};

export default GoogleMapContainer;
