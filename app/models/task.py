from app.extensions.extensions import db


class Task(db.Model):

    __tablename__ = "tasks"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    title = db.Column(
        db.String(255),
        nullable=False
    )

    description = db.Column(
        db.Text
    )

    completed = db.Column(
        db.Boolean,
        default=False
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