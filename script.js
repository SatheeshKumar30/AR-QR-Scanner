// Get references to video, output area, and canvas for QR code scanning
const video = document.getElementById('video');
const output = document.getElementById('output');
const canvas = document.createElement('canvas');
const context = canvas.getContext('2d');

// Request camera access
navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
  .then((stream) => {
    video.srcObject = stream;
    video.setAttribute('playsinline', true);  // Ensures it works on iOS
    video.play();
    scanQRCode(); // Start scanning the QR code
  })
  .catch((err) => {
    console.error('Error accessing webcam: ', err);
    output.textContent = 'Error accessing camera!';
  });

// Function to scan QR code from the video stream
function scanQRCode() {
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  context.drawImage(video, 0, 0, canvas.width, canvas.height);
  const imageData = context.getImageData(0, 0, canvas.width, canvas.height);
  const code = jsQR(imageData.data, canvas.width, canvas.height);

  if (code) {
    displayQRContent(code.data);  // If QR code is found, display its content
  } else {
    requestAnimationFrame(scanQRCode); // Continue scanning if no QR code is found
  }
}

// Function to display the decoded QR code content
function displayQRContent(content) {
  output.innerHTML = '';  // Clear previous output
  
  // Check if the QR code content is an image URL or base64 data
  if (content.startsWith('http') || content.startsWith('data:image')) {
    const img = new Image();
    img.src = content;
    output.appendChild(img); // Display image if it's an image URL or base64 data
  } else {
    output.textContent = 'QR Code Data: ' + content; // Display plain text if it's not an image
  }
}
