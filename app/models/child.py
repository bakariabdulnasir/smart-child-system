from app.extensions.extensions import db


class Child(db.Model):

    __tablename__ = "children"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    full_name = db.Column(
        db.String(150),
        nullable=False
    )

    age = db.Column(
        db.Integer,
        nullable=False
    )

    gender = db.Column(
        db.String(20),
        nullable=False
    )

    parent_id = db.Column(
        db.Integer,
        db.ForeignKey("users.id"),
        nullable=False
    )

    parent = db.relationship(
        "User",
        back_populates="children"
    )

    tasks = db.relationship(
        "Task",
        back_populates="child",
        cascade="all, delete"
    )

    schedules = db.relationship(
        "Schedule",
        back_populates="child",
        cascade="all, delete"
    )


    profile_image = db.Column(
    db.String(255),
    nullable=True
)

    def __repr__(self):

        return f"<Child {self.full_name}>"