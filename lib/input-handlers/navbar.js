// Help Popup
const helpbtn = document.getElementById("helpbtn");
const helppopup = document.getElementById("help");
const closeHelpBtn = document.getElementById("closeHelpBtn");

helpbtn.addEventListener("click", () => {
    helppopup.style.display = helppopup.style.display === "none" ? "block" : "none";
});

closeHelpBtn.addEventListener("click", () => {
    helppopup.style.display = "none";
});

// About Us Popup
const aboutBtn = document.querySelector(".nav-links a:nth-child(2)");
const aboutPopup = document.getElementById("about");
const closeAboutBtn = document.getElementById("closeAboutBtn");

aboutBtn.addEventListener("click", () => {
    aboutPopup.style.display = "block";
});
closeAboutBtn.addEventListener("click", () => {
    aboutPopup.style.display = "none";
});

// Terms and Conditions Popup
const termsBtn = document.querySelector(".nav-links a:nth-child(3)");
const termsPopup = document.getElementById("terms");
const closeTermsBtn = document.getElementById("closeTermsBtn");

termsBtn.addEventListener("click", () => {
    termsPopup.style.display = "block";
});
closeTermsBtn.addEventListener("click", () => {
    termsPopup.style.display = "none";
});
