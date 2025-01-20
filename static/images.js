let mediaList = [];  // Store all images and videos
let currentIndex = 0;  // Track currently displayed media

function openImagePreview(mediaSrc, mediaId) {
    var modal = document.getElementById('image-modal');
    var modalImage = document.getElementById('full-image');
    var modalVideo = document.getElementById('full-video');
    var imageIdElement = document.getElementById('image-id');

    // Get all media elements from the gallery
    mediaList = Array.from(document.querySelectorAll('.gallery-image, .gallery-video'))
                     .map(media => media.getAttribute('src'));
    currentIndex = mediaList.indexOf(mediaSrc);  // Find the clicked media in the list

    // Show image or video depending on file type
    if (mediaSrc.match(/\.(png|jpg|jpeg|gif|webp|bmp)$/i)) {
        modalImage.src = mediaSrc;
        modalImage.style.display = "block";
        modalVideo.style.display = "none";
        modalVideo.src = ""; // Clear video source
    } else if (mediaSrc.match(/\.(mp4|webm)$/i)) {
        modalVideo.src = mediaSrc;
        modalVideo.style.display = "block";
        modalImage.style.display = "none";
        modalImage.src = ""; // Clear image source
    }

    // Set media filename as ID
    imageIdElement.textContent = "Media: " + mediaId.split('/')[mediaId.split('/').length - 1];

    // Show the modal
    modal.style.display = "flex";
}

function closeImagePreview() {
    var modal = document.getElementById('image-modal');
    var modalImage = document.getElementById('full-image');
    var modalVideo = document.getElementById('full-video');

    modal.style.display = "none";
    
    // Stop video playback when closing
    modalVideo.pause();
    modalVideo.src = "";
}

function changeMedia(direction) {
    currentIndex += direction;

    // Loop around if at the start or end
    if (currentIndex < 0) {
        currentIndex = mediaList.length - 1;
    } else if (currentIndex >= mediaList.length) {
        currentIndex = 0;
    }

    openImagePreview(mediaList[currentIndex], mediaList[currentIndex]);  // Load new media
}

// Keyboard support: Arrow keys to navigate, Esc to close
document.addEventListener("keydown", function(event) {
    if (document.getElementById('image-modal').style.display === "flex") {
        if (event.key === "ArrowLeft") {
            changeMedia(-1);  // Go to previous media
        } else if (event.key === "ArrowRight") {
            changeMedia(1);   // Go to next media
        } else if (event.key === "Escape") {
            closeImagePreview();  // Close modal
        }
    }
});

// Ensure modal is hidden when the page loads
document.addEventListener("DOMContentLoaded", function () {
    document.getElementById("image-modal").style.display = "none";
});


//fixing video formating in fullscreen
document.querySelector("video").addEventListener("fullscreenchange", function() {
    if (document.fullscreenElement) {
      this.style.objectFit = "contain";
    } else {
      this.style.objectFit = "";
    }
  });