const startScanButton = document.getElementById('start-scan-button');
const video = document.getElementById('qr-video');
const canvas = document.getElementById('qr-canvas');
const context = canvas.getContext('2d');
const scannedImage = document.getElementById('scanned-image');
const modelContainer = document.getElementById('model-container');
const imageContainer = document.getElementById('image-container');
const scanner = document.getElementById('scanner');

// Start video feed when the button is clicked
startScanButton.addEventListener('click', () => {
    // Show the scanner and hide the button
    scanner.style.display = 'flex';
    startScanButton.style.display = 'none';

    navigator.mediaDevices.getUserMedia({ 
        video: { facingMode: { exact: "environment" } } // Use back camera
    }).then(stream => {
        video.srcObject = stream;

        setInterval(() => {
            canvas.width = video.videoWidth;
            canvas.height = video.videoHeight;
            context.drawImage(video, 0, 0, canvas.width, canvas.height);

            const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
            const code = jsQR(imageData.data, imageData.width, imageData.height);

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
    // Check if the URL points to an image or a 3D model (e.g., GLB file)
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
        // Handle invalid QR code data
        alert('Invalid QR code content');
    }
}
