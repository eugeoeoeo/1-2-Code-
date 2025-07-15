/**
 * @typedef {Object} IPhotonGeometry
 * @property {"Point"} type - The geometry type (always "Point" for Photon)
 * @property {[number, number]} coordinates - [longitude, latitude]
 */

/**
 * @typedef {Object} IPhotonProperties
 * @property {string} [name] - Place or landmark name (e.g., "Kyōto")
 * @property {string} [street] - Street name (e.g., "Shio-koji dori")
 * @property {string} [locality] - Local area or neighborhood (e.g., "Higashishiokojicho")
 * @property {string} [district] - District or ward (e.g., "Shimogyo Ward")
 * @property {string} [city] - City (e.g., "Kyoto")
 * @property {string} [state] - State or region (e.g., "Kyoto Prefecture")
 * @property {string} [postcode] - Postal code (e.g., "600-8213")
 * @property {string} [country] - Country name (e.g., "Japan")
 * @property {string} [countrycode] - 2-letter ISO code (e.g., "JP")
 * @property {string} [osm_type] - OpenStreetMap element type (e.g., "N", "W", "R")
 * @property {number} [osm_id] - OSM ID
 * @property {string} [osm_key] - OSM key category (e.g., "railway")
 * @property {string} [osm_value] - OSM value (e.g., "station")
 * @property {string} [type] - Type of the feature (e.g., "house", "city", etc.)
 */

/**
 * @typedef {Object} IPhotonFeature
 * @property {"Feature"} type
 * @property {IPhotonGeometry} geometry
 * @property {IPhotonProperties} properties
 */

/**
 * @typedef {Object} IPhotonFeatureCollection
 * @property {"FeatureCollection"} type
 * @property {IPhotonFeature[]} features
 */

/**
 * @typedef {Object} IPhotonEmpty
 * @property {string} error 
 */

/**
 * @param {string} query
 * @returns {Promise<IPhotonFeatureCollection | IPhotonEmpty>}
 */
export async function makePhotonRequest(query) {
    try {
        /** @type {IPhotonFeatureCollection | IPhotonEmpty} */
        const response = await (await fetch(`https://photon.komoot.io/api/?q=${query}`)).json();
        if ("error" in response) return { error: response.error };

        return response;
    } catch (err) {
        return { error: err.message }
    }
}

/**
 * @param {IPhotonProperties} location
 * @returns {string}
 */
export function formatLocation({ name = "", street = "", locality = "", district = "", city = "", state = "", postcode = "", country = "" }) {
    let leading = true;
    const display = (prop) => prop ? `${leading ? (leading = false, "") : `,`} ${prop}` : "";

    return `${display(name)}${display(street)}${display(locality)}${display(district)}${display(city)}${display(state)}${display(postcode)}${display(country)}`;
}
