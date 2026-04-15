from datetime import datetime, timezone
from .db import db


class Comment(db.Model):
    __tablename__ = "comments"

    id = db.Column(db.Integer, primary_key=True)
    wallet_address = db.Column(db.String(42), nullable=False, index=True)
    content = db.Column(db.String(500), nullable=False)

    parent_id = db.Column(db.Integer, db.ForeignKey("comments.id"), nullable=True)
    replies = db.relationship("Comment", backref=db.backref("parent", remote_side=[id]), lazy=True)

    is_pinned = db.Column(db.Boolean, default=False)
    is_official = db.Column(db.Boolean, default=False)  # 🌿官方
    is_hidden = db.Column(db.Boolean, default=False)    # moderated

    created_at = db.Column(db.DateTime(timezone=True), default=lambda: datetime.now(timezone.utc))

    def to_dict(self, include_replies=False):
        addr = self.wallet_address
        d = {
            "id": self.id,
            "author": "🌿官方" if self.is_official else f"{addr[:6]}...{addr[-4:]}",
            "content": self.content,
            "is_pinned": self.is_pinned,
            "is_official": self.is_official,
            "parent_id": self.parent_id,
            "created_at": self.created_at.isoformat() if self.created_at else None,
        }
        if include_replies:
            d["replies"] = [r.to_dict() for r in self.replies if not r.is_hidden]
        return d
