import { useRef, useEffect } from 'react';
import { MapContainer, TileLayer, useMap } from 'react-leaflet';
import { useLeafletContext } from '@react-leaflet/core'
import "./index.scss";
import 'leaflet/dist/leaflet.css'; // Make sure to import Leaflet CSS
import L from 'leaflet'
import province from './province.json'

const HeatmapLayer = ({ }) => {
  const map = useMap();
  const style = (feature) =>{
    return {
      fillColor: getColor(feature.properties.density),
      weight: 2,
      opacity: 0.5,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.5
    };
  }
  const getColor = (d) => {
    return d > 1000 ? '#800026' :
           d > 500  ? '#BD0026' :
           d > 200  ? '#E31A1C' :
           d > 100  ? '#FC4E2A' :
           d > 50   ? '#FD8D3C' :
           d > 20   ? '#FEB24C' :
           d > 10   ? '#FED976' :
                      '#FFEDA0';
}
  // Sample data points

  // Add heatmap layer to the map
  L.geoJSON(province, {style: style}).addTo(map);

  return null;
};

const MapComponent = () => {
  // Heatmap data
  const heatmapData = [
    { lat: 56.50, lng: -92.09, intensity: 100 },
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
        <HeatmapLayer />
      </MapContainer>
    </div>
  );
};


export default MapComponent;
