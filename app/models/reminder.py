from datetime import datetime

from app.extensions.extensions import db


class Reminder(db.Model):

    __tablename__ = "reminders"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    title = db.Column(
        db.String(150),
        nullable=False
    )

    message = db.Column(
        db.Text,
        nullable=False
    )

    reminder_time = db.Column(
        db.DateTime,
        nullable=False
    )

    is_sent = db.Column(
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
        back_populates="reminders"
    )

    def __repr__(self):

        return f"<Reminder {self.title}>"