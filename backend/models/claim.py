from datetime import datetime, timezone
from .db import db


class Claim(db.Model):
    __tablename__ = "claims"

    id = db.Column(db.Integer, primary_key=True)
    wallet_address = db.Column(db.String(42), nullable=False, index=True)

    # Screenshot
    screenshot_url = db.Column(db.String(512), nullable=True)
    loss_amount_usd = db.Column(db.Numeric(18, 2), nullable=True)   # parsed from screenshot

    # Payout
    jiucai_amount = db.Column(db.Numeric(30, 0), nullable=True)
    lock_until = db.Column(db.DateTime(timezone=True), nullable=True)  # 20-day lock
    tx_hash = db.Column(db.String(66), nullable=True)

    # Status: pending | approved | rejected | paid | on_hold (no ETH)
    status = db.Column(db.String(32), default="pending")
    queue_position = db.Column(db.Integer, nullable=True)
    reject_reason = db.Column(db.String(256), nullable=True)

    # Auto-review fields
    auto_reviewed = db.Column(db.Boolean, default=False)
    auto_review_score = db.Column(db.Float, nullable=True)

    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    reviewed_at = db.Column(db.DateTime(timezone=True), nullable=True)
    paid_at = db.Column(db.DateTime(timezone=True), nullable=True)

    def to_dict(self):
        return {
            "id": self.id,
            "wallet_address": self.wallet_address,
            "jiucai_amount": str(self.jiucai_amount or 0),
            "lock_until": self.lock_until.isoformat() if self.lock_until else None,
            "status": self.status,
            "queue_position": self.queue_position,
            "tx_hash": self.tx_hash,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
