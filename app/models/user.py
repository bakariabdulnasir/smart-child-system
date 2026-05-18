from datetime import datetime

from app.extensions.extensions import db


class User(db.Model):

    __tablename__ = "users"

    id = db.Column(
        db.Integer,
        primary_key=True
    )

    full_name = db.Column(
        db.String(150),
        nullable=False
    )

    email = db.Column(
        db.String(120),
        unique=True,
        nullable=False
    )

    password_hash = db.Column(
        db.String(255),
        nullable=False
    )

    is_active = db.Column(
        db.Boolean,
        default=True
    )

    created_at = db.Column(
        db.DateTime,
        default=datetime.utcnow
    )

    # ROLE RELATIONSHIP

    role_id = db.Column(
        db.Integer,
        db.ForeignKey("roles.id"),
        nullable=False
    )

    role = db.relationship(
        "Role",
        back_populates="users"
    )

    # PASSWORD RESET

    reset_password_token = db.Column(
        db.String(255),
        nullable=True
    )

    reset_password_expires = db.Column(
        db.DateTime,
        nullable=True
    )

    # RELATIONSHIPS

    children = db.relationship(
        "Child",
        back_populates="parent",
        cascade="all, delete"
    )

    schedules = db.relationship(
        "Schedule",
        back_populates="user",
        cascade="all, delete"
    )

    reminders = db.relationship(
        "Reminder",
        back_populates="user",
        cascade="all, delete"
    )

    events = db.relationship(
        "Event",
        back_populates="user",
        cascade="all, delete"
    )

    notifications = db.relationship(
        "Notification",
        back_populates="user",
        cascade="all, delete"
    )


    trusted_contacts = db.relationship(
    "TrustedContact",
    back_populates="user",
    cascade="all, delete"
)
    

    support_requests = db.relationship(
    "SupportRequest",
    back_populates="user",
    cascade="all, delete"
)
    
    profile_image = db.Column(
    db.String(255),
    nullable=True
)

    def __repr__(self):

        return f"<User {self.email}>"