from datetime import datetime, timezone
from .db import db


class Pool(db.Model):
    """Single-row table tracking prize pool balances (off-chain bookkeeping)."""
    __tablename__ = "pool"

    id = db.Column(db.Integer, primary_key=True)

    # USDT prize wallet balance
    usdt_balance = db.Column(db.Numeric(18, 6), default=0)

    # JIUCAI pool wallet (split into two buckets)
    jiucai_prize_balance = db.Column(db.Numeric(30, 0), default=0)   # prize draws
    jiucai_claim_balance = db.Column(db.Numeric(30, 0), default=0)   # claim payouts

    # Operations wallet A/B
    ops_tax_balance = db.Column(db.Numeric(30, 0), default=0)       # auto-swap
    ops_reserve_balance = db.Column(db.Numeric(30, 0), default=0)   # manual

    # Cumulative stats (for homepage display)
    total_usdt_paid_out = db.Column(db.Numeric(18, 6), default=0)
    total_jiucai_paid_out = db.Column(db.Numeric(30, 0), default=0)

    updated_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
        onupdate=lambda: datetime.now(timezone.utc),
    )

    def to_dict(self):
        return {
            "usdt_balance": str(self.usdt_balance or 0),
            "jiucai_prize_balance": str(self.jiucai_prize_balance or 0),
            "jiucai_claim_balance": str(self.jiucai_claim_balance or 0),
            "total_usdt_paid_out": str(self.total_usdt_paid_out or 0),
            "total_jiucai_paid_out": str(self.total_jiucai_paid_out or 0),
            "updated_at": self.updated_at.isoformat() if self.updated_at else None,
        }
