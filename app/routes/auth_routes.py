from flask import Blueprint

from app.controllers.auth_controller import (
    register_user
)


auth_bp = Blueprint(
    "auth",
    __name__,
    url_prefix="/api/auth"
)


auth_bp.route(
    "/register",
    methods=["POST"]
)(register_user)