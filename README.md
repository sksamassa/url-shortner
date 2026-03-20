# URL Shortener with Advanced Analytics

A production-ready URL shortening service with click analytics, QR code generation, and a REST API. Designed for efficient link management and campaign tracking.

## 🚀 Features

- **Shorten URLs** – Generate short, unique codes (6 characters) for any long URL.
- **Custom Aliases** – Optionally set your own memorable short code.
- **Click Analytics** – Track every visit with:
  - Geographic location (country, city)
  - Device type, OS, browser
  - Referrer source
  - UTM parameters (`utm_source`, `utm_medium`, `utm_campaign`, etc.)
- **QR Code Generation** – Instantly create a QR code for any shortened link. Customize color, size, and download as SVG, PNG, or JPEG.
- **REST API** – Programmatically create shortened URLs. Full API documentation available.
- **Responsive Web Interface** – Works seamlessly on desktop, tablet, and mobile.

## 🛠️ Technology Stack

- **Backend**: Python 3.11 + Flask
- **Database**: SQLite (development), PostgreSQL (production)
- **ORM**: SQLAlchemy
- **Frontend**: HTML5, CSS3, vanilla JavaScript
- **Libraries**: Chart.js (analytics graphs), QRCodeStyling.js (QR codes), user_agents (device parsing), requests (geo‑IP)
- **Deployment**: Vercel (with GitHub Actions CI/CD)

## 📦 Installation (Local Development)

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/url-shortener.git
   cd url-shortener

2. **Create a virtual environment and activate it**
   ```bash
   python3 -m venv venv
   source venv/bin/activate   # On Windows: venv\Scripts\activate
   ```

3. **Install dependencies**
   ```bash
   pip install -r requirements.txt
   ```

4. **Initialize the database**
   ```bash
   python
   >>> from main import app, db
   >>> with app.app_context():
   ...     db.create_all()
   >>> exit()
   ```

5. **Run the development server**
   ```bash
   python main.py
   ```
   The app will be available at `http://localhost:8080`.

## 🌐 Usage

### Web Interface
- Visit the homepage, enter a long URL, and click **Shorten**.
- The shortened link is displayed with a copy button, QR code, and a link to the analytics dashboard.
- Use the **Settings** button (⚙️) to set a custom alias or change QR code appearance.
- Click the **Share** button (🚀) to share the link on social networks.

### Analytics Dashboard
- Each shortened link has a dedicated analytics page (e.g., `/analytics/<short_code>`).
- See total clicks, clicks over time (bar chart), and a detailed log of every visitor.

### REST API
- **Endpoint**: `POST /shorten`
- **Content-Type**: `application/x-www-form-urlencoded`
- **Parameters**:
  - `url` (required) – the original URL to shorten.
  - `custom_alias` (optional) – a preferred short code.
- **Response** (success):
  ```json
  {
    "short_code": "abc123"
  }
  ```
- **Response** (error):
  ```json
  {
    "error": "Alias already exists"
  }
  ```

Example using `curl`:
```bash
curl -X POST https://your-domain.com/shorten -d "url=https://example.com/long-url" -d "custom_alias=my-link"
```

## 🚢 Deployment

The project is configured for deployment on **Vercel**. A `vercel.json` file and GitHub Actions workflow are included.

1. Push your code to a GitHub repository.
2. Connect the repository to Vercel.
3. Set the required environment variables (`DATABASE_URL`, etc.) in Vercel.
4. Every push to the `main` branch triggers an automatic deployment.

## 📄 License

This project is developed for OOO «Айти Технологии» as part of a bachelor's thesis. For internal use only.

---

**Live Demo**: [too-short.vercel.app](https://too-short.vercel.app)  
**Documentation**: See `/api` endpoint for API docs, and `/qr-generator` for the standalone QR code tool.