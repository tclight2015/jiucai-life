"""
Admin API — all routes require Bearer ADMIN_TOKEN header.
Designed for AI-agent management: Claude calls these endpoints directly.
"""
import os
from functools import wraps
from datetime import datetime, timezone
from flask import Blueprint, jsonify, request
from models import db, Wallet, Lottery, LotteryWinner, Claim, Pool, Comment, Announcement
from services.lottery_engine import run_draw
from services.telegram_notify import notify_owner_draw_preview, broadcast_draw_result
from services.chain import send_batch_payout

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")


def require_admin(f):
    @wraps(f)
    def decorated(*args, **kwargs):
        token = request.headers.get("Authorization", "")
        if token != f"Bearer {os.getenv('ADMIN_TOKEN')}":
            return jsonify({"error": "unauthorized"}), 401
        return f(*args, **kwargs)
    return decorated


# ── Pool management ────────────────────────────────────────────────────────────

@admin_bp.get("/pool")
@require_admin
def get_pool():
    pool = Pool.query.first()
    return jsonify(pool.to_dict() if pool else {})


@admin_bp.post("/pool/update")
@require_admin
def update_pool():
    data = request.get_json(silent=True) or {}
    pool = Pool.query.first()
    if not pool:
        pool = Pool()
        db.session.add(pool)
    for field in ("usdt_balance", "jiucai_prize_balance", "jiucai_claim_balance",
                  "ops_tax_balance", "ops_reserve_balance",
                  "total_usdt_paid_out", "total_jiucai_paid_out"):
        if field in data:
            setattr(pool, field, data[field])
    db.session.commit()
    return jsonify(pool.to_dict())


# ── Lottery management ─────────────────────────────────────────────────────────

@admin_bp.post("/lottery/create")
@require_admin
def create_lottery():
    data = request.get_json(silent=True) or {}
    required = ("title", "module", "draw_time", "winner_count")
    if not all(k in data for k in required):
        return jsonify({"error": f"required: {required}"}), 400

    l = Lottery(
        title=data["title"],
        module=data["module"],
        draw_time=datetime.fromisoformat(data["draw_time"]),
        winner_count=int(data["winner_count"]),
        usdt_prize=data.get("usdt_prize", 0),
        jiucai_prize=data.get("jiucai_prize", 0),
    )
    db.session.add(l)
    db.session.commit()
    return jsonify(l.to_dict()), 201


@admin_bp.post("/lottery/<int:lottery_id>/run")
@require_admin
def run_lottery(lottery_id: int):
    """Run the draw algorithm and send Telegram preview to owner."""
    l = Lottery.query.get_or_404(lottery_id)
    if l.status != "scheduled":
        return jsonify({"error": "lottery not in scheduled state"}), 400

    winners = run_draw(l)
    l.status = "pending_confirm"
    db.session.commit()

    notify_owner_draw_preview(l, winners)
    return jsonify({"ok": True, "winners": [w.to_dict() for w in winners]})


@admin_bp.post("/lottery/<int:lottery_id>/confirm")
@require_admin
def confirm_lottery(lottery_id: int):
    """Confirm draw — triggers on-chain batch payout."""
    l = Lottery.query.get_or_404(lottery_id)
    if l.status != "pending_confirm":
        return jsonify({"error": "lottery not pending confirmation"}), 400

    winners = LotteryWinner.query.filter_by(lottery_id=lottery_id).all()
    tx_hash = send_batch_payout(l, winners)
    l.batch_tx_hash = tx_hash
    l.confirmed_at = datetime.now(timezone.utc)
    l.status = "confirmed"

    pool = Pool.query.first()
    if pool:
        pool.total_usdt_paid_out = (pool.total_usdt_paid_out or 0) + (l.usdt_prize or 0)
        pool.total_jiucai_paid_out = (pool.total_jiucai_paid_out or 0) + (l.jiucai_prize or 0)

    db.session.commit()
    broadcast_draw_result(l, winners)
    return jsonify({"ok": True, "tx_hash": tx_hash})


@admin_bp.post("/lottery/<int:lottery_id>/cancel")
@require_admin
def cancel_lottery(lottery_id: int):
    l = Lottery.query.get_or_404(lottery_id)
    l.status = "cancelled"
    db.session.commit()
    return jsonify({"ok": True})


# ── Claim management ───────────────────────────────────────────────────────────

@admin_bp.get("/claims")
@require_admin
def list_claims():
    status = request.args.get("status", "pending")
    claims = Claim.query.filter_by(status=status).order_by(Claim.created_at).limit(50).all()
    return jsonify([c.to_dict() for c in claims])


