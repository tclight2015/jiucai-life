from flask import Blueprint, jsonify, request
from models import db, Comment, Wallet

comment_bp = Blueprint("comment", __name__, url_prefix="/api/comments")


@comment_bp.get("/")
def list_comments():
    page = request.args.get("page", 1, type=int)
    per_page = 30
    pinned = Comment.query.filter_by(is_pinned=True, is_hidden=False, parent_id=None).all()
    regular = (
        Comment.query
        .filter_by(is_pinned=False, is_hidden=False, parent_id=None)
        .order_by(Comment.created_at.desc())
        .paginate(page=page, per_page=per_page, error_out=False)
    )
    return jsonify({
        "pinned": [c.to_dict(include_replies=True) for c in pinned],
        "comments": [c.to_dict(include_replies=True) for c in regular.items],
        "total": regular.total,
        "page": page,
        "pages": regular.pages,
    })


@comment_bp.post("/")
def post_comment():
    data = request.get_json(silent=True) or {}
    address = (data.get("address") or "").lower().strip()
    content = (data.get("content") or "").strip()
    parent_id = data.get("parent_id")

    if not address or len(address) != 42:
        return jsonify({"error": "invalid address"}), 400
    if not content or len(content) > 500:
        return jsonify({"error": "content required, max 500 chars"}), 400

    w = Wallet.query.filter_by(address=address).first()
    if not w or not w.jiucai_balance or int(w.jiucai_balance) == 0:
        return jsonify({"error": "must hold JIUCAI to comment"}), 403

    c = Comment(
        wallet_address=address,
        content=content,
        parent_id=parent_id,
    )
    db.session.add(c)
    db.session.commit()
    return jsonify(c.to_dict()), 201
