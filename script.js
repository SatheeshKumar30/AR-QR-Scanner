const video = document.getElementById("qr-video");
const canvas = document.getElementById("qr-canvas");
const context = canvas.getContext("2d");
const scanner = document.getElementById("scanner");
const arContainer = document.getElementById("ar-container");
const businessCard = document.getElementById("business-card");

// AR business card configuration
const VALID_QR_CONTENT = "https://example.com/ar-business-card"; // QR code must point to this URL
const TEXTURE_SRC = "https://yourbusinesscardimageurl.com/card-image.jpg"; // Replace with your texture

// Start the QR scanner
window.addEventListener("load", () => {
    // Show the scanner
    scanner.style.display = "flex";

    // Start the camera stream
    navigator.mediaDevices
        .getUserMedia({
            video: { facingMode: { exact: "environment" } }, // Back camera
        })
        .then((stream) => {
            video.srcObject = stream;

            // Start scanning at intervals
            setInterval(() => {
                canvas.width = video.videoWidth;
                canvas.height = video.videoHeight;
                context.drawImage(video, 0, 0, canvas.width, canvas.height);

                // Get image data and scan QR
                const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
                const code = jsQR(imageData.data, imageData.width, imageData.height);

                // If QR code is detected
                if (code && code.data === VALID_QR_CONTENT) {
                    console.log("QR Code detected:", code.data);
                    loadARBusinessCard();
                }
            }, 500);
        })
        .catch((error) => {
            console.error("Error accessing camera:", error);
            alert("Camera access error. Please check your permissions.");
        });
});

// Load AR business card
function loadARBusinessCard() {
    // Stop scanning
    scanner.style.display = "none";

    // Display AR container
    arContainer.style.display = "block";

    // Set business card texture
    businessCard.querySelector("a-plane").setAttribute("material", `src: url(${TEXTURE_SRC})`);
}
