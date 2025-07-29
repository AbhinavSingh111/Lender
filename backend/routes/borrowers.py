from flask import Blueprint, request, jsonify
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.models import db, Borrower, User
from services.google_drive import append_to_sheet
import logging

logging.basicConfig(level=logging.DEBUG)

borrowers_bp = Blueprint('borrowers', __name__)

@borrowers_bp.route('/borrowers', methods=['GET'])
@jwt_required()
def get_borrowers():
    user_id = int(get_jwt_identity())
    borrowers = Borrower.query.filter_by(user_id=user_id).all()
    return jsonify([{"id": b.id, "name": b.name, "email": b.email, "fully_paid": b.fully_paid, "outstanding": b.calculate_outstanding()} for b in borrowers ])

@borrowers_bp.route('/borrowers', methods=['POST'])
@jwt_required()
def add_borrower():
    user_id = int(get_jwt_identity())
    data = request.get_json()
    borrower = Borrower(
        name=data['name'],
        email=data.get('email'),
        user_id=user_id
    )
    db.session.add(borrower)
    db.session.commit()
    # try:
    #     user = User.query.get(user_id)
    #     if user.google_sheet_id:
    #         from flask import session
    #         from datetime import datetime

    #         append_to_sheet(
    #             token=session["google_token"],
    #             sheet_id=user.google_sheet_id,
    #             row=[
    #                 "Lending",
    #                 borrower.name,
    #                 0,  # Initial lending amount = 0; updated on LendingForm submission
    #                 datetime.utcnow().isoformat(),
    #                 "Borrower added"
    #             ]
    #         )
    # except Exception as e:
    #     return jsonify({"msg": "Failed to add borrower to Google Sheet"}), 500
    return jsonify({"msg": "Borrower added", "id": borrower.id}), 201

@borrowers_bp.route('/borrowers/<int:id>', methods=['GET'])
@jwt_required()
def get_borrower_detail(id):
    user_id = int(get_jwt_identity())
    borrower = Borrower.query.filter_by(id=id, user_id=user_id).first_or_404()
    lendings = [{"id": l.id, "amount": l.amount, "note": l.note, "date": l.date} for l in borrower.lendings]
    repayments = [{"id": r.id, "amount": r.amount, "note": r.note, "date": r.date} for r in borrower.repayments]
    outstanding = sum(l['amount'] for l in lendings) - sum(r['amount'] for r in repayments)
    return jsonify({
        "id": borrower.id,
        "name": borrower.name,
        "email": borrower.email,
        "fully_paid": borrower.fully_paid,
        "lendings": lendings,
        "repayments": repayments,
        "outstanding": outstanding
    })

# @borrowers_bp.route('/borrowers/<int:id>/mark_paid', methods=['POST'])
# @jwt_required()
# def mark_paid(id):
#     user_id = get_jwt_identity()
#     borrower = Borrower.query.filter_by(id=id, user_id=user_id).first_or_404()
#     borrower.fully_paid = True
#     db.session.commit()
#     return jsonify({"msg": "Borrower marked as fully paid"})

@borrowers_bp.route('/borrowers/<int:id>/mark_paid', methods=['POST'])
@jwt_required()
def mark_paid(id):
    user_id = int(get_jwt_identity())
    borrower = Borrower.query.filter_by(id=id, user_id=user_id).first_or_404()
    if borrower.calculate_outstanding() == 0:
        borrower.fully_paid = True
        db.session.commit()
        return jsonify({"msg": "Borrower marked as fully paid"})
    else:
        return jsonify({"msg": "Cannot mark as fully paid. Outstanding amount must be zero."}), 400

@borrowers_bp.route('/borrowers/<int:id>', methods=['PUT'])
@jwt_required()
def update_borrower(id):
    user_id = int(get_jwt_identity())
    borrower = Borrower.query.filter_by(id=id, user_id=user_id).first_or_404()

    data = request.get_json()
    if 'email' in data:
        borrower.email = data['email']
    if 'name' in data:
        borrower.name = data['name']

    db.session.commit()
    return jsonify({"msg": "Borrower updated successfully", "id": borrower.id, "name": borrower.name, "email": borrower.email})
