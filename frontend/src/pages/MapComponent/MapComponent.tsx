import { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { useLeafletContext } from '@react-leaflet/core'
import "./index.scss";
import 'leaflet/dist/leaflet.css'; // Make sure to import Leaflet CSS
import 'leaflet.heat';
import L from 'leaflet'

const HeatmapLayer = ({ points }) => {
  const map = useMap();

  // Sample data points
  const heatData = points.map(point => [point.lat, point.lng, point.intensity]);

  // Add heatmap layer to the map
  L.heatLayer(heatData, { radius: 50, gradient: {1: 'red'}, max: 5}).addTo(map);

  return null;
};

const MapComponent = () => {
  // Heatmap data
  const heatmapData = [
    { lat: 56.50, lng: -92.09, intensity: 100},
    // Add more data points here
  ];


  return (
    <div id='map_box'>
      <MapContainer center={[56.505, -92.09]}
        zoom={4}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='<a href="https://www.jawg.io" target="_blank">© Jawg</a> | © OpenStreetMap contributors'
          url='https://tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token=bqE3ggBOk5o1bJSHS5niKahBnM7ubg2mdUHa13PP33GcCN5MJ1D254LcGz6x6W32'
        />
        <HeatmapLayer points={heatmapData} />
      </MapContainer>
    </div>
  );
};


export default MapComponent;
