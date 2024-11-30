const video = document.getElementById('qr-video');
const canvas = document.getElementById('qr-canvas');
const context = canvas.getContext('2d');
const scanner = document.getElementById('scanner');
const arContainer = document.getElementById('ar-container');
const model = document.getElementById('model');

// Start the QR scanner as soon as the page loads
window.addEventListener('load', () => {
    // Show the scanner
    scanner.style.display = 'flex';

    // Start the camera stream
    navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'environment' } // Use back camera
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
                console.log('QR Code detected:', code.data);  // Log the content of the QR code
                handleQRCode(code.data); // Handle QR Code content
            }
        }, 500);
    }).catch(error => {
        console.error("Error accessing camera:", error);
    });
});

// Handle QR Code Content
function handleQRCode(content) {
    console.log("QR Code Content:", content); // Log the QR code content

    // Check if the content ends with .glb or .gltf for 3D models
    if (content.endsWith('.glb') || content.endsWith('.gltf')) {
        // Hide scanner and show AR container
        scanner.style.display = 'none';
        arContainer.style.display = 'block';

        // Set the 3D model URL to the A-Frame entity
        model.setAttribute('gltf-model', content);
        model.setAttribute('scale', '1 1 1');
        model.setAttribute('rotation', '0 45 0');
    } else {
        alert('Unsupported content type. Please scan a valid QR code.');
    }
}
