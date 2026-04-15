"""
Auto-review claim screenshots.
Keeps logic simple: accept generously, calculate JIUCAI payout by loss tier.
"""
import logging
from datetime import datetime, timezone

logger = logging.getLogger(__name__)

# Loss tiers (USD) → JIUCAI payout (raw units, 18 decimals implied)
LOSS_TIERS = [
    (1000, 800_000_000 * 10**18),   # $1000+  → 800M JIUCAI
    (200,  500_000_000 * 10**18),   # $200+   → 500M JIUCAI
    (0,    300_000_000 * 10**18),   # <$200   → 300M JIUCAI
]


def calculate_jiucai_payout(loss_usd: float) -> int:
    for threshold, amount in LOSS_TIERS:
        if loss_usd >= threshold:
            return amount
    return LOSS_TIERS[-1][1]


def auto_review_claim(claim):
    """
    Stub auto-review. In production: use OCR / ML to parse screenshot.
    For now: approve all with a default mid-tier payout.
    """
    from datetime import timedelta

    loss_usd = float(claim.loss_amount_usd or 0)
    if loss_usd == 0:
        # Default mid-tier until OCR is implemented
        loss_usd = 201.0

    jiucai = calculate_jiucai_payout(loss_usd)

    claim.loss_amount_usd = loss_usd
    claim.jiucai_amount = jiucai
    claim.auto_reviewed = True
    claim.auto_review_score = 1.0
    claim.reviewed_at = datetime.now(timezone.utc)
    # Keep as pending — daily batch approver processes up to 30/day
    logger.info("Auto-reviewed claim %s → %s JIUCAI", claim.id, jiucai)
