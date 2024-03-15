import fed from './fed_compressed.json'

const electoralData = { ...fed }
export const section = {
    48: { name: 'Alberta', id: 1, type: "FeatureCollection", features: [] },
    59: { name: 'British Columbia', id: 2, type: "FeatureCollection", features: [] },
    46: { name: 'Manitoba', id: 3, type: "FeatureCollection", features: [] },
    13: { name: 'New Brunswick', id: 4, type: "FeatureCollection", features: [] },
    10: { name: 'Newfoundland and Labrador', id: 5, type: "FeatureCollection", features: [] },
    61: { name: 'Northwest Territories', id: 6, type: "FeatureCollection", features: [] },
    12: { name: 'Nova Scotia', id: 7, type: "FeatureCollection", features: [] },
    62: { name: 'Nunavut', id: 8, type: "FeatureCollection", features: [] },
    35: { name: 'Ontario', id: 9, type: "FeatureCollection", features: [] },
    11: { name: 'Prince Edward Island', id: 10, type: "FeatureCollection", features: [] },
    24: { name: 'Quebec', id: 11, type: "FeatureCollection", features: [] },
    47: { name: 'Saskatchewan', id: 12, type: "FeatureCollection", features: [] },
    60: { name: 'Yukon Territories', id: 13, type: "FeatureCollection", features: [] },
}

electoralData.features.forEach((curr) => {
    const formattedData = {
        type: curr.type,
        geometry: { ...curr.geometry },
        properties: {
            name: curr.properties.name,
            feduid: 0,
            density: 0
        }
    }
    const description = curr.properties.description;
    const indOfFed = description.indexOf('FEDNUM');
    const beg = indOfFed + 17;
    const end = indOfFed + 22
    const fedId = description.slice(beg, end);
    formattedData.properties.feduid = parseInt(fedId);
    section[fedId.slice(0, 2)].features.push(formattedData)

})

export const electoralRidings = () => {
    const ridings = { type: 'FeatureCollection', features: [] }
    let feat = []
    Object.values(section).forEach((val) => {
        feat = [...feat, ...val.features]
    })
    ridings.features = [...feat];
    return ridings
}