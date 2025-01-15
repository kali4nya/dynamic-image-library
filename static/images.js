function openImagePreview(imageSrc, imageId) {
    // Set the full image source
    var modalImage = document.getElementById('full-image');
    modalImage.src = imageSrc;

    // Set the image ID in the modal
    var imageIdElement = document.getElementById('image-id');
    imageIdElement.textContent = "Image ID:  " + imageId; // Display the filename as the image ID

    // Display the modal
    var modal = document.getElementById('image-modal');
    modal.style.display = "block";
}

function closeImagePreview() {
    // Close the modal
    var modal = document.getElementById('image-modal');
    modal.style.display = "none";
}