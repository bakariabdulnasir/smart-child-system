from flask import request

from marshmallow import ValidationError

from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity
)

from app.extensions.extensions import db

from app.models.user import User
from app.models.role import Role

from app.schemas.user_schema import (
    UserRegisterSchema
)

from app.schemas.login_schema import (
    LoginSchema
)

from app.services.auth_service import (
    hash_password,
    verify_password
)

from app.utils.response import (
    success_response,
    error_response
)


register_schema = UserRegisterSchema()

login_schema = LoginSchema()


# REGISTER USER

def register_user():

    try:

        data = request.get_json()

        validated_data = register_schema.load(data)

        existing_user = User.query.filter_by(
            email=validated_data["email"]
        ).first()

        if existing_user:

            return error_response(
                message="Email already exists",
                status_code=400
            )

        role_name = validated_data["role"]

        role = Role.query.filter_by(
            name=role_name
        ).first()

        if not role:

            return error_response(
                message="Role not found",
                status_code=404
            )

        hashed_password = hash_password(
            validated_data["password"]
        )

        new_user = User(
            full_name=validated_data["full_name"],
            email=validated_data["email"],
            password_hash=hashed_password,
            role=role
        )

        db.session.add(new_user)

        db.session.commit()

        return success_response(
            message="User registered successfully",
            data={
                "user": {
                    "id": new_user.id,
                    "full_name": new_user.full_name,
                    "email": new_user.email,
                    "role": new_user.role.name
                }
            },
            status_code=201
        )

    except ValidationError as err:

        return error_response(
            message="Validation failed",
            errors=err.messages,
            status_code=400
        )

    except Exception as e:

        return error_response(
            message="Registration failed",
            errors=str(e),
            status_code=500
        )


# LOGIN USER

def login_user():

    try:

        data = request.get_json()

        validated_data = login_schema.load(data)

        user = User.query.filter_by(
            email=validated_data["email"]
        ).first()

        if not user:

            return error_response(
                message="Invalid email or password",
                status_code=401
            )

        password_valid = verify_password(
            user.password_hash,
            validated_data["password"]
        )

        if not password_valid:

            return error_response(
                message="Invalid email or password",
                status_code=401
            )

        access_token = create_access_token(
            identity=str(user.id),
            additional_claims={
                "role": user.role.name
            }
        )

        return success_response(
            message="Login successful",
            data={
                "access_token": access_token,
                "user": {
                    "id": user.id,
                    "full_name": user.full_name,
                    "email": user.email,
                    "role": user.role.name
                }
            },
            status_code=200
        )

    except ValidationError as err:

        return error_response(
            message="Validation failed",
            errors=err.messages,
            status_code=400
        )

    except Exception as e:

        return error_response(
            message="Login failed",
            errors=str(e),
            status_code=500
        )


# PROTECTED ROUTE

def protected_route():

    current_user_id = get_jwt_identity()

    return success_response(
        message="Access granted",
        data={
            "user_id": current_user_id
        },
        status_code=200
    )


# LOGOUT USER

def logout_user():

    return success_response(
        message="Logout successful",
        status_code=200
    )