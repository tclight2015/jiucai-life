from datetime import datetime, timezone
from .db import db


class Lottery(db.Model):
    __tablename__ = "lotteries"

    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(128), nullable=False)

    # Module: top50 | bottom50 | worst50 | all | custom
    module = db.Column(db.String(32), nullable=False, default="all")

    # Prize
    usdt_prize = db.Column(db.Numeric(18, 6), default=0)
    jiucai_prize = db.Column(db.Numeric(30, 0), default=0)
    winner_count = db.Column(db.Integer, default=1)

    # Schedule
    draw_time = db.Column(db.DateTime(timezone=True), nullable=False)
    notification_time = db.Column(db.DateTime(timezone=True), nullable=True)  # pre-draw ping

    # Status: scheduled | pending_confirm | confirmed | paid | cancelled
    status = db.Column(db.String(32), default="scheduled")

    # Randomness
    block_number = db.Column(db.BigInteger, nullable=True)
    block_hash = db.Column(db.String(66), nullable=True)

    # Results snapshot (JSON list of addresses + weights)
    eligible_snapshot = db.Column(db.JSON, nullable=True)

    # Owner confirmation
    confirmed_at = db.Column(db.DateTime(timezone=True), nullable=True)
    paid_at = db.Column(db.DateTime(timezone=True), nullable=True)
    batch_tx_hash = db.Column(db.String(66), nullable=True)

    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    winners = db.relationship("LotteryWinner", backref="lottery", lazy=True)

    def to_dict(self, include_winners=False):
        d = {
            "id": self.id,
            "title": self.title,
            "module": self.module,
            "usdt_prize": str(self.usdt_prize or 0),
            "jiucai_prize": str(self.jiucai_prize or 0),
            "winner_count": self.winner_count,
            "draw_time": self.draw_time.isoformat() if self.draw_time else None,
            "status": self.status,
            "block_number": self.block_number,
            "block_hash": self.block_hash,
            "batch_tx_hash": self.batch_tx_hash,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
        if include_winners:
            d["winners"] = [w.to_dict() for w in self.winners]
        return d


class LotteryWinner(db.Model):
    __tablename__ = "lottery_winners"

    id = db.Column(db.Integer, primary_key=True)
    lottery_id = db.Column(db.Integer, db.ForeignKey("lotteries.id"), nullable=False)
    wallet_address = db.Column(db.String(42), nullable=False, index=True)

    usdt_amount = db.Column(db.Numeric(18, 6), default=0)
    jiucai_amount = db.Column(db.Numeric(30, 0), default=0)

    # Cards used in this draw
    cards_used = db.Column(db.JSON, nullable=True)

    weight_at_draw = db.Column(db.Float, nullable=True)
    tx_hash = db.Column(db.String(66), nullable=True)
    notified_at = db.Column(db.DateTime(timezone=True), nullable=True)

    # Screenshot wall
    screenshot_url = db.Column(db.String(512), nullable=True)
    screenshot_verified = db.Column(db.Boolean, default=False)
    screenshot_bonus_paid = db.Column(db.Boolean, default=False)
    screenshot_testimony = db.Column(db.String(200), nullable=True)
    show_anonymous = db.Column(db.Boolean, default=False)

    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    def to_dict(self):
        addr = self.wallet_address
        return {
            "lottery_id": self.lottery_id,
            "wallet_address": f"{addr[:6]}...{addr[-4:]}",
            "usdt_amount": str(self.usdt_amount or 0),
            "jiucai_amount": str(self.jiucai_amount or 0),
            "cards_used": self.cards_used,
            "tx_hash": self.tx_hash,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
