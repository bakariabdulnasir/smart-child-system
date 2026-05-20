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

    school = db.Column(
        db.String(200),
        nullable=True
    )

    medical_notes = db.Column(
        db.Text,
        nullable=True
    )

    allergies = db.Column(
        db.Text,
        nullable=True
    )

    emergency_contact = db.Column(
        db.String(150),
        nullable=True
    )

    emergency_phone = db.Column(
        db.String(50),
        nullable=True
    )

    created_at = db.Column(
        db.DateTime,
        default=db.func.current_timestamp()
    )

    updated_at = db.Column(
        db.DateTime,
        default=db.func.current_timestamp(),
        onupdate=db.func.current_timestamp()
    )

    def __repr__(self):

        return f"<Child {self.full_name}>"
