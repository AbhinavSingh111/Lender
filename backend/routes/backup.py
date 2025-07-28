from flask import Blueprint, send_file, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from services.google_drive import get_credentials
from models.models import User
from googleapiclient.discovery import build
import io
import pandas as pd
from google.oauth2.credentials import Credentials as GoogleCreds


backup_bp = Blueprint("backup", __name__)

@backup_bp.route("/backup/download", methods=["GET"])
@jwt_required()
def download_backup():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)

    if not user or not user.google_sheet_id:
        return jsonify({"error": "No Google Sheet connected."}), 400

    try:
        creds = GoogleCreds.from_authorized_user_info(user.google_credentials)
        service = build("sheets", "v4", credentials=creds)
        sheet = service.spreadsheets().values().get(
            spreadsheetId=user.google_sheet_id,
            range="Sheet1"
        ).execute()

        values = sheet.get("values", [])
        df = pd.DataFrame(values[1:], columns=values[0]) if values else pd.DataFrame()

        output = io.BytesIO()
        df.to_excel(output, index=False)  # or df.to_csv(...) for CSV
        output.seek(0)

        return send_file(
            output,
            download_name="backup.xlsx",
            as_attachment=True,
            mimetype="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        )
    except Exception as e:
        print(e)
        return jsonify({"error": "Backup download failed"}), 500
