"""
Admin tool implementations for the Claude agent.
These functions run inside a Flask app context (webhook request).
"""
import logging
from datetime import datetime, timezone, timedelta
from models import db, Pool, Wallet, Lottery, LotteryWinner, Claim, Announcement

logger = logging.getLogger(__name__)


# ── Pool ──────────────────────────────────────────────────────────────────────

def get_pool() -> dict:
    pool = Pool.query.first()
    if not pool:
        return {"error": "獎池尚未初始化"}
    return pool.to_dict()


def update_pool(usdt_balance: float = None, jiucai_prize_balance: float = None,
                jiucai_claim_balance: float = None) -> dict:
    pool = Pool.query.first()
    if not pool:
        pool = Pool()
        db.session.add(pool)
    if usdt_balance is not None:
        pool.usdt_balance = usdt_balance
    if jiucai_prize_balance is not None:
        pool.jiucai_prize_balance = jiucai_prize_balance
    if jiucai_claim_balance is not None:
        pool.jiucai_claim_balance = jiucai_claim_balance
    db.session.commit()
    return {"ok": True, "pool": pool.to_dict()}


# ── Stats ─────────────────────────────────────────────────────────────────────

def get_stats() -> dict:
    pool = Pool.query.first()
    total_wallets = Wallet.query.filter_by(is_blacklisted=False).count()
    tg_bound = Wallet.query.filter(Wallet.telegram_chat_id.isnot(None)).count()
    pending_claims = Claim.query.filter_by(status="pending").count()
    scheduled_lotteries = Lottery.query.filter_by(status="scheduled").count()
    pending_confirm = Lottery.query.filter_by(status="pending_confirm").count()
    return {
        "total_wallets": total_wallets,
        "telegram_bound": tg_bound,
        "pending_claims": pending_claims,
        "scheduled_lotteries": scheduled_lotteries,
        "pending_confirm_lotteries": pending_confirm,
        "pool": pool.to_dict() if pool else {},
    }


# ── Lottery ───────────────────────────────────────────────────────────────────

def list_lotteries(status: str = None, limit: int = 10) -> dict:
    q = Lottery.query
    if status:
        q = q.filter_by(status=status)
    items = q.order_by(Lottery.draw_time.desc()).limit(limit).all()
    return {"lotteries": [l.to_dict() for l in items]}


def create_lottery(title: str, module: str, draw_time: str,
                   winner_count: int, usdt_prize: float = 0,
                   jiucai_prize: float = 0) -> dict:
    try:
        dt = datetime.fromisoformat(draw_time)
    except ValueError:
        return {"error": f"draw_time 格式錯誤，請用 ISO 格式，例如 2026-04-20T20:00:00"}

    l = Lottery(
        title=title,
        module=module,
        draw_time=dt,
        winner_count=int(winner_count),
        usdt_prize=usdt_prize,
        jiucai_prize=jiucai_prize,
    )
    db.session.add(l)
    db.session.commit()
    return {"ok": True, "lottery": l.to_dict()}


def run_lottery(lottery_id: int) -> dict:
    l = Lottery.query.get(lottery_id)
    if not l:
        return {"error": f"找不到抽獎 #{lottery_id}"}
    if l.status != "scheduled":
        return {"error": f"抽獎狀態為 {l.status}，不可執行"}

    from services.lottery_engine import run_draw
    from services.telegram_notify import notify_owner_draw_preview
    winners = run_draw(l)
    l.status = "pending_confirm"
    db.session.commit()
    notify_owner_draw_preview(l, winners)
    return {"ok": True, "winners": [w.to_dict() for w in winners]}


def confirm_lottery(lottery_id: int) -> dict:
    l = Lottery.query.get(lottery_id)
    if not l:
        return {"error": f"找不到抽獎 #{lottery_id}"}
    if l.status != "pending_confirm":
        return {"error": f"抽獎狀態為 {l.status}，不可確認"}

    winners = LotteryWinner.query.filter_by(lottery_id=lottery_id).all()
    from services.chain import send_batch_payout
    tx_hash = send_batch_payout(l, winners)
    l.batch_tx_hash = tx_hash
    l.confirmed_at = datetime.now(timezone.utc)
    l.status = "confirmed"

    pool = Pool.query.first()
    if pool:
        pool.total_usdt_paid_out = (pool.total_usdt_paid_out or 0) + (l.usdt_prize or 0)
        pool.total_jiucai_paid_out = (pool.total_jiucai_paid_out or 0) + (l.jiucai_prize or 0)

    db.session.commit()
    from services.telegram_notify import broadcast_draw_result
    broadcast_draw_result(l, winners)
    return {"ok": True, "tx_hash": tx_hash, "winner_count": len(winners)}


