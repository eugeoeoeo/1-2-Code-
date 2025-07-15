/**
 * @typedef {"driving" | "walking" | "bicycling" |"transit"} TravelMode
 */

/**
 * @typedef {Object} IDistanceMatrixRequest
 * @property {string} origin
 * @property {string} destination
 * @property {number} arrivalTime
 * @property {TravelMode} travelMode
 */

/**
 * @typedef {Object} IDistanceMatrixValue
 * @property {string} text
 * @property {number} value
 */

/**
 * @typedef {Object} IDistanceMatrixElement
 * @property {IDistanceMatrixValue} distance
 * @property {IDistanceMatrixValue} duration
 * @property {IDistanceMatrixValue} [duration_in_traffic]
 * @property {string} status
 */

/**
 * @typedef {Object} IDistanceMatrixRow
 * @property {IDistanceMatrixElement[]} elements
 */

/**
 * @typedef {Object} IDistanceMatrixResponse
 * @property {string[]} destination_addresses
 * @property {string[]} origin_addresses
 * @property {IDistanceMatrixRow[]} rows
 * @property {string} status
 */

import config from "../config.js";

/**
 * @param {IDistanceMatrixRequest} request
 * @returns {Promise<IDistanceMatrixResponse>}
 */
export async function makeDistanceMatrixRequest(request) {
    const { origin, destination, travelMode, arrivalTime } = request;

    try {
        const response = (await (await fetch(`https://api.distancematrix.ai/maps/api/distancematrix/json?origins=${origin}&destinations=${destination}&mode=${travelMode}&arrival_time=${arrivalTime}&key=${config.DISTANCE_MATRIX_KEY}`)).json());

        return response;
    } catch (err) {
        console.error(err.message, err.stack);
        return {};
    }
}
