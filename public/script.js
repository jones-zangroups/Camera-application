//script.js
document.addEventListener('DOMContentLoaded', () => {
  const video = document.getElementById('video');
  const captureButton = document.getElementById('captureButton');
  const viewImagesButton = document.getElementById('viewImagesButton');
  const canvas = document.getElementById('canvas');
  const modal = document.getElementById('imageModal');
  const saveButton = document.getElementById('saveImage');
  const retakeButton = document.getElementById('retakeImage');
  const modalImage = document.getElementById('modalImage');

  // Access the user's camera
  if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
   
    navigator.mediaDevices.getUserMedia({ video: true })
      .then((stream) => {
        video.srcObject = stream;
        video.play();
      })
      .catch((error) => {
        console.error('Error accessing the camera:', error);
      });
  } else {
    alert('Your browser does not support camera access.');
  }

  // Capture the photo
  captureButton.addEventListener('click', () => {
    if (video.srcObject) {
      const context = canvas.getContext('2d');
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      context.drawImage(video, 0, 0, canvas.width, canvas.height);

      // Show the modal with the captured image
      const imageData = canvas.toDataURL('image/png');
      modalImage.src = imageData;
      modal.style.display = 'block';
    } else {
      alert('Camera not initialized. Please check camera permissions.');
    }
  });

  // Save the image to the database
  saveButton.addEventListener('click', () => {
    const imageData = modalImage.src;

    // Convert base64 to a Blob
    fetch(imageData)
      .then(res => res.blob())
      .then(blob => {
        const formData = new FormData();
        formData.append('image', blob, 'captured.png');

        // Send image to the server
        fetch('http://localhost:3000/upload', {
          method: 'POST',
          body: formData,
        })
        .then(response => response.json())
        .then(data => {
          //alert('Image saved successfully!');
          modal.style.display = 'none';
        })
        .catch(error => {
          alert('Failed to save image');
          console.error(error);
        });
      });
  });

  // Retake the image
  retakeButton.addEventListener('click', () => {
    modal.style.display = 'none';
  });

  // View images from the database
  viewImagesButton.addEventListener('click', () => {
    window.location.href = 'display.html';
  });
});
