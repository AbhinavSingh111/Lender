from flask import Blueprint, request, jsonify, session
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.models import db, Repayment, Borrower, User
from utils.email import send_repayment_email
from services.google_drive import append_to_sheet

repayments_bp = Blueprint('repayments', __name__)

@repayments_bp.route('/repayments', methods=['POST'])
@jwt_required()
def add_repayment():
    user_id = int(get_jwt_identity())
    user = User.query.get(user_id)
    data = request.get_json()
    borrower = Borrower.query.filter_by(id=data['borrower_id'], user_id=user_id).first_or_404()
    repayment = Repayment(
        borrower_id=borrower.id,
        amount=data['amount'],
        note=data.get('note')
    )
    db.session.add(repayment)
    borrower.fully_paid = borrower.calculate_outstanding() == 0
    db.session.commit()
    try:
        print("Appending to Google Sheet")
        if user.google_credentials and user.google_sheet_id:     
            append_to_sheet(
                user.google_credentials,
                user.google_sheet_id,
                [
                    "Repayment",
                    borrower.id,
                    borrower.name,
                    repayment.amount,
                    repayment.date.isoformat(),
                    repayment.note or ""
                ]
            )
        if data.get('send_email') and borrower.email:
            print("Sending repayment email")
            user = User.query.get(user_id)
            send_repayment_email(borrower, repayment, user_email=user.email)
            repayment.email_sent = True
            db.session.commit()
    except Exception as e:
        print(e)
        return jsonify({"msg": "Failed to add repayment to Google Sheet"}), 500
    return jsonify({"msg": "Repayment recorded", "id": repayment.id}), 201