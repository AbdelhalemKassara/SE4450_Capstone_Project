import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { useMap } from 'react-leaflet';

import L from 'leaflet';
export const Legend = ({ getColor, heatValues }) => {
    const map = useMap();

    const legendContent = (
        <div className="info legend">
            <div>
                <strong>Legend</strong>
                {heatValues.map((heat, index) => (
                    <div key={index}>
                        <i style={{ backgroundColor: getColor(heatValues[index] + 1) }}></i> {heat}{''}
                        {heatValues[index + 1] ? `-${heatValues[index + 1]}` : '+'}
                    </div>
                ))}
            </div>
        </div>
    );

    useEffect(() => {
        const legendControl = L.control({ position: 'bottomright' });

        legendControl.onAdd = () => {
            const div = L.DomUtil.create('div', '');
            const root = createRoot(div)
            root.render(legendContent)
            return div;
        };

        legendControl.addTo(map);

        // Clean up the legend when component unmounts
        return () => {
            legendControl.remove();
        };
    }, [map, legendContent]);

    return null; // No need to render anything directly
}
export const InfoControl = ({ currentHover, mapType }) => {
    const map = useMap();
    const infoContent = (
        <div className='info'>
            <h4>Canadian's voted</h4>
            <div id="info-content">{Object.keys(currentHover).length == 2 ? `${currentHover?.name}: ${currentHover?.count}` : `Hover over a ${mapType}`}</div>
        </div>
    )

    useEffect(() => {
        const infoControl = L.control();

        infoControl.onAdd = () => {
            const div = L.DomUtil.create('div', ''); // Create a div with class 'info'
            const root = createRoot(div)
            root.render(infoContent)
            return div;
        };

        // Add the info control to the map
        infoControl.addTo(map);

        // Clean up the info control when component unmounts
        return () => {
            infoControl.remove();
        };
    }, [map, infoContent]);

    return null; // No need to render anything directly
}