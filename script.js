const video = document.getElementById('qr-video');
const canvas = document.getElementById('qr-canvas');
const context = canvas.getContext('2d');

// Start video feed
navigator.mediaDevices.getUserMedia({
    video: {
        facingMode: { exact: "environment" } // Requests the back camera
    }
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
            displayInVR(code.data); // Use QR code data as the 3D model URL
        }
    }, 500);
}).catch(error => {
    console.error("Error accessing camera:", error);
});

function displayInVR(modelUrl) {
    const modelPlaceholder = document.getElementById('model-placeholder');
    modelPlaceholder.setAttribute('gltf-model', modelUrl);
    modelPlaceholder.setAttribute('scale', '1 1 1'); // Adjust size
    modelPlaceholder.setAttribute('rotation', '0 45 0'); // Optional rotation
}
