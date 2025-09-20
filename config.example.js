// Google OAuth 2.0 Configuration Example
// انسخ هذا الملف إلى config.js وأدخل القيم الحقيقية

window.GOOGLE_CONFIG = {
    web: {
        client_id: "YOUR_GOOGLE_CLIENT_ID_HERE",
        project_id: "YOUR_GOOGLE_PROJECT_ID_HERE",
        auth_uri: "https://accounts.google.com/o/oauth2/auth",
        token_uri: "https://oauth2.googleapis.com/token",
        auth_provider_x509_cert_url: "https://www.googleapis.com/oauth2/v1/certs",
        client_secret: "YOUR_GOOGLE_CLIENT_SECRET_HERE",
        redirect_uris: [
            "http://localhost:8000/oauth2callback.html",
            "https://your-domain.vercel.app/oauth2callback.html"
        ],
        javascript_origins: [
            "http://localhost:8000",
            "https://your-domain.vercel.app"
        ]
    }
};