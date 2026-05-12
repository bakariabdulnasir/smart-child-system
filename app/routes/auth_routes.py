from flask import Blueprint

from flask_jwt_extended import jwt_required

from app.controllers.auth_controller import (
    register_user,
    login_user,
    logout_user,
    protected_route
)


auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/api/auth"
)


# REGISTER

auth_bp.route(
    "/register",
    methods=["POST"]
)(register_user)


# LOGIN

auth_bp.route(
    "/login",
    methods=["POST"]
)(login_user)


# LOGOUT

auth_bp.route(
    "/logout",
    methods=["POST"]
)(jwt_required()(logout_user))


# PROTECTED TEST ROUTE

auth_bp.route(
    "/protected",
    methods=["GET"]
)(jwt_required()(protected_route))