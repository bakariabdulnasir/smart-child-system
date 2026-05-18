from datetime import datetime

from app.extensions.extensions import db


class TrustedContact(db.Model):

    __tablename__ = "trusted_contacts"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    full_name = db.Column(
        db.String(150),
        nullable=False
    )

    phone_number = db.Column(
        db.String(20),
        nullable=False
    )

    email = db.Column(
        db.String(120),
        nullable=True
    )

    relationship = db.Column(
        db.String(100),
        nullable=False
    )

    address = db.Column(
        db.String(255),
        nullable=True
    )

    is_emergency_contact = db.Column(
        db.Boolean,
        default=False
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
        back_populates="trusted_contacts"
    )

    def __repr__(self):

        return f"<TrustedContact {self.full_name}>"