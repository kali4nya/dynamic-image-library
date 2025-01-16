from flask import Flask, request, render_template, redirect, url_for, send_from_directory
import os

app = Flask(__name__)

UPLOAD_FOLDER = './images'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.secret_key = 'supersecretkey'  # Needed for flash messages

os.makedirs(UPLOAD_FOLDER, exist_ok=True)

ALLOWED_EXTENSIONS = {'png', 'jpg', 'jpeg', 'gif', 'bmp', 'webp', 'mkv', 'mp4'}
def allowed_file(file):
    if file.filename.rsplit('.', 1)[1] in ALLOWED_EXTENSIONS:
        return True
    else:
        return False

# Route to render the HTML file
@app.route('/')
def index():
    return redirect(url_for('home'))  # Redirects to the 'home' route

# Route to the home page
@app.route('/home')
def home():
    return render_template('home.html')  # Renders home.html

# Route for the images page
@app.route('/images/<filename>')
def serve_image(filename):
    return send_from_directory(UPLOAD_FOLDER, filename)

@app.route('/images')
def images():
    image_files = os.listdir(UPLOAD_FOLDER)
    image_files.sort(reverse=True, key=lambda x: int(os.path.splitext(x)[0]) if x.split('.')[0].isdigit() else x)
    return render_template('images.html', images=image_files)

# Route for the upload page
@app.route('/upload', methods=['GET', 'POST'])
def upload():
    if request.method == 'POST':
        if 'file' not in request.files:
            return 'No file part', 400
        
        files = request.files.getlist('file')
        passed_files = []
        
        for file in files:
            if file.filename == '':
                continue  # Skip empty filenames

            if allowed_file(file):
                passed_files.append(file)  # Add valid file to the list
            else:
                # As soon as one invalid file is found, return 415 error
                return 'File extension not allowed', 415

        # If no files are added to passed_files (all invalid), return an error
        if not passed_files:
            return 'No valid files found', 415

        for file in passed_files:
            existing_files = os.listdir(app.config['UPLOAD_FOLDER'])
            next_id = max([int(f.split('.')[0]) for f in existing_files if f.split('.')[0].isdigit()], default=-1) + 1
            extension = file.filename.rsplit('.', 1)[-1].lower()
            filename = f"{next_id}.{extension}"
            file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))

        return 'Files successfully uploaded!', 200
    
    return render_template('upload.html')

#run
if __name__ == '__main__':
    app.run(host="0.0.0.0", port=5000, debug=True)