from datetime import datetime

from app.extensions.extensions import db


class SupportRequest(db.Model):

    __tablename__ = "support_requests"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    title = db.Column(
        db.String(150),
        nullable=False
    )

    description = db.Column(
        db.Text,
        nullable=False
    )

    request_type = db.Column(
        db.String(100),
        nullable=False
    )

    location = db.Column(
        db.String(255),
        nullable=False
    )

    status = db.Column(
        db.String(50),
        default="open"
    )

    needed_at = db.Column(
        db.DateTime,
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    user = db.relationship(
        "User",
        back_populates="support_requests"
    )

    responses = db.relationship(
        "SupportResponse",
        back_populates="support_request",
        cascade="all, delete"
    )

    def __repr__(self):

        return f"<SupportRequest {self.title}>"