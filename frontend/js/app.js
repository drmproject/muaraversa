// Muaraversa Core Javascript

const APP_NAME = "Muaraversa";

function showMessage(message) {
    console.log(`${APP_NAME}: ${message}`);
}

async function checkAPI() {

    try {

        const response = await fetch(
            "../backend/worker.js"
        );

        const result = await response.text();

        console.log(result);

    } catch(error) {

        console.error(
            "API Connection Error:",
            error
        );

    }

}


document.addEventListener(
    "DOMContentLoaded",
    () => {

        showMessage(
            "Frontend initialized"
        );

    }
);
