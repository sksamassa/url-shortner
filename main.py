
import os
import random
import string
from datetime import datetime

import requests
from flask import Flask, jsonify, redirect, request, render_template
from flask_sqlalchemy import SQLAlchemy
from user_agents import parse

# --- App and Database Configuration ---

# Initialize Flask App using instance_relative_config.
# This tells the app to look for configuration and the database
# in a special "instance" folder, which is ideal for this purpose.
app = Flask(__name__, template_folder='templates', static_folder='static', instance_relative_config=True)

# Configure the database URI to be stored in the instance folder.
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///shortener.db'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

# Ensure the instance folder exists. Flask will not create it automatically.
db = SQLAlchemy(app)


# --- Database Models ---

class Url(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    original_url = db.Column(db.String(512), nullable=False)
    short_code = db.Column(db.String(6), unique=True, nullable=False)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


class Click(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    url_id = db.Column(db.Integer, db.ForeignKey('url.id'), nullable=False)
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)
    ip_address = db.Column(db.String(45))
    user_agent = db.Column(db.String(256))
    country = db.Column(db.String(100))
    city = db.Column(db.String(100))
    device_type = db.Column(db.String(50))
    os = db.Column(db.String(50))
    browser = db.Column(db.String(50))
    referrer = db.Column(db.String(512))
    utm_source = db.Column(db.String(100))
    utm_medium = db.Column(db.String(100))
    utm_campaign = db.Column(db.String(100))
    utm_term = db.Column(db.String(100))
    utm_content = db.Column(db.String(100))
    url = db.relationship('Url', backref=db.backref('clicks', lazy=True))


# --- Database Initialization and Route Definitions ---

# Use app.app_context() to ensure the app is fully configured.
with app.app_context():
    # We must make sure the instance path exists
    try:
        os.makedirs(app.instance_path)
    except OSError:
        pass
    db.create_all()


def generate_short_code(length=6):
    characters = string.ascii_letters + string.digits
    while True:
        short_code = "".join(random.choice(characters) for _ in range(length))
        if not Url.query.filter_by(short_code=short_code).first():
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
        if Url.query.filter_by(short_code=custom_alias).first():
            return jsonify({"error": "Alias already exists"}), 409
        short_code = custom_alias
    else:
        short_code = generate_short_code()

    new_url = Url(original_url=original_url, short_code=short_code)
    db.session.add(new_url)
    db.session.commit()

    # Return only the short_code. The client will construct the full URLs.
    return jsonify({"short_code": short_code})


@app.route("/sksam/<short_code>")
def redirect_to_url(short_code):
    url = Url.query.filter_by(short_code=short_code).first()
    if url:
        try:
            ip_address = request.remote_addr
            user_agent_string = request.headers.get('User-Agent')
            user_agent = parse(user_agent_string)
            referrer = request.referrer
            
            utm_source = request.args.get('utm_source')
            utm_medium = request.args.get('utm_medium')
            utm_campaign = request.args.get('utm_campaign')
            utm_term = request.args.get('utm_term')
            utm_content = request.args.get('utm_content')

            try:
                geo_data = requests.get(f'https://ipapi.co/{ip_address}/json/').json()
                country = geo_data.get('country_name')
                city = geo_data.get('city')
            except requests.exceptions.RequestException:
                country, city = None, None

            click = Click(
                url_id=url.id, ip_address=ip_address, user_agent=user_agent_string,
                country=country, city=city, device_type=user_agent.device.family,
                os=user_agent.os.family, browser=user_agent.browser.family, referrer=referrer,
                utm_source=utm_source, utm_medium=utm_medium, utm_campaign=utm_campaign,
                utm_term=utm_term, utm_content=utm_content
            )
            db.session.add(click)
            db.session.commit()
        except Exception as e:
            app.logger.error(f"Error logging click: {e}")

        return redirect(url.original_url)

    return "URL not found", 404


@app.route('/analytics/<short_code>')
def view_analytics(short_code):
    url = Url.query.filter_by(short_code=short_code).first()
    if not url:
        return "URL not found", 404

    total_clicks = len(url.clicks)
    clicks_by_date = {}
    for click in url.clicks:
        date = click.timestamp.date()
        clicks_by_date[date] = clicks_by_date.get(date, 0) + 1

    return render_template(
        'analytics.html',
        url=url,
        total_clicks=total_clicks,
        clicks_by_date=clicks_by_date,
        clicks_log=url.clicks
    )

@app.route('/api')
def api():
    return render_template('api.html')


@app.route('/qr-generator')
def qr_generator():
    return render_template('qr_generator.html')


# --- Main Execution ---

if __name__ == "__main__":
    app.run(host="0.0.0.0", port=int(os.environ.get('PORT', 8080)))
