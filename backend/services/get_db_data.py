from models.models import Borrower  # Add other models if needed

def get_db_data(user):
    headers = [["Type", "Borrower ID", "Borrower Name", "Amount", "Date", "Note"]]
    values = []
    borrowers = Borrower.query.filter_by(user_id=user.id).all()
    if not borrowers:
        print("No borrowers found for user:", user.id)
        return headers, values

    for borrower in borrowers:
        tot_lendings = [{"id": l.id, "amount": l.amount, "note": l.note, "date": l.date, "borrower_id": l.borrower_id, "borrower_name": l.borrower.name} for l in borrower.lendings]
        for lending in tot_lendings:
            values.append([
            "Lending",
            lending['borrower_id'],
            lending['borrower_name'],
            lending['amount'],
            lending['date'].strftime('%Y-%m-%d %H:%M:%S'),
            lending['note'] or ""
        ])

        tot_repayments = [{"id": r.id, "amount": r.amount, "note": r.note, "date": r.date, "borrower_id": r.borrower_id, "borrower_name": r.borrower.name} for r in borrower.repayments]
        for repayment in tot_repayments:
            values.append([
                "Repayment",
                repayment['borrower_id'],
                repayment['borrower_name'],
                repayment['amount'],
                repayment['date'].strftime('%Y-%m-%d %H:%M:%S'),
                repayment['note'] or ""
            ])
          

    return headers, values