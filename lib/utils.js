import alarm from "./Alarm.js";

export const UNIT_TABLE = {
    min: 60 * 1_000,
    hr: (60 * 60) * 1_000,
}

/**
 * @param {number} val
 * @param {number} min
 * @param {number} max
 */
export function clamp(val, min, max) {
    return val < min ? min : val > max ? max : val;
}

/**
 * @param {number} ms
 */
export function formatMs(ms) {
    const seconds = Math.floor(ms / 1000) % 60;
    const minutes = Math.floor(ms / (1000 * 60)) % 60;
    const hours = Math.floor(ms / (1000 * 60 * 60)) % 24;
    const days = Math.floor(ms / (1000 * 60 * 60 * 24));

    const parts = [];
    if (days) parts.push(`${days}d`);
    if (hours) parts.push(`${hours}h`);
    if (minutes) parts.push(`${minutes}m`);
    if (seconds || parts.length === 0) parts.push(`${seconds}s`);

    return parts.join(' ');
}

export function updateAlarmDisplay() {
    const data = alarm.data
    const savedAlarm = document.getElementById("saved-alarm");

    savedAlarm.innerHTML = `
            <strong>Ongoing Alarm:</strong><br>
            Alarm: ${new Date(data.trigger)}<br>
            Arrival: ${new Date(data.arrival)}<br>
            Destination: ${data.location?.[0] ?? "N/A"}
        `;
}
