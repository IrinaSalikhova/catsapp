import React from "react";
import { GoogleMap, LoadScript, Marker } from "@react-google-maps/api";

const containerStyle = {
  width: "100%",
  height: "100%",
};

const carlington = { lat: 45.383539135902325, lng: -75.73337435906367 };

const GoogleMapContainer = () => {
  return (
    <LoadScript googleMapsApiKey="AIzaSyC9lPCFtZZcDup4UwnFNPsFOcrxfuQsgGA">
      <GoogleMap mapContainerStyle={containerStyle} center={carlington} zoom={15}>
        <Marker position={carlington} />
      </GoogleMap>
    </LoadScript>
  );
};

export default GoogleMapContainer;