def cancel_lottery(lottery_id: int) -> dict:
    l = Lottery.query.get(lottery_id)
    if not l:
        return {"error": f"找不到抽獎 #{lottery_id}"}
    old_status = l.status
    l.status = "cancelled"
    db.session.commit()
    return {"ok": True, "previous_status": old_status}


# ── Claims ────────────────────────────────────────────────────────────────────

def list_claims(status: str = "pending", limit: int = 20) -> dict:
    claims = Claim.query.filter_by(status=status).order_by(Claim.created_at).limit(limit).all()
    return {"claims": [c.to_dict() for c in claims], "count": len(claims)}


def approve_claim(claim_id: int) -> dict:
    c = Claim.query.get(claim_id)
    if not c:
        return {"error": f"找不到申請 #{claim_id}"}
    if c.status != "pending":
        return {"error": f"申請狀態為 {c.status}，無法審核"}

    c.status = "approved"
    c.reviewed_at = datetime.now(timezone.utc)
    c.lock_until = datetime.now(timezone.utc) + timedelta(days=20)
    db.session.commit()

    from services.chain import send_jiucai
    tx = send_jiucai(c.wallet_address, int(c.jiucai_amount or 0))
    c.tx_hash = tx
    c.status = "paid"
    c.paid_at = datetime.now(timezone.utc)
    db.session.commit()
    return {"ok": True, "tx_hash": tx, "claim": c.to_dict()}


def reject_claim(claim_id: int, reason: str = "") -> dict:
    c = Claim.query.get(claim_id)
    if not c:
        return {"error": f"找不到申請 #{claim_id}"}
    if c.status != "pending":
        return {"error": f"申請狀態為 {c.status}，無法審核"}

    c.status = "rejected"
    c.reject_reason = reason
    c.reviewed_at = datetime.now(timezone.utc)
    db.session.commit()
    return {"ok": True, "claim": c.to_dict()}


# ── Announcements ─────────────────────────────────────────────────────────────

def create_announcement(title: str, content: str) -> dict:
    a = Announcement(title=title, content=content)
    db.session.add(a)
    db.session.commit()
    return {"ok": True, "announcement": a.to_dict()}


# ── Wallets ───────────────────────────────────────────────────────────────────

def list_wallets(limit: int = 10, min_days: int = None,
                 zero_wins: bool = False) -> dict:
    q = Wallet.query.filter_by(is_blacklisted=False)
    if min_days:
        q = q.filter(Wallet.holding_days >= min_days)
    if zero_wins:
        q = q.filter(Wallet.win_count == 0)
    wallets = q.order_by(Wallet.holding_rank).limit(limit).all()
    return {"wallets": [w.to_dict() for w in wallets], "count": len(wallets)}


def blacklist_wallet(address: str, reason: str = "") -> dict:
    w = Wallet.query.filter_by(address=address.lower()).first()
    if not w:
        return {"error": f"找不到錢包 {address}"}
    w.is_blacklisted = True
    w.blacklist_reason = reason
    db.session.commit()
    return {"ok": True}


# ── Dispatch ──────────────────────────────────────────────────────────────────

TOOL_MAP = {
    "get_pool": get_pool,
    "update_pool": update_pool,
    "get_stats": get_stats,
    "list_lotteries": list_lotteries,
    "create_lottery": create_lottery,
    "run_lottery": run_lottery,
    "confirm_lottery": confirm_lottery,
    "cancel_lottery": cancel_lottery,
    "list_claims": list_claims,
    "approve_claim": approve_claim,
    "reject_claim": reject_claim,
    "create_announcement": create_announcement,
    "list_wallets": list_wallets,
    "blacklist_wallet": blacklist_wallet,
}


def execute_tool(name: str, params: dict) -> dict:
    fn = TOOL_MAP.get(name)
    if not fn:
        return {"error": f"未知工具：{name}"}
    try:
        return fn(**params)
    except Exception as e:
        logger.error("Tool %s error: %s", name, e)
        return {"error": str(e)}
