# from flask import Blueprint, redirect, request, session, url_for, jsonify
# from google_auth_oauthlib.flow import Flow
# from google.oauth2.credentials import Credentials
# from googleapiclient.discovery import build
# from models.models import db, User
# from services.google_drive import create_backup_sheet
# from flask_jwt_extended import jwt_required, get_jwt_identity
# import os
# import requests
# from google.auth.transport.requests import Request

# google_bp = Blueprint('google_bp', __name__)
# os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

# CLIENT_SECRETS_FILE = 'client_secret.json'
# SCOPES = ['https://www.googleapis.com/auth/drive.file', 'https://www.googleapis.com/auth/spreadsheets']

# @google_bp.route('/google/login')
# @jwt_required()
# def google_login():
#     flow = Flow.from_client_secrets_file(
#         CLIENT_SECRETS_FILE,
#         scopes=SCOPES,
#         redirect_uri=url_for('google_bp.google_callback', _external=True)
#     )
#     authorization_url, state = flow.authorization_url(
#         access_type='offline',
#         include_granted_scopes='true',
#         prompt='consent'
#     )
#     session['state'] = state
#     return redirect(authorization_url)


# @google_bp.route('/google/callback')
# @jwt_required()
# def google_callback():
#     user_id = get_jwt_identity()
#     user = User.query.get(user_id)

#     if not user:
#         return jsonify({"msg": "User not found"}), 404

#     state = session.get('state')
#     if not state:
#         return jsonify({"msg": "State missing in session"}), 400

#     flow = Flow.from_client_secrets_file(
#         CLIENT_SECRETS_FILE,
#         scopes=SCOPES,
#         state=state,
#         redirect_uri=url_for('google_bp.google_callback', _external=True)
#     )
#     flow.fetch_token(authorization_response=request.url)

#     credentials = flow.credentials
#     user.google_credentials = credentials_to_dict(credentials)
#     db.session.commit()

#     return redirect('/')  # Or your frontend success page


# @google_bp.route('/google/create-backup', methods=['POST'])
# @jwt_required()
# def create_backup():
#     user_id = get_jwt_identity()
#     user = User.query.get(user_id)

#     if not user:
#         return jsonify({"msg": "User not found"}), 404

#     if not user.google_credentials:
#         return jsonify({"msg": "Google not authorized"}), 401

#     credentials = Credentials.from_authorized_user_info(user.google_credentials)

#     # Refresh token if expired
#     if credentials.expired and credentials.refresh_token:
#         credentials.refresh(requests.Request())
#         user.google_credentials = credentials_to_dict(credentials)
#         db.session.commit()

#     if user.google_sheet_id:
#         return jsonify({"msg": "Backup already exists", "sheet_id": user.google_sheet_id}), 200

#     sheet_id = create_backup_sheet(credentials)
#     user.google_sheet_id = sheet_id
#     db.session.commit()

#     return jsonify({"msg": "Backup sheet created", "sheet_id": sheet_id}), 201


# def credentials_to_dict(credentials):
#     return {
#         'token': credentials.token,
#         'refresh_token': credentials.refresh_token,
#         'token_uri': credentials.token_uri,
#         'client_id': credentials.client_id,
#         'client_secret': credentials.client_secret,
#         'scopes': credentials.scopes
#     }

from flask import Blueprint, redirect, request, session, url_for, jsonify
from google_auth_oauthlib.flow import Flow
from google.oauth2.credentials import Credentials
from googleapiclient.discovery import build
from models.models import db, User, Lending, Borrower, Repayment  # Add other models if needed
from services.google_drive import create_backup_sheet
from flask_jwt_extended import jwt_required, get_jwt_identity
import os
import requests
from google.auth.transport.requests import Request
import logging
from googleapiclient.errors import HttpError
from config import GOOGLE_CLIENT_SECRET_FILE

google_bp = Blueprint('google_bp', __name__)
os.environ['OAUTHLIB_INSECURE_TRANSPORT'] = '1'

# CLIENT_SECRETS_FILE = 'client_secret.json'
SCOPES = [
    'https://www.googleapis.com/auth/drive.file',
    'https://www.googleapis.com/auth/spreadsheets',
    'https://www.googleapis.com/auth/userinfo.email',
    'https://www.googleapis.com/auth/userinfo.profile',
    'openid'
]

