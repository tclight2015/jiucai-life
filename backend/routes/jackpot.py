"""
韭菜樂透 public API
"""
import random
from datetime import date, datetime, timezone
from flask import Blueprint, jsonify, request
from models import db, PowerballDraw, JiucaiTicket, Wallet

jackpot_bp = Blueprint("jackpot", __name__, url_prefix="/api/jackpot")

# ── helpers ────────────────────────────────────────────────────────────────────

def _current_week_year():
    """Return (jiucai_week, jiucai_year) for today.
    Week resets every Jan 1; week 1 = first Saturday after Jan 1.
    We use ISO week number for simplicity.
    """
    today = date.today()
    return today.isocalendar()[1], today.year


def _generate_numbers() -> list[int]:
    """5 unique numbers from 1-69, sorted."""
    return sorted(random.sample(range(1, 70), 5))


# ── public info ────────────────────────────────────────────────────────────────

@jackpot_bp.get("")
def jackpot_info():
    """General info: rules, current week, launch status."""
    week, year = _current_week_year()
    latest_draw = (
        PowerballDraw.query
        .filter_by(processed=True)
        .order_by(PowerballDraw.draw_date.desc())
        .first()
    )
    return jsonify({
        "launch_status": "coming_soon",   # change to "active" when launched
        "launch_month": "2026年第三季",   # update before launch
        "current_week": week,
        "current_year": year,
        "latest_draw": latest_draw.to_dict() if latest_draw else None,
        "rules": {
            "match_required": 3,
            "numbers_range": "1–69",
            "ticket_per_week": 1,
            "max_tickets": 52,
            "reset": "每年12月31日清空，元旦重新開始",
            "reference": "美國 Powerball 主球（忽略強力球）",
            "powerball_url": "https://www.powerball.com/winning-numbers",
        },
        "prize_note": "獎金視屆時獎池狀況決定，保留調整機制",
    })


@jackpot_bp.get("/draws")
def list_draws():
    """Recent processed draws (public, no auth needed)."""
    limit = request.args.get("limit", 10, type=int)
    draws = (
        PowerballDraw.query
        .filter_by(processed=True)
        .order_by(PowerballDraw.draw_date.desc())
        .limit(limit)
        .all()
    )
    return jsonify({"draws": [d.to_dict() for d in draws]})


@jackpot_bp.get("/tickets/<address>")
def wallet_tickets(address: str):
    """All tickets for a wallet address (used by personal profile page)."""
    address = address.lower()
    year = request.args.get("year", date.today().year, type=int)
    tickets = (
        JiucaiTicket.query
        .filter_by(wallet_address=address, jiucai_year=year)
        .order_by(JiucaiTicket.jiucai_week.desc())
        .all()
    )
    total = len(tickets)
    # Probability estimate: P(≥3 match from 5 of 69) ≈ 1/580 per ticket
    probability_pct = round(total / 580 * 100, 2) if total else 0
    return jsonify({
        "address": f"{address[:6]}...{address[-4:]}",
        "year": year,
        "total_tickets": total,
        "probability_pct": probability_pct,
        "tickets": [t.to_dict() for t in tickets],
    })


# ── admin endpoints (called by scheduler / admin) ─────────────────────────────

@jackpot_bp.post("/admin/issue-weekly-tickets")
def issue_weekly_tickets():
    """Issue one ticket to every eligible wallet for the current week.
    Protected by ADMIN_TOKEN.
    """
    import os
    auth = request.headers.get("Authorization", "")
    if auth != f"Bearer {os.getenv('ADMIN_TOKEN', '')}":
        return jsonify({"error": "unauthorized"}), 401

    week, year = _current_week_year()
    wallets = Wallet.query.filter_by(is_blacklisted=False).all()
    issued = 0
    skipped = 0

    for w in wallets:
        exists = JiucaiTicket.query.filter_by(
            wallet_address=w.address, jiucai_year=year, jiucai_week=week
        ).first()
        if exists:
            skipped += 1
            continue
        ticket = JiucaiTicket(
            wallet_address=w.address,
            jiucai_week=week,
            jiucai_year=year,
            numbers=_generate_numbers(),
        )
        db.session.add(ticket)
        issued += 1

    db.session.commit()
    return jsonify({"ok": True, "issued": issued, "skipped": skipped, "week": week, "year": year})


@jackpot_bp.post("/admin/process-draw")
def process_draw():
    """Record a Powerball draw result and match all tickets.
    Body: { draw_number, draw_date, numbers: [int×5] }
    Protected by ADMIN_TOKEN.
    """
    import os
    auth = request.headers.get("Authorization", "")
    if auth != f"Bearer {os.getenv('ADMIN_TOKEN', '')}":
        return jsonify({"error": "unauthorized"}), 401

    data = request.get_json(silent=True) or {}
    draw_number = data.get("draw_number")
    draw_date_str = data.get("draw_date")   # "YYYY-MM-DD"
    numbers = sorted(data.get("numbers", []))

    if not draw_number or not draw_date_str or len(numbers) != 5:
        return jsonify({"error": "需要 draw_number, draw_date, numbers (5顆)"}), 400

    draw_date = date.fromisoformat(draw_date_str)
    week = draw_date.isocalendar()[1]
    year = draw_date.year

    # Avoid duplicate
    existing = PowerballDraw.query.filter_by(draw_number=str(draw_number)).first()
    if existing:
        return jsonify({"error": "此期已存在"}), 409

    draw = PowerballDraw(
        draw_number=str(draw_number),
        draw_date=draw_date,
        numbers=numbers,
        jiucai_week=week,
        jiucai_year=year,
    )
    db.session.add(draw)
    db.session.flush()  # get draw.id

    # Match all tickets for this week
    tickets = JiucaiTicket.query.filter_by(
        jiucai_year=year, jiucai_week=week
    ).all()

    number_set = set(numbers)
    winners = []
    for t in tickets:
        matched = len(set(t.numbers) & number_set)
        t.matched_count = matched
        t.powerball_draw_id = draw.id
        if matched >= 3:
            t.is_winner = True
            winners.append(t)

    draw.processed = True
    draw.winner_count = len(winners)
    db.session.commit()

    return jsonify({
        "ok": True,
        "draw_id": draw.id,
        "week": week,
        "year": year,
        "tickets_matched": len(tickets),
        "winners": len(winners),
        "winner_addresses": [w.wallet_address for w in winners],
    })
