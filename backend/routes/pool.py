from flask import Blueprint, jsonify
from models import Pool

pool_bp = Blueprint("pool", __name__, url_prefix="/api/pool")


@pool_bp.get("")
@pool_bp.get("/")
def get_pool():
    """Current prize pool balances — used by homepage CoinPile."""
    pool = Pool.query.first()
    if not pool:
        return jsonify({"usdt": "0", "jiucai": "0", "total_usdt_paid_out": "0", "total_jiucai_paid_out": "0"})
    return jsonify({
        "usdt": str(pool.usdt_balance or 0),
        "jiucai": str(pool.jiucai_prize_balance or 0),
        "total_usdt_paid_out": str(pool.total_usdt_paid_out or 0),
        "total_jiucai_paid_out": str(pool.total_jiucai_paid_out or 0),
        "updated_at": pool.updated_at.isoformat() if pool.updated_at else None,
    })