@google_bp.route('/google/login')
@jwt_required()
def google_login():
    flow = Flow.from_client_secrets_file(
        # CLIENT_SECRETS_FILE,
        GOOGLE_CLIENT_SECRET_FILE,
        scopes=SCOPES,
        redirect_uri=url_for('google_bp.google_callback', _external=True)
    )
    authorization_url, state = flow.authorization_url(
        access_type='offline',
        include_granted_scopes='true',
        prompt='consent'
    )
    session['state'] = state
    return redirect(authorization_url)

@google_bp.route('/google/callback')
@jwt_required()
def google_callback():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"msg": "User not found"}), 404

    state = session.get('state')
    if not state:
        return jsonify({"msg": "State missing in session"}), 400

    flow = Flow.from_client_secrets_file(
        # CLIENT_SECRETS_FILE,
        GOOGLE_CLIENT_SECRET_FILE,
        scopes=SCOPES,
        state=state,
        redirect_uri=url_for('google_bp.google_callback', _external=True)
    )
    flow.fetch_token(authorization_response=request.url)

    credentials = flow.credentials
    creds_dict = credentials_to_dict(credentials)
    user.google_credentials = creds_dict

    try:
        # Check if existing sheet is valid
        needs_new_sheet = True
        print("Checking existing Google Sheet ID:", user.google_sheet_id)
        if user.google_sheet_id:
            try:
                drive_service = build("drive", "v3", credentials=credentials)
                drive_service.files().get(fileId=user.google_sheet_id).execute()
                needs_new_sheet = False
            except HttpError as err:
                if err.resp.status == 404:
                    logging.info("Existing Google Sheet not found; will recreate.")
                    needs_new_sheet = True
                else:
                    raise

        # Prepare headers and rows
        headers = [["Type", "Borrower ID", "Borrower Name", "Amount", "Date", "Note"]]
        values = []

        lendings = Lending.query.filter_by(user_id=user.id).all()
        for lending in lendings:
            borrower = Borrower.query.get(lending.borrower_id)
            values.append([
                "Lending",
                lending.borrower_id,
                borrower.name if borrower else "Unknown",
                lending.amount,
                lending.date.strftime('%Y-%m-%d'),
                lending.note or ""
            ])

        repayments = Repayment.query.filter_by(user_id=user.id).all()
        for repayment in repayments:
            borrower = Borrower.query.get(repayment.borrower_id)
            values.append([
                "Repayment",
                repayment.borrower_id,
                borrower.name if borrower else "Unknown",
                repayment.amount,
                repayment.date.strftime('%Y-%m-%d'),
                repayment.note or ""
            ])

        if needs_new_sheet:
            logging.info("Creating new backup sheet.")
            sheet_id = create_backup_sheet(creds_dict, headers=headers, data=values)
            user.google_sheet_id = sheet_id

    except Exception as e:
        logging.exception("Sheet creation failed after Google login")
        return jsonify({"msg": "Google login succeeded but sheet creation failed."}), 500

    db.session.commit()
    return redirect('/')


@google_bp.route('/google/create-backup', methods=['POST'])
@jwt_required()
def create_backup():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user:
        return jsonify({"msg": "User not found"}), 404

    if not user.google_credentials:
        return jsonify({"msg": "Google not authorized"}), 401

    credentials = Credentials.from_authorized_user_info(user.google_credentials)

    if credentials.expired and credentials.refresh_token:
        credentials.refresh(requests.Request())
        user.google_credentials = credentials_to_dict(credentials)
        db.session.commit()

    if user.google_sheet_id:
        return jsonify({"msg": "Backup already exists", "sheet_id": user.google_sheet_id}), 200

    sheet_id = create_backup_sheet(user.google_credentials)
    user.google_sheet_id = sheet_id
    db.session.commit()

    return jsonify({"msg": "Backup sheet created", "sheet_id": sheet_id}), 201

def credentials_to_dict(credentials):
    return {
        'token': credentials.token,
        'refresh_token': credentials.refresh_token,
        'token_uri': credentials.token_uri,
        'client_id': credentials.client_id,
        'client_secret': credentials.client_secret,
        'scopes': credentials.scopes
    }
