from datetime import datetime, timezone
from .db import db


class Wallet(db.Model):
    __tablename__ = "wallets"

    id = db.Column(db.Integer, primary_key=True)
    address = db.Column(db.String(42), unique=True, nullable=False, index=True)

    # Holdings (refreshed from chain every 6h)
    jiucai_balance = db.Column(db.Numeric(30, 0), default=0)
    jiucai_locked = db.Column(db.Numeric(30, 0), default=0)  # from claim lock
    holding_rank = db.Column(db.Integer, nullable=True)  # rank among all holders
    total_holders = db.Column(db.Integer, nullable=True)  # snapshot at last rank calc

    # Time weighting
    holding_start = db.Column(db.DateTime(timezone=True), nullable=True)  # when wallet first held JIUCAI
    holding_days = db.Column(db.Integer, default=0)

    # Iron fan (鐵粉) — resets monthly
    iron_fan_days_this_month = db.Column(db.Integer, default=0)
    iron_fan_last_purchase = db.Column(db.DateTime(timezone=True), nullable=True)

    # Telegram
    telegram_chat_id = db.Column(db.String(32), nullable=True)
    telegram_bound_at = db.Column(db.DateTime(timezone=True), nullable=True)

    # Total winnings
    total_usdt_won = db.Column(db.Numeric(18, 6), default=0)
    total_jiucai_won = db.Column(db.Numeric(30, 0), default=0)
    win_count = db.Column(db.Integer, default=0)

    # Referral
    referral_code = db.Column(db.String(16), unique=True, nullable=True)
    referred_by = db.Column(db.String(42), nullable=True)  # address
    referral_reward_claimed = db.Column(db.Boolean, default=False)

    # On-chain referral drip (鏈上導流)
    onchain_referral_sent_days = db.Column(db.Integer, default=0)
    onchain_referral_last_sent = db.Column(db.DateTime(timezone=True), nullable=True)

    # Flags
    is_blacklisted = db.Column(db.Boolean, default=False)
    blacklist_reason = db.Column(db.String(256), nullable=True)
    has_connected_website = db.Column(db.Boolean, default=False)

    # Timestamps
    first_seen = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    last_seen = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))
    rank_updated_at = db.Column(db.DateTime(timezone=True), nullable=True)

    def time_weight(self):
        """Return time weighting multiplier based on holding_days."""
        d = self.holding_days or 0
        if d < 7:
            return 0.5
        elif d < 30:
            return 1.0
        elif d < 60:
            return 1.5
        return 2.0

    def iron_fan_weight(self):
        return 1.0 + (self.iron_fan_days_this_month or 0) * 0.01

    def holding_rank_weight(self):
        """Return multiplier based on holding rank percentile."""
        if not self.holding_rank or not self.total_holders or self.total_holders == 0:
            return 1.0
        pct = self.holding_rank / self.total_holders * 100
        if pct <= 5:
            return 5.0
        elif pct <= 10:
            return 4.0
        elif pct <= 20:
            return 3.2
        elif pct <= 30:
            return 2.6
        elif pct <= 40:
            return 2.1
        elif pct <= 50:
            return 1.7
        elif pct <= 60:
            return 1.4
        elif pct <= 70:
            return 1.2
        elif pct <= 80:
            return 1.1
        elif pct <= 85:
            return 1.05
        elif pct <= 90:
            return 1.02
        return 1.0

    def final_weight(self, card_multiplier=1.0):
        return (
            1.0
            * self.holding_rank_weight()
            * self.time_weight()
            * card_multiplier
            * self.iron_fan_weight()
        )

    def to_dict(self):
        return {
            "address": self.address,
            "jiucai_balance": str(self.jiucai_balance or 0),
            "jiucai_locked": str(self.jiucai_locked or 0),
            "jiucai_available": str(
                max(0, (self.jiucai_balance or 0) - (self.jiucai_locked or 0))
            ),
            "holding_rank": self.holding_rank,
            "total_holders": self.total_holders,
            "holding_days": self.holding_days,
            "time_weight": self.time_weight(),
            "holding_rank_weight": self.holding_rank_weight(),
            "iron_fan_days": self.iron_fan_days_this_month,
            "iron_fan_weight": self.iron_fan_weight(),
            "final_weight": self.final_weight(),
            "total_usdt_won": str(self.total_usdt_won or 0),
            "total_jiucai_won": str(self.total_jiucai_won or 0),
            "win_count": self.win_count,
            "telegram_bound": self.telegram_chat_id is not None,
            "referral_code": self.referral_code,
            "first_seen": self.first_seen.isoformat() if self.first_seen else None,
        }
