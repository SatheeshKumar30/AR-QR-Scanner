const video = document.getElementById('qr-video');
const canvas = document.getElementById('qr-canvas');
const context = canvas.getContext('2d');
const modelContainer = document.getElementById('model-container');
const scanner = document.getElementById('scanner');
const imagePlaceholder = document.getElementById('image-placeholder');

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
        alert("Camera access error. Please check your camera and permissions.");
    });
});

// Display the content based on QR code URL
function displayContent(content) {
    console.log('QR Code Content:', content);  // Log the content of the QR code

    // Check if the URL points to an image (e.g., JPG, PNG)
    if (content.endsWith('.jpg') || content.endsWith('.png') || content.endsWith('.jpeg')) {
        // Display image in the virtual world
        imagePlaceholder.setAttribute('material', `src: ${content}`);
        modelContainer.style.display = "block"; // Show 3D model container
    } else {
        // Handle unsupported content types
        alert('Unsupported content type. Please scan a valid QR code');
    }
}
