const video = document.getElementById('video');
const qrImage = document.getElementById('qrImage');
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

// Request camera access
navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
  .then((stream) => {
    video.srcObject = stream;
    video.setAttribute('playsinline', true);  // Ensures it works on iOS
    video.play();
    scanQRCode(); // Start scanning QR codes
  })
  .catch((err) => {
    console.error('Error accessing webcam: ', err);
  });

// Function to scan QR code from the video feed
function scanQRCode() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const code = jsQR(imageData.data, canvas.width, canvas.height);

  if (code) {
    updateARContent(code.data);  // Update AR content with QR code data
  } else {
    requestAnimationFrame(scanQRCode); // Continue scanning
  }
}

// Function to update AR content based on the QR code data
function updateARContent(content) {
  // If QR code contains a URL or image base64, display it in AR
  if (content.startsWith('http') || content.startsWith('data:image')) {
    qrImage.setAttribute('src', content);  // Update AR image source
  } else {
    console.log("QR Code contains text: ", content);
  }
}
