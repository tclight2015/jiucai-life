import os
from flask import Flask
from flask_cors import CORS
from flask_migrate import Migrate
from dotenv import load_dotenv

load_dotenv()

from models import db
from routes import pool_bp, wallet_bp, lottery_bp, claim_bp, comment_bp, admin_bp


def create_app():
    app = Flask(__name__)

    # Config
    app.config["SQLALCHEMY_DATABASE_URI"] = os.getenv(
        "DATABASE_URL", "sqlite:///jiucai_dev.db"
    )
    # Railway gives postgres:// URLs; SQLAlchemy needs postgresql://
    if app.config["SQLALCHEMY_DATABASE_URI"].startswith("postgres://"):
        app.config["SQLALCHEMY_DATABASE_URI"] = app.config[
            "SQLALCHEMY_DATABASE_URI"
        ].replace("postgres://", "postgresql://", 1)

    app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False
    app.config["SECRET_KEY"] = os.getenv("SECRET_KEY", "dev-secret-change-me")

    # Extensions
    db.init_app(app)
    Migrate(app, db)
    CORS(app, origins=["https://jiucai.life", "http://localhost:8080", "http://localhost:5173"])

    # Blueprints
    app.register_blueprint(pool_bp)
    app.register_blueprint(wallet_bp)
    app.register_blueprint(lottery_bp)
    app.register_blueprint(claim_bp)
    app.register_blueprint(comment_bp)
    app.register_blueprint(admin_bp)

    # Health check
    @app.get("/health")
    def health():
        return {"status": "ok"}

    # Announcements (public)
    @app.get("/api/announcements")
    def announcements():
        from models import Announcement
        from flask import jsonify
        items = Announcement.query.filter_by(is_active=True).order_by(
            Announcement.created_at.desc()
        ).limit(10).all()
        return jsonify([a.to_dict() for a in items])

    # Start scheduler (only in main process, not reloader)
    if os.getenv("FLASK_ENV") != "test":
        from tasks.scheduler import init_scheduler
        init_scheduler(app)

    return app


app = create_app()

if __name__ == "__main__":
    port = int(os.getenv("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
