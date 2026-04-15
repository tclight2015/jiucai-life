from flask import Blueprint, jsonify, request
from models import db, Claim, Wallet
from services.auto_review import auto_review_claim

claim_bp = Blueprint("claim", __name__, url_prefix="/api/claim")


@claim_bp.post("/submit")
def submit_claim():
    """User submits a claim with screenshot URL."""
    data = request.get_json(silent=True) or {}
    address = (data.get("address") or "").lower().strip()
    screenshot_url = (data.get("screenshot_url") or "").strip()

    if not address or len(address) != 42:
        return jsonify({"error": "invalid address"}), 400
    if not screenshot_url:
        return jsonify({"error": "screenshot_url required"}), 400

    # One claim per wallet
    existing = Claim.query.filter_by(wallet_address=address).first()
    if existing:
        return jsonify({"error": "already submitted", "status": existing.status}), 409

    # Queue position
    queue_pos = Claim.query.filter(Claim.status == "pending").count() + 1

    claim = Claim(
        wallet_address=address,
        screenshot_url=screenshot_url,
        status="pending",
        queue_position=queue_pos,
    )
    db.session.add(claim)
    db.session.commit()

    # Auto review (sets loss_amount and jiucai_amount)
    try:
        auto_review_claim(claim)
        db.session.commit()
    except Exception:
        pass

    return jsonify(claim.to_dict()), 201


@claim_bp.get("/status/<address>")
def claim_status(address: str):
    address = address.lower()
    claim = Claim.query.filter_by(wallet_address=address).first()
    if not claim:
        return jsonify({"error": "not found"}), 404
    return jsonify(claim.to_dict())
