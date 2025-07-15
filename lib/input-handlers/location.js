import { formatLocation, makePhotonRequest } from "../Photon.js";

export const locationInput = document.getElementById("location-input");
const suggestionsList = document.getElementById("suggestions");

export let isLocationSelectedFromDropdown = false;

locationInput.addEventListener("input", async () => {
    isLocationSelectedFromDropdown = false;

    const query = locationInput.value.trim();
    if (!query) {
        suggestionsList.innerHTML = "";
        return;
    }

    suggestionsList.innerHTML = "";
    suggestionsList.childNodes.forEach((node) => node.remove());

    const response = await makePhotonRequest(query);
    if ("error" in response) return;

    if (!response.features.length) {
        const noResult = document.createElement("li");

        noResult.textContent = "No PH locations found";
        suggestionsList.appendChild(noResult);

        return;
    }

    response.features.forEach((loc) => {
        const { properties: prop, geometry } = loc;
        if (prop.countrycode != "PH") return;

        const displayName = formatLocation(prop);
        const option = document.createElement("div")

        option.textContent = displayName;
        option.addEventListener("click", () => {
            localStorage.setItem("selectedLocation", `${displayName}|${[...geometry.coordinates].reverse()}`);

            locationInput.value = displayName;
            suggestionsList.innerHTML = "";
            isLocationSelectedFromDropdown = true;
        });

        suggestionsList.appendChild(option);
    })
});
