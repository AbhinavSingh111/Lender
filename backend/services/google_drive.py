from googleapiclient.discovery import build
from google.oauth2.credentials import Credentials
from google.auth.transport.requests import Request
import logging


def get_credentials(credentials_input):
    # If it's already a Credentials object, just return it
    if isinstance(credentials_input, Credentials):
        creds = credentials_input
    else:
        # Otherwise treat it as dict
        creds = Credentials(
            token=credentials_input["token"],
            refresh_token=credentials_input.get("refresh_token"),
            token_uri=credentials_input["token_uri"],
            client_id=credentials_input["client_id"],
            client_secret=credentials_input["client_secret"],
            scopes=credentials_input["scopes"]
        )

    # Refresh token if expired
    if creds.expired and creds.refresh_token:
        creds.refresh(Request())

    return creds


def create_backup_sheet(credentials_dict, headers=None, data=None,sheet_name="Sheet1"):
    print("Creating backup sheet with data:", data)
    creds = get_credentials(credentials_dict)
    
    try:
        drive_service = build("drive", "v3", credentials=creds)
        sheets_service = build("sheets", "v4", credentials=creds)

        # Create the Google Sheet
        file_metadata = {
            "name": "LendingApp Backup",
            "mimeType": "application/vnd.google-apps.spreadsheet"
        }

        spreadsheet = drive_service.files().create(
            body=file_metadata,
            fields="id"
        ).execute()
        sheet_id = spreadsheet.get("id")

        # Default headers if not provided
        if headers is None:
            headers = [["Type", "Borrower ID", "Borrower Name", "Amount", "Date", "Note"]]

        # Combine headers and data rows
        all_rows = []
        if headers:
            all_rows.extend(headers)
        if data:
            all_rows.extend(data)

        # Write headers and data together
        if all_rows:
            sheets_service.spreadsheets().values().update(
                spreadsheetId=sheet_id,
                range=f"{sheet_name}!A1",
                valueInputOption="RAW",
                body={"values": all_rows}
            ).execute()

        return sheet_id

    except Exception as e:
        logging.exception("Failed to create backup sheet")
        raise RuntimeError("Failed to create backup sheet") from e
        


def append_to_sheet(token, sheet_id, row):
    creds = get_credentials(token)
    sheets_service = build("sheets", "v4", credentials=creds)

    response = sheets_service.spreadsheets().values().append(
        spreadsheetId=sheet_id,
        range="Sheet1!A:E",
        valueInputOption="USER_ENTERED",
        insertDataOption="INSERT_ROWS",
        body={"values": [row]}
    ).execute()
    print("Append response:", response)