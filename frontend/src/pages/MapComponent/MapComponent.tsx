import { useEffect, useContext, useState, useMemo } from 'react';
import { red, amber, orange } from '@mui/material/colors';
import { MapContainer, TileLayer, GeoJSON } from 'react-leaflet';
import { DatabaseContext } from "../../components/DatabaseContext";
import { Legend, InfoControl } from './components';
import "./index.scss";
import 'leaflet/dist/leaflet.css'; // Make sure to import Leaflet CSS
import province from './province.json'
import { electoralRidings, section } from './helper'

const MapComponent = () => {
  const database = useContext(DatabaseContext);
  const [dataset, setDataset] = useState<string>("2022-dataset.json"); //this(the hardcoding a valid dataset) is a janky fix for the IndVarDropDown where fetchting independent variables without a valid dataset throws an error
  const [depVar, setDepVar] = useState<string>("dc22_democratic_sat"); //dependent variable
  const [indVar, setIndVar] = useState<string>("dc22_age_in_years"); //demographic variable
  const [provinceCount, setProvinceCount] = useState({})
  const [currentProvince, setCurrentProvince] = useState({});
  const [selectedLayer, setSelectedLayer] = useState({})
  const [selectedStyle, setSelectedStyle] = useState({})
  const [ridingCount, setRidingCount] = useState({})
  const elec = { ...electoralRidings() };
  const provinceGeoData = { ...province }
  const [heatValues, setHeatValues] = useState([])
  const multipliers = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9]




  useEffect(() => {
    const fetchData = async () => {
      try {
        setProvinceCount(await database.getProvinceCount("2022-dataset.json", "dc22_province"))
        setRidingCount(await database.getRidingCount("2022-dataset.json"))

        Object.values(provinceCount).forEach((v) => {
          for (let i = 0; i < provinceGeoData?.features.length; i++) {
            const provinceProperty = provinceGeoData?.features?.[i]?.properties;
            if (v?.province_id && provinceProperty?.province_id == v?.province_id) {
              provinceProperty.density = v.total
            }
          }
        })
        let maxV = 0
        Object.entries(ridingCount).forEach(([key, value]) => {
          maxV = Math.max(maxV, value)
          for (let i = 0; i < elec.features.length; i++) {
            const elecProperties = elec?.features?.[i]?.properties;
            if (key && elecProperties?.feduid == key) {
              elecProperties.density = value
            }
          }
        })

        const multipliersMax = multipliers.map((val) => {
          return Math.ceil(val * maxV)
        });

        setHeatValues(multipliersMax);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
    fetchData();
  }, []);
  console.log(elec)

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
    return value > heatValues[8]
      ? red[900]
      : value > heatValues[7]
        ? red[800]
        : value > heatValues[6]
          ? red[700] :
          value > heatValues[5]
            ? orange[900]
            : value > heatValues[4]
              ? amber[900]
              : value > heatValues[3]
                ? amber[700]
                : value > heatValues[2]
                  ? amber[500]
                  : value > heatValues[1]
                    ? amber[300] :
                    value > heatValues[0] ?
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
    setCurrentProvince({ name: properties?.name, count: properties?.density })
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
    setCurrentProvince({})
  };
  const zoomToFeature = (e) => {
    const map = e.target._map;
    map.fitBounds(e.target.getBounds());
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
    <div id='map_box'>
      <MapContainer center={[56.505, -92.09]}
        zoom={4}
        scrollWheelZoom={false}
      >
        <TileLayer
          attribution='<a href="https://www.jawg.io" target="_blank">© Jawg</a> | © OpenStreetMap contributors'
          url='https://tile.jawg.io/jawg-light/{z}/{x}/{y}{r}.png?access-token=bqE3ggBOk5o1bJSHS5niKahBnM7ubg2mdUHa13PP33GcCN5MJ1D254LcGz6x6W32'
        />
        {provinceGeoData && (
          <GeoJSON
            data={elec}
            style={style}
            onEachFeature={onEachFeature}
          />
        )}
        <Legend getColor={getColor} heatValues={heatValues} />
        <InfoControl currentProvince={currentProvince} />


      </MapContainer>
    </div>
  );
};

export default MapComponent;
