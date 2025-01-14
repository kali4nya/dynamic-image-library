from flask import Flask, render_template, redirect, url_for

app = Flask(__name__)

# Route to render the HTML file
@app.route('/')
def index():
    return redirect(url_for('home'))  # Redirects to the 'home' route

# Route to the home page
@app.route('/home')
def home():
    return render_template('home.html')  # Renders home.html

# Route for the images page
@app.route('/images')
def images():
    return render_template('images.html')

# Route for the upload page
@app.route('/upload')
def upload():
    return render_template('upload.html')

# Run the Flask app
if __name__ == '__main__':
    app.run(debug=True)