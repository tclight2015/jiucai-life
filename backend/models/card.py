from datetime import datetime, timezone
from .db import db


class UserCard(db.Model):
    __tablename__ = "user_cards"

    id = db.Column(db.Integer, primary_key=True)
    wallet_address = db.Column(db.String(42), nullable=False, index=True)

    # weight | prize | special (無敵星星)
    card_type = db.Column(db.String(32), nullable=False)
    card_multiplier = db.Column(db.Float, nullable=True)  # 1.5, 2.0, 3.0 etc.

    quantity = db.Column(db.Integer, default=1)
    enabled_quantity = db.Column(db.Integer, default=0)  # set by user before draw

    expires_at = db.Column(db.DateTime(timezone=True), nullable=True)  # for special cards
    acquired_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    source = db.Column(db.String(64), nullable=True)  # lottery | referral | event

    def is_active(self):
        if self.expires_at is None:
            return True
        return datetime.now(timezone.utc) < self.expires_at

    def to_dict(self):
        return {
            "id": self.id,
            "card_type": self.card_type,
            "card_multiplier": self.card_multiplier,
            "quantity": self.quantity,
            "enabled_quantity": self.enabled_quantity,
            "expires_at": self.expires_at.isoformat() if self.expires_at else None,
            "is_active": self.is_active(),
        }
