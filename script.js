const video = document.getElementById('qr-video');
const canvas = document.getElementById('qr-canvas');
const context = canvas.getContext('2d');

// Start video feed
navigator.mediaDevices.getUserMedia({
    video: { facingMode: "environment" } // Use the back camera
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
            handleQRCode(code.data); // Process QR code data
        }
    }, 500);
}).catch(error => {
    console.error("Error accessing camera:", error.message);
    alert("Could not access camera: " + error.message);
});

// Handle QR Code data
function handleQRCode(data) {
    if (data.endsWith('.glb') || data.endsWith('.gltf')) {
        display3DModel(data);
    } else if (data.endsWith('.png') || data.endsWith('.jpg') || data.endsWith('.jpeg')) {
        displayImage(data);
    } else {
        alert('Unsupported content type. Please scan a valid QR code.');
    }
}

// Display a 3D model in the AR scene
function display3DModel(modelUrl) {
    const modelPlaceholder = document.getElementById('model-placeholder');
    const imagePlaceholder = document.getElementById('image-placeholder');

    // Hide image placeholder
    imagePlaceholder.setAttribute('visible', 'false');

    // Display the 3D model
    modelPlaceholder.setAttribute('gltf-model', modelUrl);
    modelPlaceholder.setAttribute('scale', '1 1 1'); // Adjust size if needed
    modelPlaceholder.setAttribute('rotation', '0 45 0'); // Optional rotation
    modelPlaceholder.setAttribute('visible', 'true');
    document.getElementById('scanner').style.display = 'none'; // Hide scanner
}

// Display an image in the AR scene
function displayImage(imageUrl) {
    const modelPlaceholder = document.getElementById('model-placeholder');
    const imagePlaceholder = document.getElementById('image-placeholder');

    // Hide 3D model placeholder
    modelPlaceholder.setAttribute('visible', 'false');

    // Display the image
    imagePlaceholder.setAttribute('material', `src: ${imageUrl}`);
    imagePlaceholder.setAttribute('scale', '2 1 1'); // Adjust image size
    imagePlaceholder.setAttribute('visible', 'true');
    document.getElementById('scanner').style.display = 'none'; // Hide scanner
}