@admin_bp.post("/claims/<int:claim_id>/approve")
@require_admin
def approve_claim(claim_id: int):
    from services.chain import send_jiucai
    from datetime import timedelta
    c = Claim.query.get_or_404(claim_id)
    c.status = "approved"
    c.reviewed_at = datetime.now(timezone.utc)
    c.lock_until = datetime.now(timezone.utc) + timedelta(days=20)
    db.session.commit()

    tx = send_jiucai(c.wallet_address, int(c.jiucai_amount or 0))
    c.tx_hash = tx
    c.status = "paid"
    c.paid_at = datetime.now(timezone.utc)
    db.session.commit()
    return jsonify(c.to_dict())


@admin_bp.post("/claims/<int:claim_id>/reject")
@require_admin
def reject_claim(claim_id: int):
    data = request.get_json(silent=True) or {}
    c = Claim.query.get_or_404(claim_id)
    c.status = "rejected"
    c.reject_reason = data.get("reason", "")
    c.reviewed_at = datetime.now(timezone.utc)
    db.session.commit()
    return jsonify(c.to_dict())


# ── Wallet / User management ───────────────────────────────────────────────────

@admin_bp.get("/wallets")
@require_admin
def list_wallets():
    """Query wallets with filters — for Claude to answer data questions."""
    page = request.args.get("page", 1, type=int)
    q = Wallet.query.filter_by(is_blacklisted=False)

    top_pct = request.args.get("top_pct", type=float)
    if top_pct:
        total = Wallet.query.filter_by(is_blacklisted=False).count()
        cutoff = int(total * top_pct / 100)
        q = q.filter(Wallet.holding_rank <= cutoff)

    min_days = request.args.get("min_days", type=int)
    if min_days:
        q = q.filter(Wallet.holding_days >= min_days)

    zero_wins = request.args.get("zero_wins", type=bool)
    if zero_wins:
        q = q.filter(Wallet.win_count == 0)

    wallets = q.order_by(Wallet.holding_rank).paginate(page=page, per_page=50, error_out=False)
    return jsonify({
        "total": wallets.total,
        "page": page,
        "wallets": [w.to_dict() for w in wallets.items],
    })


@admin_bp.post("/wallets/<address>/blacklist")
@require_admin
def blacklist_wallet(address: str):
    data = request.get_json(silent=True) or {}
    w = Wallet.query.filter_by(address=address.lower()).first()
    if not w:
        return jsonify({"error": "not found"}), 404
    w.is_blacklisted = True
    w.blacklist_reason = data.get("reason", "")
    db.session.commit()
    return jsonify({"ok": True})


# ── Announcements ──────────────────────────────────────────────────────────────

@admin_bp.post("/announcements")
@require_admin
def create_announcement():
    data = request.get_json(silent=True) or {}
    a = Announcement(title=data.get("title", ""), content=data.get("content", ""))
    db.session.add(a)
    db.session.commit()
    return jsonify(a.to_dict()), 201


# ── Comments moderation ────────────────────────────────────────────────────────

@admin_bp.post("/comments/<int:comment_id>/pin")
@require_admin
def pin_comment(comment_id: int):
    c = Comment.query.get_or_404(comment_id)
    c.is_pinned = True
    db.session.commit()
    return jsonify({"ok": True})


@admin_bp.post("/comments/<int:comment_id>/hide")
@require_admin
def hide_comment(comment_id: int):
    c = Comment.query.get_or_404(comment_id)
    c.is_hidden = True
    db.session.commit()
    return jsonify({"ok": True})


@admin_bp.post("/comments/<int:comment_id>/official-reply")
@require_admin
def official_reply(comment_id: int):
    data = request.get_json(silent=True) or {}
    content = (data.get("content") or "").strip()
    if not content:
        return jsonify({"error": "content required"}), 400
    reply = Comment(
        wallet_address="official",
        content=content,
        parent_id=comment_id,
        is_official=True,
        is_pinned=False,
    )
    db.session.add(reply)
    db.session.commit()
    return jsonify(reply.to_dict())


# ── Stats ──────────────────────────────────────────────────────────────────────

@admin_bp.get("/stats")
@require_admin
def stats():
    from sqlalchemy import func
    from models import Pool
    pool = Pool.query.first()
    total_wallets = Wallet.query.filter_by(is_blacklisted=False).count()
    tg_bound = Wallet.query.filter(Wallet.telegram_chat_id.isnot(None)).count()
    pending_claims = Claim.query.filter_by(status="pending").count()

    return jsonify({
        "total_wallets": total_wallets,
        "telegram_bound": tg_bound,
        "pending_claims": pending_claims,
        "pool": pool.to_dict() if pool else {},
    })
