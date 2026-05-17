from datetime import datetime

from app.extensions.extensions import db


class Schedule(db.Model):

    __tablename__ = "schedules"

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
        nullable=True
    )

    start_time = db.Column(
        db.DateTime,
        nullable=False
    )

    end_time = db.Column(
        db.DateTime,
        nullable=False
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    child_id = db.Column(
        db.Integer,
        db.ForeignKey("children.id"),
        nullable=False
    )

    user_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    child = db.relationship(
        "Child",
        back_populates="schedules"
    )

    user = db.relationship(
        "User",
        back_populates="schedules"
    )

    def __repr__(self):

        return f"<Schedule {self.title}>"