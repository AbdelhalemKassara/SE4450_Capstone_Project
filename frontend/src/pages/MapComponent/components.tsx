import { useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { useMap } from 'react-leaflet';

import L from 'leaflet';
export const Legend = ({ getColor }) => {
    const map = useMap();
    const grades = [0, 250, 500, 1000, 1500, 2000, 2500, 3000];

    const legendContent = (
        <div className="info legend">
            <div>
                <strong>Legend</strong>
                {grades.map((grade, index) => (
                    <div key={index}>
                        <i style={{ backgroundColor: getColor(grades[index] + 1) }}></i> {grade}{''}
                        {grades[index + 1] ? `-${grades[index + 1]}` : '+'}
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
export const InfoControl = ({ currentProvince }) => {
    const map = useMap();
    const infoContent = (
        <div className='info'>
            <h4>Canadian's voted</h4>
            <div id="info-content">{Object.keys(currentProvince).length == 2 ? `${currentProvince?.name}: ${currentProvince?.count}` : 'Hover over a province'}</div>
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