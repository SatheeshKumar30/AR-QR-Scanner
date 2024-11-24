// Get references to video, canvas, and the AR image
const video = document.getElementById('video');
const canvas = document.getElementById('canvas');
const context = canvas.getContext('2d');
const arImage = document.getElementById('arImage');

// Set up video stream for QR code scanning
navigator.mediaDevices.getUserMedia({ video: true })
  .then((stream) => {
    video.srcObject = stream;
    video.setAttribute('playsinline', true);
    video.play();
    scanQRCode();  // Start scanning for QR code
  })
  .catch((err) => {
    console.error("Error accessing webcam: ", err);
  });

// Function to scan QR code using the video stream
function scanQRCode() {
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const code = jsQR(imageData.data, canvas.width, canvas.height);

  if (code) {
    const qrContent = code.data;
    // Handle QR content (we expect it to be an image URL or base64 data)
    loadImageIntoAR(qrContent);
  } else {
    requestAnimationFrame(scanQRCode);  // Continue scanning
  }
}

// Function to load the image into the AR world
function loadImageIntoAR(qrContent) {
  const imageUrl = qrContent;  // The QR content should be the image URL or base64 data
  arImage.setAttribute('src', imageUrl);  // Set the image source in AR
}
