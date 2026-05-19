from flask import Blueprint

from app.controllers.dashboard_controller import (
    dashboard_summary
)

dashboard_bp = Blueprint(
    "dashboard",
    __name__,
    url_prefix="/api/dashboard"
)


dashboard_bp.route(
    "/summary",
    methods=["GET"]
)(dashboard_summary)