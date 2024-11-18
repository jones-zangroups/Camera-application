


// document.addEventListener('DOMContentLoaded', () => {
//   const video = document.getElementById('video');
//   const captureButton = document.getElementById('captureButton');
//   const viewImagesButton = document.getElementById('viewImagesButton');
//   const canvas = document.getElementById('canvas');
//   const modal = document.getElementById('imageModal');
//   const saveButton = document.getElementById('saveImage');
//   const retakeButton = document.getElementById('retakeImage');
//   const modalImage = document.getElementById('modalImage');

//   // Access the user's camera
//   if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
//     navigator.mediaDevices.getUserMedia({ video: true })
//       .then((stream) => {
//         video.srcObject = stream;
//         video.play();
//       })
//       .catch((error) => {
//         console.error('Error accessing the camera:', error);
//       });
//   } else {
//     alert('Your browser does not support camera access.');
//   }

//   // Detect if the page was refreshed
//   if (performance.navigation.type === 1) {  // Page refresh detected
//     // On refresh, clear localStorage
//     localStorage.removeItem('capturedImages');
//   }

//   // Capture the photo
//   captureButton.addEventListener('click', () => {
//     if (video.srcObject) {
//       const context = canvas.getContext('2d');
//       canvas.width = video.videoWidth;
//       canvas.height = video.videoHeight;
//       context.drawImage(video, 0, 0, canvas.width, canvas.height);

//       // Convert the canvas to a base64 encoded image
//       const imageData = canvas.toDataURL('image/png');
//       sessionStorage.setItem('capturedImage', imageData);

//       // Show the image in the modal
//       modalImage.src = imageData;
//       modal.style.display = 'block';
//     } else {
//       alert('Camera not initialized. Please check camera permissions.');
//     }
//   });

//   // Save the photo
//   saveButton.addEventListener('click', () => {
//     const imageData = sessionStorage.getItem('capturedImage');

//     if (imageData) {
//       // Retrieve existing images from localStorage (if any), or create an empty array
//       let images = JSON.parse(localStorage.getItem('capturedImages')) || [];
//       images.push(imageData);  // Add the new image to the array
//       localStorage.setItem('capturedImages', JSON.stringify(images));  // Save back to localStorage
//     }
//     modal.style.display = 'none';
//   });

//   // Retake the photo
//   retakeButton.addEventListener('click', () => {
//     // Hide the modal and clear the captured image in sessionStorage
//     modal.style.display = 'none';
//     sessionStorage.removeItem('capturedImage');
//   });

//   // View images functionality
//   viewImagesButton.addEventListener('click', () => {
//     // Retrieve the captured images from localStorage instead of sessionStorage
//     const images = JSON.parse(localStorage.getItem('capturedImages')) || [];

//     if (images.length > 0) {
//       // Redirect to display page if images are saved in localStorage
//       window.location.href = 'display.html';
//     } else {
//       alert('No image captured yet. Please take a photo first.');
//     }
//   });
// });












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
