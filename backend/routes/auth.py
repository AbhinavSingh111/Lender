from flask import Blueprint, request, jsonify, session, redirect, url_for
from models.models import db, User
from werkzeug.security import generate_password_hash, check_password_hash
from flask_jwt_extended import create_access_token
from google_auth_oauthlib.flow import Flow
from googleapiclient.discovery import build
import os
from routes.google_auth import create_backup
from googleapiclient.errors import HttpError
from config import GOOGLE_CLIENT_SECRET_FILE
from services.google_drive import create_backup_sheet
from google.oauth2.credentials import Credentials as GoogleCreds
from services.get_db_data import get_db_data


auth_bp = Blueprint('auth', __name__)

# CLIENT_SECRETS_FILE = 'client_secret.json'
SCOPES = [
    'openid',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/spreadsheets'
]

os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'


@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    if User.query.filter_by(email=email).first():
        return jsonify({"msg": "Email already registered"}), 400
    user = User(email=email, password_hash=generate_password_hash(password))
    db.session.add(user)
    db.session.commit()
    return jsonify({"msg": "User registered"}), 201


@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    email = data.get('email')
    password = data.get('password')
    user = User.query.filter_by(email=email).first()
    if not user or not check_password_hash(user.password_hash, password):
        return jsonify({"msg": "Invalid credentials"}), 401
    access_token = create_access_token(identity=str(user.id))
    return jsonify(access_token=access_token), 200


# ---------------------------
# Google OAuth - Login/Signup
# ---------------------------

@auth_bp.route('/auth/google/login')
def google_auth_login():
    flow = Flow.from_client_secrets_file(
        # CLIENT_SECRETS_FILE,
        GOOGLE_CLIENT_SECRET_FILE,
        scopes=SCOPES,
        redirect_uri=url_for('auth.google_auth_callback', _external=True)
    )
    authorization_url, state = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true',
        prompt='consent'
    )
    session['state'] = state
    return redirect(authorization_url)


def credentials_to_dict(credentials):
    return {
        'token': credentials.token,
        'refresh_token': credentials.refresh_token,
        'token_uri': credentials.token_uri,
        'client_id': credentials.client_id,
        'client_secret': credentials.client_secret,
        'scopes': credentials.scopes
    }

def sheet_exists(credentials, sheet_id):
    try:
        drive_service = build("drive", "v3", credentials=credentials)
        drive_service.files().get(fileId=sheet_id).execute()
        return True
    except HttpError as e:
        if e.resp.status == 404:
            return False
        raise

@auth_bp.route('/auth/google/callback')
def google_auth_callback():
    state = session.get('state')
    if not state:
        return jsonify({"msg": "Session state missing"}), 400

    flow = Flow.from_client_secrets_file(
        # CLIENT_SECRETS_FILE,
        GOOGLE_CLIENT_SECRET_FILE,
        scopes=SCOPES + ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/spreadsheets'],
        state=state,
        redirect_uri=url_for('auth.google_auth_callback', _external=True)
    )
    flow.fetch_token(authorization_response=request.url)
    credentials = flow.credentials

    # Get user info
    oauth2_service = build('oauth2', 'v2', credentials=credentials)
    user_info = oauth2_service.userinfo().get().execute()
    email = user_info['email']

    user = User.query.filter_by(email=email).first()
    if not user:
        dummy_password = generate_password_hash(os.urandom(12).hex())
        user = User(email=email, password_hash=dummy_password)

        db.session.add(user)
        db.session.commit()

    # Save credentials
    user.google_credentials = credentials_to_dict(credentials)

    # Create backup sheet if not already created


    creds_obj = GoogleCreds.from_authorized_user_info(user.google_credentials)
    if not user.google_sheet_id or not sheet_exists(creds_obj, user.google_sheet_id):
        headers, values = get_db_data(user)
        sheet_id = create_backup_sheet(creds_obj,headers=headers, data=values)
        user.google_sheet_id = sheet_id

    db.session.commit()

    access_token = create_access_token(identity=str(user.id))
    # frontend_url = "http://localhost:3000"
    frontend_url = os.getenv("FRONTEND_URL", "https://lender-eight.vercel.app")
    return redirect(f"{frontend_url}/google-login-success?token={access_token}")
