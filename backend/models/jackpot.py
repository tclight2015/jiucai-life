"""
韭菜樂透 models
- PowerballDraw: weekly Powerball results + our matching run
- JiucaiTicket: one ticket per wallet per week
"""
from datetime import datetime, timezone
from .db import db


class PowerballDraw(db.Model):
    __tablename__ = "powerball_draws"

    id = db.Column(db.Integer, primary_key=True)
    # Powerball official draw number (e.g. 2026-018)
    draw_number = db.Column(db.String(16), unique=True, nullable=False)
    draw_date = db.Column(db.Date, nullable=False)
    # 5 white balls sorted [7, 14, 23, 38, 45]
    numbers = db.Column(db.JSON, nullable=False)

    # Our internal week counter (1, 2, 3 … resets each year)
    jiucai_week = db.Column(db.Integer, nullable=False)
    jiucai_year = db.Column(db.Integer, nullable=False)

    # Matching stats
    processed = db.Column(db.Boolean, default=False)
    winner_count = db.Column(db.Integer, default=0)
    total_prize_usdt = db.Column(db.Numeric(18, 6), default=0)

    created_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )

    tickets = db.relationship("JiucaiTicket", backref="draw", lazy=True)

    def to_dict(self):
        return {
            "id": self.id,
            "draw_number": self.draw_number,
            "draw_date": self.draw_date.isoformat() if self.draw_date else None,
            "numbers": self.numbers,
            "jiucai_week": self.jiucai_week,
            "jiucai_year": self.jiucai_year,
            "processed": self.processed,
            "winner_count": self.winner_count,
            "total_prize_usdt": str(self.total_prize_usdt or 0),
        }


class JiucaiTicket(db.Model):
    __tablename__ = "jiucai_tickets"

    id = db.Column(db.Integer, primary_key=True)
    wallet_address = db.Column(db.String(42), nullable=False, index=True)

    # Week this ticket was issued for
    jiucai_week = db.Column(db.Integer, nullable=False)
    jiucai_year = db.Column(db.Integer, nullable=False)

    # 5 numbers [1-69]
    numbers = db.Column(db.JSON, nullable=False)

    # Matching result (filled after draw is processed)
    powerball_draw_id = db.Column(
        db.Integer, db.ForeignKey("powerball_draws.id"), nullable=True
    )
    matched_count = db.Column(db.Integer, default=0)
    is_winner = db.Column(db.Boolean, default=False)

    # Payout
    prize_usdt = db.Column(db.Numeric(18, 6), default=0)
    tx_hash = db.Column(db.String(66), nullable=True)
    paid_at = db.Column(db.DateTime(timezone=True), nullable=True)

    issued_at = db.Column(
        db.DateTime(timezone=True),
        default=lambda: datetime.now(timezone.utc),
    )

    __table_args__ = (
        db.UniqueConstraint(
            "wallet_address", "jiucai_year", "jiucai_week",
            name="uq_ticket_wallet_week",
        ),
    )

    def to_dict(self, show_full_address=False):
        addr = self.wallet_address
        return {
            "id": self.id,
            "wallet_address": addr if show_full_address else f"{addr[:6]}...{addr[-4:]}",
            "jiucai_week": self.jiucai_week,
            "jiucai_year": self.jiucai_year,
            "numbers": self.numbers,
            "powerball_draw_id": self.powerball_draw_id,
            "matched_count": self.matched_count,
            "is_winner": self.is_winner,
            "prize_usdt": str(self.prize_usdt or 0),
            "tx_hash": self.tx_hash,
            "issued_at": self.issued_at.isoformat() if self.issued_at else None,
        }
