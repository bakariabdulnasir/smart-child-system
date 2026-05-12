from flask import request, jsonify

from marshmallow import ValidationError

from app.extensions.extensions import db

from app.models.user import User

from app.schemas.user_schema import UserRegisterSchema

from app.services.auth_service import hash_password


register_schema = UserRegisterSchema()


def register_user():

    try:

        data = request.get_json()

        validated_data = register_schema.load(data)

        existing_user = User.query.filter_by(
            email=validated_data["email"]
        ).first()

        if existing_user:

            return jsonify({
                "error": "Email already exists"
            }), 400

        hashed_password = hash_password(
            validated_data["password"]
        )

        new_user = User(
            full_name=validated_data["full_name"],
            email=validated_data["email"],
            password_hash=hashed_password
        )

        db.session.add(new_user)
        db.session.commit()

        return jsonify({
            "message": "User registered successfully"
        }), 201

    except ValidationError as err:

        return jsonify({
            "errors": err.messages
        }), 400

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500