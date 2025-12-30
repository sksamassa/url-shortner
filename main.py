import os
import random
import string

from flask import Flask, jsonify, redirect, request, render_template

app = Flask(__name__, template_folder='templates', static_folder='static')

# In-memory dictionary to store the shortened URLs.
# For a production application, you should use a database.
url_mapping = {}

def generate_short_code(length=6):
    """Generates a random short code."""
    characters = string.ascii_letters + string.digits
    while True:
        short_code = "".join(random.choice(characters) for _ in range(length))
        if short_code not in url_mapping:
            return short_code

@app.route("/")
def index():
    return render_template('index.html')

@app.route("/shorten", methods=["POST"])
def shorten_url():
    original_url = request.form.get("url")
    if not original_url:
        return jsonify({"error": "URL is required"}), 400

    custom_alias = request.form.get("custom_alias")
    if custom_alias:
        if custom_alias in url_mapping:
            return jsonify({"error": "Alias already exists"}), 409
        short_code = custom_alias
    else:
        short_code = generate_short_code()

    url_mapping[short_code] = original_url
    shortened_url = "sksam/" + short_code
    return jsonify({"shortened_url": shortened_url, "short_code": short_code})

@app.route("/<short_code>")
def redirect_to_url(short_code):
    original_url = url_mapping.get(short_code)
    if original_url:
        return redirect(original_url)
    return "URL not found", 404

def main():
    app.run(host="0.0.0.0", port=int(os.environ.get('PORT', 8080)))

if __name__ == "__main__":
    main()