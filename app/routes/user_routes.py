from flask import Blueprint

from flask_jwt_extended import (
    jwt_required
)

from app.controllers.user_controller import (
    get_my_profile,
    update_my_profile,
    change_password
)


user_bp = Blueprint(
    "users",
    __name__,
    url_prefix="/api/users"
)


# GET MY PROFILE

user_bp.route(
    "/me",
    methods=["GET"]
)(
    jwt_required()(get_my_profile)
)


# UPDATE PROFILE

user_bp.route(
    "/me",
    methods=["PATCH"]
)(
    jwt_required()(update_my_profile)
)


# CHANGE PASSWORD

user_bp.route(
    "/change-password",
    methods=["PATCH"]
)(
    jwt_required()(change_password)
)