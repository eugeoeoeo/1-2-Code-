/**
 * @typedef {Object} AlarmData
 * @property {number} trigger
 * @property {number} arrival
 * @property {[name: string, coords: string]} location
 */

class Alarm {
    /**
     * @returns {AlarmData}
     */
    get data() {
        const data = localStorage.getItem("alarm");

        return data ? JSON.parse(data) : {};
    }

    /**
     * @param {Partial<AlarmData>} data
     */
    update(data) {
        const curr = this.data;

        localStorage.setItem("alarm", JSON.stringify({ ...curr, ...data }));
    }

}

const alarm = new Alarm();

export default alarm;
