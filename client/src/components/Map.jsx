//Import necessary libraries
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import { Marker, Popup } from "react-leaflet";
import { useMap } from "react-leaflet/hooks";

//Map component that will be in product page and create listing page
const Map = () => {
  return (
    <MapContainer
      //Defines properties of the map including the coordinates, the level of zoom on the map, and size
      center={[49.0283, -122.285]}
      zoom={17}
      scrollWheelZoom={false}
      style={{ height: "300px", width: "100%" }}
    >
      {/*Displays the map*/}
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {/*Reference marker for meetup*/}
      <Marker position={[49.0283, -122.285]}>
        {/*Notification above marker*/}
        <Popup>
          Seller wants to meet here. <br />
        </Popup>
      </Marker>
    </MapContainer>
  );
};

export default Map;
