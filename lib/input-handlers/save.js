import alarm from "../Alarm.js";
import { makeDistanceMatrixRequest } from "../DistanceMatrix.js";
import { loadAllowances } from "./allowances.js";
import { dateInput, timeInput } from "./date-time.js";
import { isLocationSelectedFromDropdown, } from "./location.js";

import { UNIT_TABLE, updateAlarmDisplay } from "../utils.js";

const saveBtn = document.getElementById("save-btn");

updateAlarmDisplay();

// Save Alarm (No alerts, just block if invalid)
saveBtn.addEventListener("click", async () => {
    const date = dateInput.value;
    const time = timeInput.value;

    const allowances = loadAllowances();

    /** @type {[lat: number, lng: number]} type */
    const loc = localStorage.getItem("selectedLocation");

    if (!date || !time || !loc || !isLocationSelectedFromDropdown) {
        return; // Do nothing silently
    }

    const now = Date.now();
    const arrival = new Date(`${date}T${time}`).getTime();

    if (arrival <= now) {
        alert("Arrival date and time cannot be earlier than the current date and time!");

        return;
    }

    let gap = arrival;
    for (const { amount, unit } of allowances)
        gap -= amount * UNIT_TABLE[unit];

    const [name, strCoords] = loc.split("|");

    /** @type {[lat: number, lng: number]} */
    navigator.geolocation.getCurrentPosition(async ({ coords }) => {
        const response = await makeDistanceMatrixRequest({ origin: [coords.latitude, coords.longitude].toString(), destination: strCoords, arrivalTime: arrival, travelMode: "driving" });
        const duration = response.rows[0].elements[0].duration_in_traffic.value * 1_000;
        const alarmDateTime = arrival - duration - allowances.reduce((prev, v) => prev += v.amount * UNIT_TABLE[v.unit], 0);

        console.log(alarmDateTime, now);
        if (alarmDateTime <= now) {
            alert("Reaching the destination at the specified date and time of arrival with the allotted time allowance may not possible!");
            return;
        }

        alarm.update({ trigger: alarmDateTime, arrival, location: [name, strCoords] });

        updateAlarmDisplay();
    });

    localStorage.removeItem("selectedLocation");
});
