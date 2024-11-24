const video = document.getElementById('qr-video');
const canvas = document.getElementById('qr-canvas');
const context = canvas.getContext('2d');
const modelContainer = document.getElementById('model-container');
const imageContainer = document.getElementById('image-container');
const scannedImage = document.getElementById('scanned-image');
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
        // Display image
        scannedImage.src = content;
        scannedImage.style.maxWidth = "100%";
        imageContainer.style.display = "block"; // Show the image container
        modelContainer.style.display = "none"; // Hide the 3D model container

    } else if (content.endsWith('.glb') || content.endsWith('.gltf')) {
        // Display 3D model in A-Frame
        imageContainer.style.display = "none"; // Hide the image container
        modelContainer.style.display = "block"; // Show the 3D model container
        const modelPlaceholder = document.getElementById('image-placeholder');
        modelPlaceholder.setAttribute('gltf-model', content);
        modelPlaceholder.setAttribute('scale', '1 1 1'); // Adjust size if needed
        modelPlaceholder.setAttribute('rotation', '0 45 0'); // Optional rotation
    } else {
        // Handle unsupported content types
        alert('Unsupported content type. Please scan a valid QR code');
    }
}
