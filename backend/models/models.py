from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password_hash = db.Column(db.String(512), nullable=False)
    google_sheet_id = db.Column(db.String(256))
    google_credentials = db.Column(db.PickleType, nullable=True) 
    borrowers = db.relationship('Borrower', backref='user', lazy=True)

class Borrower(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(120), nullable=False)
    email = db.Column(db.String(120))
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    lendings = db.relationship('Lending', backref='borrower', lazy=True)
    repayments = db.relationship('Repayment', backref='borrower', lazy=True)
    fully_paid = db.Column(db.Boolean, default=False)
    def calculate_outstanding(self):
        total_lending = sum(int(l.amount) for l in self.lendings)
        total_repayment = sum(int(r.amount) for r in self.repayments)
        return total_lending - total_repayment

class Lending(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    borrower_id = db.Column(db.Integer, db.ForeignKey('borrower.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    note = db.Column(db.String(255))
    date = db.Column(db.DateTime, default=datetime.utcnow)
    email_sent = db.Column(db.Boolean, default=False)
    

class Repayment(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    borrower_id = db.Column(db.Integer, db.ForeignKey('borrower.id'), nullable=False)
    amount = db.Column(db.Float, nullable=False)
    note = db.Column(db.String(255))
    date = db.Column(db.DateTime, default=datetime.utcnow)