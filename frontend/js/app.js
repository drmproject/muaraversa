// Muaraversa Core Javascript

const APP_NAME = "Muaraversa";

const API_BASE_URL = "/api";

function showMessage(message) {
    console.log(`${APP_NAME}: ${message}`);
}

async function checkAPI() {
    try {
        const response = await fetch(`${API_BASE_URL}/health`);
        const result = await response.json();

        console.log("API Status:", result);
        return result;

    } catch (error) {
        console.error("API Connection Error:", error);
        return null;
    }
}

document.addEventListener(
    "DOMContentLoaded",
    () => {
        showMessage("Frontend initialized");
        checkAPI();

        const startBtn = document.getElementById("startBtn") || document.querySelector("button");
        if (startBtn) {
            startBtn.addEventListener("click", () => {
                window.location.href = "login.html";
            });
        }
    }
);
