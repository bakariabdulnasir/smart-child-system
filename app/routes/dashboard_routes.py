from flask import Blueprint

from flask_jwt_extended import (
    jwt_required
)

from app.controllers.dashboard_controller import (
    get_dashboard
)


dashboard_bp = Blueprint(
    "dashboard_bp",
    __name__
)


dashboard_bp.route(
    "/dashboard",
    methods=["GET"]
)(
    jwt_required()(get_dashboard)
)