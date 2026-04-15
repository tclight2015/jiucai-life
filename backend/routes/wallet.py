import secrets
from datetime import datetime, timezone
from flask import Blueprint, jsonify, request
from models import db, Wallet, UserCard
from services.chain import get_jiucai_balance

wallet_bp = Blueprint("wallet", __name__, url_prefix="/api/wallet")


def _get_or_create_wallet(address: str) -> Wallet:
    address = address.lower()
    w = Wallet.query.filter_by(address=address).first()
    if not w:
        w = Wallet(
            address=address,
            has_connected_website=True,
            referral_code=secrets.token_hex(8),
        )
        db.session.add(w)
    else:
        w.has_connected_website = True
    w.last_seen = datetime.now(timezone.utc)
    db.session.commit()
    return w


@wallet_bp.post("/connect")
def connect():
    """Called when user connects wallet on the frontend."""
    data = request.get_json(silent=True) or {}
    address = (data.get("address") or "").strip()
    if not address or len(address) != 42:
        return jsonify({"error": "invalid address"}), 400

    w = _get_or_create_wallet(address)

    # Refresh balance from chain (non-blocking best-effort)
    try:
        bal = get_jiucai_balance(address)
        if bal is not None:
            w.jiucai_balance = bal
            if bal > 0 and not w.holding_start:
                w.holding_start = datetime.now(timezone.utc)
            db.session.commit()
    except Exception:
        pass

    # Handle referral
    ref_code = data.get("ref")
    if ref_code and not w.referred_by:
        referrer = Wallet.query.filter_by(referral_code=ref_code).first()
        if referrer and referrer.address != address:
            w.referred_by = referrer.address
            db.session.commit()

    return jsonify(w.to_dict())


@wallet_bp.get("/<address>")
def get_wallet(address: str):
    address = address.lower()
    w = Wallet.query.filter_by(address=address).first()
    if not w:
        return jsonify({"error": "not found"}), 404
    return jsonify(w.to_dict())


@wallet_bp.get("/<address>/cards")
def get_cards(address: str):
    address = address.lower()
    cards = UserCard.query.filter_by(wallet_address=address).all()
    return jsonify([c.to_dict() for c in cards if c.is_active()])


@wallet_bp.post("/<address>/cards/<int:card_id>/enable")
def set_card_enabled(address: str, card_id: int):
    address = address.lower()
    data = request.get_json(silent=True) or {}
    qty = int(data.get("quantity", 0))
    card = UserCard.query.filter_by(id=card_id, wallet_address=address).first()
    if not card:
        return jsonify({"error": "not found"}), 404
    card.enabled_quantity = max(0, min(qty, card.quantity))
    db.session.commit()
    return jsonify(card.to_dict())


@wallet_bp.post("/<address>/telegram")
def bind_telegram(address: str):
    address = address.lower()
    data = request.get_json(silent=True) or {}
    chat_id = str(data.get("chat_id") or "").strip()
    if not chat_id:
        return jsonify({"error": "chat_id required"}), 400
    w = Wallet.query.filter_by(address=address).first()
    if not w:
        return jsonify({"error": "wallet not found"}), 404
    w.telegram_chat_id = chat_id
    w.telegram_bound_at = datetime.now(timezone.utc)
    db.session.commit()
    return jsonify({"ok": True})


@wallet_bp.post("/<address>/iron-fan")
def iron_fan_purchase(address: str):
    """Record a daily 0.1U iron-fan purchase."""
    address = address.lower()
    w = Wallet.query.filter_by(address=address).first()
    if not w:
        return jsonify({"error": "wallet not found"}), 404

    now = datetime.now(timezone.utc)
    last = w.iron_fan_last_purchase
    if last and last.date() == now.date():
        return jsonify({"error": "already purchased today", "done": True}), 400

    # Reset if new month
    if last and (last.year != now.year or last.month != now.month):
        w.iron_fan_days_this_month = 0

    w.iron_fan_days_this_month = (w.iron_fan_days_this_month or 0) + 1
    w.iron_fan_last_purchase = now
    db.session.commit()
    return jsonify({"iron_fan_days": w.iron_fan_days_this_month, "weight": w.iron_fan_weight()})
