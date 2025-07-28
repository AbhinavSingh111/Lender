from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.models import db, Lending, Borrower, User
from utils.email import send_lending_email
from services.google_drive import append_to_sheet
from datetime import datetime

lendings_bp = Blueprint('lendings', __name__)

@lendings_bp.route('/lendings', methods=['POST'])
@jwt_required()
def add_lending():
    user_id = get_jwt_identity()
    user = User.query.get(user_id)
    data = request.get_json()
    borrower = Borrower.query.filter_by(id=data['borrower_id'], user_id=user_id).first_or_404()
    lending = Lending(
        borrower_id=data['borrower_id'],
        amount=str(data['amount']),
        note=data.get('note')
    )
    db.session.add(lending)
    borrower.fully_paid = borrower.calculate_outstanding() == 0
    db.session.commit()
    if user.google_credentials and user.google_sheet_id:
        append_to_sheet(
            user.google_credentials,
            user.google_sheet_id,
            ["Lending", data['borrower_id'], borrower.name, str(data["amount"]), datetime.now().strftime("%Y-%m-%d %H:%M:%S"), data.get("note", "")]
        )

    if data.get('send_email') and borrower.email:
        user = User.query.get(user_id)
        send_lending_email(borrower, lending, user_email=user.email)
        lending.email_sent = True
        db.session.commit()
    return jsonify({"msg": "Lending recorded", "id": lending.id}), 201