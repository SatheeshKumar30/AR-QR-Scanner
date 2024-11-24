const video = document.getElementById('qr-video');
const canvas = document.getElementById('qr-canvas');
const context = canvas.getContext('2d');
const scannedImage = document.getElementById('scanned-image');
const modelContainer = document.getElementById('model-container');
const imageContainer = document.getElementById('image-container');
const scanner = document.getElementById('scanner');

// Start the QR scanner as soon as the page loads
window.addEventListener('load', () => {
    // Show the scanner
    scanner.style.display = 'flex';

    // Start the camera stream
    navigator.mediaDevices.getUserMedia({
        video: { facingMode: { exact: "environment" } } // Use back camera
    }).then(stream => {
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
            if (code) {
                console.log('QR Code detected:', code.data);
                displayContent(code.data); // Show content based on QR code URL
            }
        }, 500);
    }).catch(error => {
        console.error("Error accessing camera:", error);
    });
});

// Display the content based on QR code URL
function displayContent(content) {
    console.log('QR Code Content:', content);  // Log the content of the QR code

    // Check if the content is a valid URL and whether it points to an image or 3D model
    if (isValidUrl(content)) {
        if (content.endsWith('.jpg') || content.endsWith('.png')) {
            // Display image
            scannedImage.src = content;
            scannedImage.style.display = "block";
            imageContainer.style.display = "block";
            modelContainer.style.display = "none";
        } else if (content.endsWith('.glb') || content.endsWith('.gltf')) {
            // Display 3D model in A-Frame
            const modelPlaceholder = document.getElementById('model-placeholder');
            modelPlaceholder.setAttribute('gltf-model', content);
            modelPlaceholder.setAttribute('scale', '1 1 1'); // Adjust size if needed
            modelPlaceholder.setAttribute('rotation', '0 45 0'); // Optional rotation
            modelContainer.style.display = "block";
            imageContainer.style.display = "none";
        } else {
            alert('Unsupported content type. Please scan a valid QR code');
        }
    } else {
        alert('Invalid QR code URL');
    }
}

// Helper function to check if URL is valid
function isValidUrl(url) {
    try {
        new URL(url);  // Try to create a URL object to check if it's a valid URL
        return true;
    } catch (e) {
        return false;
    }
}
