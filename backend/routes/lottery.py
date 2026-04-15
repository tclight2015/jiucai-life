from flask import Blueprint, jsonify, request
from models import db, Lottery, LotteryWinner

lottery_bp = Blueprint("lottery", __name__, url_prefix="/api/lottery")


@lottery_bp.get("/")
def list_lotteries():
    """Public list of upcoming + recent lotteries (for calendar page)."""
    lotteries = (
        Lottery.query
        .filter(Lottery.status != "cancelled")
        .order_by(Lottery.draw_time.asc())
        .limit(20)
        .all()
    )
    return jsonify([l.to_dict() for l in lotteries])


@lottery_bp.get("/<int:lottery_id>")
def get_lottery(lottery_id: int):
    l = Lottery.query.get_or_404(lottery_id)
    return jsonify(l.to_dict(include_winners=(l.status in ("confirmed", "paid"))))


@lottery_bp.get("/<int:lottery_id>/winners")
def get_winners(lottery_id: int):
    winners = LotteryWinner.query.filter_by(lottery_id=lottery_id).all()
    return jsonify([w.to_dict() for w in winners])


@lottery_bp.get("/wallet/<address>")
def wallet_history(address: str):
    """Full win history for a wallet address (public, any address queryable)."""
    address = address.lower()
    wins = (
        LotteryWinner.query
        .filter_by(wallet_address=address)
        .order_by(LotteryWinner.created_at.desc())
        .all()
    )
    total_usdt = sum(float(w.usdt_amount or 0) for w in wins)
    total_jiucai = sum(int(w.jiucai_amount or 0) for w in wins)
    return jsonify({
        "address": address,
        "win_count": len(wins),
        "total_usdt": str(total_usdt),
        "total_jiucai": str(total_jiucai),
        "history": [w.to_dict() for w in wins],
    })


@lottery_bp.get("/leaderboard")
def leaderboard():
    """Top winners by cumulative USDT received."""
    from sqlalchemy import func
    from models import db
    rows = (
        db.session.query(
            LotteryWinner.wallet_address,
            func.sum(LotteryWinner.usdt_amount).label("total_usdt"),
            func.sum(LotteryWinner.jiucai_amount).label("total_jiucai"),
            func.count(LotteryWinner.id).label("win_count"),
        )
        .group_by(LotteryWinner.wallet_address)
        .order_by(func.sum(LotteryWinner.usdt_amount).desc())
        .limit(100)
        .all()
    )
    addr = lambda a: f"{a[:6]}...{a[-4:]}"
    return jsonify([
        {
            "rank": i + 1,
            "address": addr(r.wallet_address),
            "total_usdt": str(r.total_usdt or 0),
            "total_jiucai": str(r.total_jiucai or 0),
            "win_count": r.win_count,
        }
        for i, r in enumerate(rows)
    ])
