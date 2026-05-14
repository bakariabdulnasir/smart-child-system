from flask import request

from marshmallow import ValidationError

from flask_jwt_extended import (
    get_jwt_identity
)

from app.models.user import User

from app.extensions.extensions import db

from app.schemas.profile_schema import (
    UpdateProfileSchema,
    ChangePasswordSchema
)

from app.services.auth_service import (
    hash_password,
    verify_password
)

from app.utils.response import (
    success_response,
    error_response
)


update_profile_schema = UpdateProfileSchema()

change_password_schema = ChangePasswordSchema()


# GET CURRENT USER PROFILE

def get_my_profile():

    current_user_id = get_jwt_identity()

    user = User.query.get(current_user_id)

    if not user:

        return error_response(
            message="User not found",
            status_code=404
        )

    return success_response(
        message="Profile retrieved successfully",
        data={
            "user": {
                "id": user.id,
                "full_name": user.full_name,
                "email": user.email,
                "role": user.role.name,
                "is_active": user.is_active,
                "created_at": user.created_at
            }
        },
        status_code=200
    )


# UPDATE PROFILE

def update_my_profile():

    try:

        current_user_id = get_jwt_identity()

        user = User.query.get(current_user_id)

        if not user:

            return error_response(
                message="User not found",
                status_code=404
            )

        data = request.get_json()

        validated_data = update_profile_schema.load(data)

        if "email" in validated_data:

            existing_user = User.query.filter_by(
                email=validated_data["email"]
            ).first()

            if existing_user and existing_user.id != user.id:

                return error_response(
                    message="Email already exists",
                    status_code=400
                )

            user.email = validated_data["email"]

        if "full_name" in validated_data:

            user.full_name = validated_data["full_name"]

        db.session.commit()

        return success_response(
            message="Profile updated successfully",
            data={
                "user": {
                    "id": user.id,
                    "full_name": user.full_name,
                    "email": user.email
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
            message="Profile update failed",
            errors=str(e),
            status_code=500
        )


# CHANGE PASSWORD

def change_password():

    try:

        current_user_id = get_jwt_identity()

        user = User.query.get(current_user_id)

        if not user:

            return error_response(
                message="User not found",
                status_code=404
            )

        data = request.get_json()

        validated_data = change_password_schema.load(data)

        password_correct = verify_password(
            user.password_hash,
            validated_data["current_password"]
        )

        if not password_correct:

            return error_response(
                message="Current password is incorrect",
                status_code=400
            )

        new_hashed_password = hash_password(
            validated_data["new_password"]
        )

        user.password_hash = new_hashed_password

        db.session.commit()

        return success_response(
            message="Password changed successfully",
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
            message="Password change failed",
            errors=str(e),
            status_code=500
        )