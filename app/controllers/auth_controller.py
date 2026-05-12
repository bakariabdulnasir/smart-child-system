from flask import request, jsonify

from marshmallow import ValidationError

from app.extensions.extensions import db

from app.models.user import User

from app.schemas.user_schema import UserRegisterSchema

from app.services.auth_service import hash_password

from flask_jwt_extended import ( create_access_token,  jwt_required, get_jwt_identity )

from app.schemas.login_schema import LoginSchema

from app.services.auth_service import ( hash_password, verify_password )


register_schema = UserRegisterSchema()

login_schema = LoginSchema()

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
    

def login_user():

    try:

        data = request.get_json()

        validated_data = login_schema.load(data)

        user = User.query.filter_by(
            email=validated_data["email"]
        ).first()

        if not user:

            return jsonify({
                "error": "Invalid email or password"
            }), 401

        password_valid = verify_password(
            user.password_hash,
            validated_data["password"]
        )

        if not password_valid:

            return jsonify({
                "error": "Invalid email or password"
            }), 401

        access_token = create_access_token(
            identity=str(user.id)
        )

        return jsonify({
            "message": "Login successful",
            "access_token": access_token,
            "user": {
                "id": user.id,
                "full_name": user.full_name,
                "email": user.email
            }
        }), 200

    except Exception as e:

        return jsonify({
            "error": str(e)
        }), 500    
    
def protected_route():

    current_user_id = get_jwt_identity()

    return jsonify({
        "message": "Access granted",
        "user_id": current_user_id
    }), 200


def logout_user():

    return jsonify({
        "message": "Logout successful"
    }), 200
