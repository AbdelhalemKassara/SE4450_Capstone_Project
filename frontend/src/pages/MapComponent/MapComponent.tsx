import { useEffect, useState, useContext } from 'react';
import { datasetQuery } from "../../components/DatabaseContext";
import { red, amber, orange } from '@mui/material/colors';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { Legend, InfoControl } from './components';
import "./index.scss";
import 'leaflet/dist/leaflet.css'; // Make sure to import Leaflet CSS
import * as stringSimilarity from "string-similarity";
import { formatRidingData } from './helper.js'


const MapComponent = ({ mapData, mapType, setSelectedRiding }) => {
  const datasetQ = useContext(datasetQuery);

  const [currentHover, setCurrentHover] = useState({});
  const [selectedLayer, setSelectedLayer] = useState({})
  const [selectedStyle, setSelectedStyle] = useState({})
  const [heatValues, setHeatValues] = useState([])
  const [maxValue, setMaxValue] = useState({ province: 0, riding: 0 })
  const [provinceMapData, setProvinceMapData] = useState({})
  const [ridingMapData, setRidingMapData] = useState({})
  const multipliers = [0, 0.05, 0.1125, 0.225, 0.3, 0.4, 0.5, 0.6, 0.7, 0.85]

  useEffect(() => {
    if (mapData) {
      let maxProvinceCount = 0;
      let maxRidingCount = 0

      datasetQ.getJSONPolygonFile("province").then((polygon: any) => {
        const provinceCount = mapData.province ?? {};
        const geoData = { ...polygon };
        let updatedProvinceMapData = [...geoData.features];
        Object.entries(provinceCount).forEach(([key, value]) => {
          for (let i = 0; i < provinceMapData?.features.length; i++) {
            const provinceProperty = updatedProvinceMapData?.[i]?.properties;
            const similarity = stringSimilarity.compareTwoStrings(key, provinceProperty?.name);
            if (similarity >= 0.9) {
              maxProvinceCount = Math.max(maxProvinceCount, value)
              provinceProperty.density = value;
              break;
            }
          }
        })
        setProvinceMapData({ ...provinceMapData, features: [...updatedProvinceMapData] })
      });
      datasetQ.getJSONPolygonFile("riding").then((polygon: any) => {
        const ridingCount = mapData.riding ?? {};
        const geoData = { ...formatRidingData(polygon) };

        let updatedRidingMapData = [...geoData.features];
        Object.entries(ridingCount).forEach(([key, value]) => {
          for (let i = 0; i < ridingMapData.features.length; i++) {
            const elecProperties = updatedRidingMapData?.[i]?.properties;
            if (key && elecProperties?.feduid == key) {
              maxRidingCount = Math.max(maxRidingCount, value);
              elecProperties.density = value;
              break;
            }
          }
        })
        setRidingMapData({ ...ridingMapData, features: [...updatedRidingMapData] })
        setMaxValue({ ...maxValue, province: maxProvinceCount, riding: maxRidingCount })

      })
    };
  }, [mapData]);

  useEffect(() => {
    const multipliersMax = multipliers.map((val) => {
      return Math.ceil(val * maxValue[mapType])
    });
    setHeatValues(multipliersMax);
  }, [mapType, provinceMapData, ridingMapData])

  useEffect(() => {
    if (selectedLayer && selectedLayer.setStyle) {
      selectedLayer?.setStyle({ ...selectedStyle })
      selectedLayer?.bringToFront();
    }
  }, [selectedLayer])

  const style = (feature) => {
    const count = feature.properties.density;
    return {
      fillColor: getColor(count),
      weight: 2,
      opacity: 1,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7
    };
  }
  const getColor = (value) => {
    // You can customize this function based on your data
    return value > heatValues[9]
      ? red[900]
      : value > heatValues[8]
        ? red[800]
        : value > heatValues[7]
          ? red[700] :
          value > heatValues[6]
            ? orange[900]
            : value > heatValues[5]
              ? amber[900]
              : value > heatValues[4]
                ? amber[700]
                : value > heatValues[3]
                  ? amber[500]
                  : value > heatValues[2]
                    ? amber[300] :
                    value > heatValues[1] ?
                      amber[100]
                      : amber[50];
  };
  const highlightFeature = (e) => {
    const layer = e.target;
    const properties = layer?.feature?.properties ?? {};

    setSelectedLayer(layer)
    setSelectedStyle({
      weight: 3,
      color: '#AAAAAA',
      dashArray: '',
      fillOpacity: 0.7,
    })
    setCurrentHover({ name: properties?.name, count: properties?.density })
  };

  const resetHighlight = (e) => {
    const layer = e.target;
    setSelectedLayer(layer)
    setSelectedStyle({
      weight: 2,
      color: 'white',
      dashArray: '3',
      fillOpacity: 0.7,
    });
    setCurrentHover({})
  };
  const zoomToFeature = (e) => {
    const map = e.target._map;
    map.fitBounds(e.target.getBounds());
    if (mapType === 'riding') {
      setSelectedRiding(e.target.feature.properties.feduid ?? 0)
    }
  };
  const onEachFeature = (feature, layer) => {
    layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
    })
    // You can add event listeners or popups here if needed
    const popupContent = `<Popup>${feature.properties.name}</Popup>`;
    layer.bindPopup(popupContent);
  };

  return (
    Object.values(mapData?.province).length >= 1 ? (
      <div id='map_box'>
        <MapContainer center={[56.505, -92.09]} zoom={3} scrollWheelZoom={false}>
          <TileLayer
            attribution='<a href="https://www.jawg.io" target="_blank">© Jawg</a> | © OpenStreetMap contributors'
            url='https://tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token=bqE3ggBOk5o1bJSHS5niKahBnM7ubg2mdUHa13PP33GcCN5MJ1D254LcGz6x6W32'
          />
          <GeoJSON
            key={JSON.stringify(mapType === "province" ? provinceMapData : ridingMapData)}
            data={mapType === "province" ? provinceMapData : ridingMapData}
            style={style}
            onEachFeature={onEachFeature}
          />
          <Legend getColor={getColor} heatValues={heatValues} />
          <InfoControl currentHover={currentHover} mapType={mapType} />
        </MapContainer>
      </div>
    ) : (
      <div>Please Select Data</div>
    )
  );

};

export default MapComponent;
