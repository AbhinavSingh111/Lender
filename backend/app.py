from flask import Flask, render_template
from flask_sqlalchemy import SQLAlchemy
from flask_jwt_extended import JWTManager
from flask_cors import CORS
from flask_migrate import Migrate
from models.models import db
app = Flask(__name__)
app.config.from_pyfile("config.py")
app.config['DEBUG'] = True

db.init_app(app)
migrate = Migrate(app, db)

jwt = JWTManager(app)
CORS(app,resources={r"/*": {"origins": ["http://localhost:3000", "https://lender-eight.vercel.app"]}},supports_credentials=True,methods=["GET", "POST", "OPTIONS"]) # restrict to frontend domain in production



# Register blueprints
from routes.auth import auth_bp
from routes.borrowers import borrowers_bp
from routes.lendings import lendings_bp
from routes.repayments import repayments_bp
from routes.export import export_bp
from routes.google_auth import google_bp
from routes.backup import backup_bp

app.register_blueprint(google_bp)
app.register_blueprint(auth_bp)
app.register_blueprint(borrowers_bp)
app.register_blueprint(lendings_bp)
app.register_blueprint(repayments_bp)
app.register_blueprint(export_bp)
app.register_blueprint(backup_bp)

@app.route("/")
def home():
    return render_template("home.html")

@app.route("/about")
def about():
    return render_template("about.html")


if __name__ == '__main__':
    app.run(debug=True)