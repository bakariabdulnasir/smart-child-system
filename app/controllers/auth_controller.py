from flask import request, jsonify

from app.extensions.extensions import db
from app.models.user import User

from app.services.auth_service import hash_password


def register_user():

    data = request.get_json()

    full_name = data.get("full_name")
    email = data.get("email")
    password = data.get("password")

    hashed_password = hash_password(password)

    new_user = User(
        full_name=full_name,
        email=email,
        password_hash=hashed_password
    )

    db.session.add(new_user)
    db.session.commit()

    return jsonify({
        "message": "User registered successfully"
    }), 201