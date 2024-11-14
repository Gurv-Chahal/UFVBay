import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  useMapEvents,
} from "react-leaflet";
import { useState } from "react";
import { useLocation } from "react-router-dom";

const Map = ({ position, setPosition }) => {
  const location = useLocation();

  // Function to handle placing a marker on click
  const MapClickHandler = () => {
    useMapEvents({
      click: (e) => {
        setPosition([e.latlng.lat, e.latlng.lng]); // Set position state to the clicked coordinates on map
      },
    });
    return null;
  };

  return (
    <MapContainer
      center={[49.0283, -122.285]}
      zoom={17}
      scrollWheelZoom={false}
      style={{ height: "300px", width: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Conditionally renders any page that starts with "/item/" */}
      {location.pathname.startsWith("/item/") && (
        <Marker position={[49.0283, -122.285]}>
          <Popup>Seller wants to meet here</Popup>
        </Marker>
      )}

      {/* Conditionally renders MapClickHnadler function only on the create-listing page */}
      {location.pathname === "/create-listing" && <MapClickHandler />}

      {position && (
        <Marker position={position}>
          <Popup>You want to meet here</Popup>
        </Marker>
      )}
    </MapContainer>
  );
};

export default Map;
