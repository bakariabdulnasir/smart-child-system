from datetime import datetime

from app.extensions.extensions import db


class Task(db.Model):

    __tablename__ = "tasks"

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

    status = db.Column(
        db.String(50),
        default="pending"
    )

    priority = db.Column(
        db.String(50),
        default="medium"
    )

    due_date = db.Column(
        db.Date,
        nullable=True
    )

    completed_at = db.Column(
        db.DateTime,
        nullable=True
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

    child = db.relationship(
        "Child",
        back_populates="tasks"
    )

    def __repr__(self):

        return f"<Task {self.title}>"