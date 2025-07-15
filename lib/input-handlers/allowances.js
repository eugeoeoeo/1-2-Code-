import alarm from "../Alarm.js";
import { UNIT_TABLE, clamp, formatMs, updateAlarmDisplay } from "../utils.js";
import { locationInput } from "./location.js";

const allowancesMainLabel = document.getElementById("allowances-label");
const allowances = document.getElementById("allowances");
const allowanceInput = document.getElementById("new-allowance");

renderAllowances();


allowanceInput.addEventListener("input", (e) => {
    e.preventDefault();

    clampValue(e.target);
})

/** @type {HTMLSelectElement} */
const allowanceType = document.getElementById("new-allowance-type");
const types = [["min", "Minute(s)"], ["hr", "Hour(s)"]];

for (const [id, val] of types) {
    const option = document.createElement("option");

    option.id = id;
    option.text = val;

    allowanceType.appendChild(option);
}

allowanceType.addEventListener("input", () => {
    clampValue(allowanceInput);
})

/** @type {HTMLInputElement} */
const allowanceLabel = document.getElementById("new-allowance-label");
const addBtn = document.getElementById("new-allowance-add");

addBtn.addEventListener("click", () => {
    const [id] = types[allowanceType.selectedIndex];
    const value = Number(allowanceInput.value);

    createAllowance(value, id, allowanceLabel.value);
    renderAllowances();

    allowanceInput.value = "";
    allowanceLabel.value = "";
});

function getAllowanceType() {
    return types[allowanceType.selectedIndex][0];
}

/**
 * @param {HTMLInputElement} input
 */
function clampValue(input) {
    if (input.value.length) input.value = clamp(Number(input.value), 1, (getAllowanceType() == "min" ? 120 : 24));
}

export function renderAllowances() {
    const saved = loadAllowances();

    allowancesMainLabel.textContent = `Time Allowances: [Total Allotted: ${formatMs(saved.reduce((prev, v) => prev += v.amount * (UNIT_TABLE[v.unit]), 0))}]`

    allowances.replaceChildren();

    saved.forEach((allowance, i) => {
        const allowanceDiv = document.createElement("div");

        const removeAllowanceBtn = document.createElement("button");

        removeAllowanceBtn.classList.add("remove-allowance");
        removeAllowanceBtn.textContent = "X";

        removeAllowanceBtn.addEventListener("click", () => {
            const data = alarm.data;
            alarm.update({ trigger: data.trigger + (allowance.amount * UNIT_TABLE[allowance.unit]) })

            updateAlarmDisplay();

            saveAllowances(saved.filter((_, j) => i != j));
            renderAllowances();
        });

        allowanceDiv.appendChild(removeAllowanceBtn);

        const allowanceText = document.createElement("span");
        allowanceText.innerHTML = `${allowance.label} - ${allowance.amount} ${allowance.unit}`;

        allowanceDiv.appendChild(allowanceText);
        allowances.appendChild(allowanceDiv);
    });
}

/** @returns {{amount: number, unit: string, label: string}[]} */
export function loadAllowances() {
    const saved = localStorage.getItem("allowances");
    return saved ? JSON.parse(saved) : [];
}

/** @param {{amount: number, unit: string, label: string}[]} allowances */
function saveAllowances(allowances) {
    localStorage.setItem("allowances", JSON.stringify(allowances));
}

export function resetAllowances() {
    saveAllowances([]);
}

/**
 * @param {number} amount
 * @param {string} unit
 * @param {string} label
 */
function createAllowance(amount, unit, label) {
    const data = alarm.data;
    const allowances = loadAllowances();

    if (data.trigger) {
        let gap = data.trigger;
        for (const allowance of allowances)
            gap -= allowance.amount * UNIT_TABLE[allowance.unit];

        console.log(gap);

        if (gap <= 0) {
            alert("Too much allowance provided. You will not have time to rest");
            return;
        }

        const newlyAllocated = amount * UNIT_TABLE[unit];
        alarm.update({ trigger: data.trigger - newlyAllocated });
    }

    allowances.push({ amount, unit, label });
    saveAllowances(allowances);

    updateAlarmDisplay();
}
