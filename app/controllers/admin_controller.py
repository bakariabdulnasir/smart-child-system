from flask import request

from app.models.role import Role

from app.models.user import User

from app.extensions.extensions import db

from app.utils.response import (
    success_response,
    error_response
)



# GET ALL USERS

def get_all_users():

    users = User.query.all()

    users_data = []

    for user in users:

        users_data.append({
            "id": user.id,
            "full_name": user.full_name,
            "email": user.email,
            "role": user.role.name,
            "is_active": user.is_active
        })

    return success_response(
        message="Users retrieved successfully",
        data={
            "users": users_data
        },
        status_code=200
    )


# DELETE USER

def delete_user(user_id):

    user = User.query.get(user_id)

    if not user:

        return error_response(
            message="User not found",
            status_code=404
        )

    db.session.delete(user)

    db.session.commit()

    return success_response(
        message="User deleted successfully",
        status_code=200
    )


# CHANGE USER ROLE

def update_user_role(user_id):

    user = User.query.get(user_id)

    if not user:

        return error_response(
            message="User not found",
            status_code=404
        )

    data = request.get_json()

    role_name = data.get("role")

    if not role_name:

        return error_response(
            message="Role is required",
            status_code=400
        )

    role = Role.query.filter_by(
        name=role_name
    ).first()

    if not role:

        return error_response(
            message="Invalid role",
            status_code=400
        )

    user.role = role

    db.session.commit()

    return success_response(
        message="User role updated successfully",
        data={
            "user": {
                "id": user.id,
                "full_name": user.full_name,
                "email": user.email,
                "role": user.role.name
            }
        },
        status_code=200
    )

# ACTIVATE / DEACTIVATE USER

def toggle_user_status(user_id):

    user = User.query.get(user_id)

    if not user:

        return error_response(
            message="User not found",
            status_code=404
        )

    user.is_active = not user.is_active

    db.session.commit()

    return success_response(
        message="User status updated successfully",
        data={
            "user": {
                "id": user.id,
                "is_active": user.is_active
            }
        },
        status_code=200
    )