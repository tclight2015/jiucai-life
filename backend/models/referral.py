from datetime import datetime, timezone
from .db import db


class Referral(db.Model):
    __tablename__ = "referrals"

    id = db.Column(db.Integer, primary_key=True)
    referrer_address = db.Column(db.String(42), nullable=False, index=True)
    referred_address = db.Column(db.String(42), nullable=False, unique=True)

    reward_type = db.Column(db.String(32), nullable=True)   # jiucai | card
    reward_amount = db.Column(db.Numeric(30, 0), nullable=True)
    reward_card_type = db.Column(db.String(32), nullable=True)
    reward_paid = db.Column(db.Boolean, default=False)
    reward_tx_hash = db.Column(db.String(66), nullable=True)

    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
