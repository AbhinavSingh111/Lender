from flask import Blueprint, jsonify, request, Response
from flask_jwt_extended import jwt_required, get_jwt_identity
from models.models import Borrower
import csv
import io

export_bp = Blueprint('export', __name__)

@export_bp.route('/export', methods=['GET'])
@jwt_required()
def export_data():
    user_id = int(get_jwt_identity())
    format = request.args.get('format', 'json')
    borrowers = Borrower.query.filter_by(user_id=user_id).all()
    data = []
    for b in borrowers:
        lendings = [{"amount": l.amount, "note": l.note, "date": l.date} for l in b.lendings]
        repayments = [{"amount": r.amount, "note": r.note, "date": r.date} for r in b.repayments]
        data.append({
            "borrower": {"id": b.id, "name": b.name, "email": b.email, "fully_paid": b.fully_paid},
            "lendings": lendings,
            "repayments": repayments
        })
    if format == "csv":
        output = io.StringIO()
        writer = csv.writer(output)
        writer.writerow(["Borrower Name", "Email", "Lending Amount", "Note","Lending Date", "Repayment Amount", "Repayment Date"])
        for entry in data:
            b = entry["borrower"]
            for l in entry["lendings"]:
                writer.writerow([b["name"], b["email"], l["amount"], l["note"], l["date"], ""])
            for r in entry["repayments"]:
                writer.writerow([b["name"], b["email"], "", r["note"], "", r["amount"], r["date"]])
        return Response(output.getvalue(), mimetype="text/csv")
    return jsonify(data)