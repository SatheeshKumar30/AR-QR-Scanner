const video = document.getElementById('qr-video');
const canvas = document.getElementById('qr-canvas');
const context = canvas.getContext('2d');
const arContainer = document.getElementById('ar-container');
const imagePlaceholder = document.getElementById('image-placeholder');

// Start the QR scanner as soon as the page loads
window.addEventListener('load', () => {
    // Show the scanner
    document.getElementById('scanner').style.display = 'flex';

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
    if (content.endsWith('.jpg') || content.endsWith('.jpeg') || content.endsWith('.png')) {
        // Display image in AR
        arContainer.style.display = "block"; // Show the AR container
        imagePlaceholder.setAttribute('geometry', 'primitive: plane; width: 4; height: 3');
        imagePlaceholder.setAttribute('material', 'src: url(' + content + ')');
        imagePlaceholder.setAttribute('scale', '1 1 1');
        imagePlaceholder.setAttribute('rotation', '0 45 0'); // Optional rotation
    } else {
        // Handle unsupported content types
        alert('Unsupported content type. Please scan a valid QR code');
    }
}
