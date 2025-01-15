let dropArea = document.getElementById('drop-area');
let previewArea = document.getElementById('preview-area');
let previewAreaWraper = document.getElementById('preview-area-wraper');
let fileInput = document.getElementById('file-input');

// Prevent default behaviors for drag events
['dragenter', 'dragover', 'dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, preventDefaults, false);
});

function preventDefaults(e) {
    e.preventDefault();
    e.stopPropagation();
}

// Highlight drop area when file is dragged over it
['dragenter', 'dragover'].forEach(eventName => {
    dropArea.addEventListener(eventName, highlight, false);
});
['dragleave', 'drop'].forEach(eventName => {
    dropArea.addEventListener(eventName, unhighlight, false);
});

function highlight() {
    dropArea.classList.add('highlight');
}

function unhighlight() {
    dropArea.classList.remove('highlight');
}

// Handle files on drop
dropArea.addEventListener('drop', handleDrop, false);

// Handle files on click
dropArea.addEventListener('click', () => fileInput.click());

// Handle file input change
fileInput.addEventListener('change', (e) => {
    let files = e.target.files;
    handleFiles(files);
});

function handleDrop(e) {
    let dt = e.dataTransfer;
    let files = dt.files;
    handleFiles(files);
}

function handleFiles(files) {
    let formData = new FormData();
    previewArea.innerHTML = '';  // Clear previous previews

    const buttons = previewAreaWraper.querySelectorAll('button');
    buttons.forEach(button => button.remove());

    // Clear any previous error messages
    let existingError = document.getElementById('error-banner');
    if (existingError) {
        existingError.remove();
    }

    let passedFiles = [];
    let invalidFiles = false;

    // Validate files
    for (let file of files) {
        if (file.name === '') continue;

        if (allowedFile(file)) {
            formData.append('file', file);
            passedFiles.push(file);
        } else {
            invalidFiles = true;
            break;
        }
    }

    if (invalidFiles) {
        showMessageBanner("Unsupported file extension", "error");
        previewArea.innerHTML = '';
        return;
    }

    // Display previews
    passedFiles.forEach(file => {
        let reader = new FileReader();
        reader.onload = function (e) {
            let img = document.createElement('img');
            img.src = e.target.result;
            img.classList.add('preview-img');
            previewArea.appendChild(img);
        };
        reader.readAsDataURL(file);
    });

    // Show confirmation button
    if (passedFiles.length > 0) {
        let confirmButton = document.createElement('button');
        confirmButton.textContent = 'Yes, upload these files!';
        confirmButton.classList.add('confirm-upload-btn');
        previewAreaWraper.appendChild(confirmButton);

        confirmButton.addEventListener('click', function () {
            uploadFiles(formData);
        });
    } else {
        showMessageBanner("Unsupported file extension", "error");
    }
}

// Check if file is allowed based on its extension
function allowedFile(file) {
    const ALLOWED_EXTENSIONS = ['png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'mkv', 'mp4'];
    const fileExtension = file.name.split('.').pop().toLowerCase();
    return ALLOWED_EXTENSIONS.includes(fileExtension);
}

// Upload the files once confirmed
function uploadFiles(formData) {
    fetch('/upload', {
        method: 'POST',
        body: formData
    })
    .then(response => {
        if (response.status === 415) {
            showMessageBanner("Unsupported file extension", "error");
            throw new Error('File extension not allowed (415)');
        }
        return response.text();
    })
    .then(data => {
        showMessageBanner("Files successfully uploaded :3", "success");

        // Redirect to the 'images' route after successful upload
        window.location.href = imagesUrl;  // Use the imagesUrl variable for redirection
    })
    .catch(error => console.error(error));
}

function showMessageBanner(message, type) {
    let messageBanner = document.getElementById('message-banner');
    
    // Update the banner text
    messageBanner.textContent = message;
    
    // Set the banner style based on the type (error or success)
    messageBanner.className = type;  // 'error' or 'success' class will set the background color
    
    // Make the banner visible by adding the 'visible' class (trigger fade-in and slide-in)
    messageBanner.classList.add('visible');
    
    // Make the banner visible in the layout (initially it's hidden)
    messageBanner.style.display = 'block';

    // Set a timeout to hide the banner after 3 seconds (3000 milliseconds)
    setTimeout(() => {
        // Trigger the fade-out and slide-down transition by adding the 'hidden' class
        messageBanner.classList.add('hidden');
    }, 3000);  // Adjust the time (in milliseconds) as needed

    // Remove the 'hidden' class after the transition ends to reset the opacity and prepare it for future use
    messageBanner.addEventListener('transitionend', () => {
        // After the disappearance transition, hide the banner and reset its state
        if (messageBanner.classList.contains('hidden')) {
            messageBanner.style.display = 'none';  // Finally hide the banner
            messageBanner.classList.remove('hidden');  // Remove the 'hidden' class for future use
            messageBanner.classList.remove('visible'); // Remove the 'visible' class to reset the element
        }
    });
}