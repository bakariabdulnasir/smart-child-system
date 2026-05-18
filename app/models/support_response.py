from datetime import datetime

from app.extensions.extensions import db


class SupportResponse(db.Model):

    __tablename__ = "support_responses"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    message = db.Column(
        db.Text,
        nullable=False
    )

    status = db.Column(
        db.String(50),
        default="pending"
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    support_request_id = db.Column(
        db.Integer,
        db.ForeignKey("support_requests.id"),
        nullable=False
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    support_request = db.relationship(
        "SupportRequest",
        back_populates="responses"
    )

    user = db.relationship(
        "User"
    )

    def __repr__(self):

        return f"<SupportResponse {self.id}>"