from flask import request

from marshmallow import ValidationError

from flask_jwt_extended import (
    create_access_token,
    get_jwt_identity
)

from app.extensions.extensions import db

from app.models.user import User
from app.models.role import Role

from app.schemas.user_schema import UserRegisterSchema
from app.schemas.login_schema import LoginSchema

from app.schemas.forgot_password_schema import (
    forgot_password_schema,
    reset_password_schema
)

from app.services.auth_service import (
    hash_password,
    verify_password,
    request_password_reset,
    reset_password as service_reset_password
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

# Use default role if not provided
        role_name = validated_data.get("role", "parent")

        role = Role.query.filter_by(
            name=role_name
        ).first()

        # If role not found, use parent as default
        if not role:
            role = Role.query.filter_by(name="parent").first()
            
        if not role:
            return error_response(
                message="Default role not found",
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


# FORGOT PASSWORD

def forgot_password():

    try:

        data = request.get_json()

        validated_data = forgot_password_schema.load(data)

        success, message = request_password_reset(
            validated_data["email"]
        )

        if not success:

            return error_response(
                message=message,
                status_code=400
            )

        return success_response(
            message=message,
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
            message="An error occurred. Please try again.",
            errors=str(e),
            status_code=500
        )


# RESET PASSWORD

def reset_password():

    try:

        data = request.get_json()

        validated_data = reset_password_schema.load(data)

        success, message = service_reset_password(
            validated_data["token"],
            validated_data["password"]
        )

        if not success:

            return error_response(
                message=message,
                status_code=400
            )

        return success_response(
            message=message,
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
            message="An error occurred. Please try again.",
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


# VALIDATE TOKEN

def validate_token():

    try:

        current_user_id = get_jwt_identity()

        user = User.query.get(int(current_user_id))

        if not user:

            return error_response(
                message="User not found",
                status_code=404
            )

        return success_response(
            message="Token valid",
            data={
                "id": user.id,
                "full_name": user.full_name,
                "email": user.email,
                "role": user.role.name
            },
            status_code=200
        )

    except Exception as e:

        return error_response(
            message="Token validation failed",
            errors=str(e),
            status_code=401
        )
