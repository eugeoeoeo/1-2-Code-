export const dateInput = document.getElementById("date-input");
export const timeInput = document.getElementById("time-input");

dateInput.min = new Date().toISOString().split("T")[0];
