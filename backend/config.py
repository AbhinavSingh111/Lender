import os
import json

SECRET_KEY = os.environ.get("SECRET_KEY", "your-secret-key")
# SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL", "sqlite:///lender.db")
SQLALCHEMY_DATABASE_URI = os.environ.get("DATABASE_URL", "postgresql+psycopg://neondb_owner:npg_LKe2ylkJI8YE@ep-tiny-darkness-a1bip3ci-pooler.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require")
SQLALCHEMY_TRACK_MODIFICATIONS = False
JWT_SECRET_KEY = os.environ.get("JWT_SECRET_KEY", "your-jwt-secret-key")
SMTP_SENDER_EMAIL = os.environ.get('SMTP_SENDER_EMAIL', 'shutupnbouncebaby@gmail.com')
SMTP_PASSWORD = os.environ.get('SMTP_PASSWORD', 'wkpt plbr zdvw xmfp')
SMTP_SERVER = os.environ.get('SMTP_SERVER', 'smtp.gmail.com')
SMTP_PORT = int(os.environ.get('SMTP_PORT', 587))

FRONTEND_URL = os.getenv("FRONTEND_URL", "https://lender-eight.vercel.app")

OAUTH2_CLIENT_ID = os.environ.get('OAUTH2_CLIENT_ID', '57198144557-0dhm107een1tmmf0v8btg73n89q1bs46.apps.googleusercontent.com')
OAUTH2_CLIENT_SECRET = os.environ.get('OAUTH2_CLIENT_SECRET', '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')
# GOOGLE_REDIRECT_URI = os.environ.get('GOOGLE_REDIRECT_URI', 'http://127.0.0.1:5000/google/callback')
GOOGLE_REDIRECT_URI = os.environ.get('GOOGLE_REDIRECT_URI', 'https://lender-92ui.onrender.com/google/callback')

# Google OAuth configuration
GOOGLE_CLIENT_SECRET_JSON = os.getenv("GOOGLE_CLIENT_SECRET_JSON")  # This will be set in your deployment platform
GOOGLE_CLIENT_SECRET_FILE = "client_secret.json"  # Path to write the file

if GOOGLE_CLIENT_SECRET_JSON and not os.path.exists(GOOGLE_CLIENT_SECRET_FILE):
    try:
        with open(GOOGLE_CLIENT_SECRET_FILE, "w") as f:
            json.dump(json.loads(GOOGLE_CLIENT_SECRET_JSON), f)
        print("✅ Google client_secret.json file written.")
    except Exception as e:
        print(f"❌ Error writing client_secret.json: {e}")