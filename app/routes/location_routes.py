from flask import Blueprint

from flask_jwt_extended import (
    jwt_required
)

from app.controllers.location_controller import (
    get_nearby_places
)


location_bp = Blueprint(
    "location_bp",
    __name__
)


location_bp.route(
    "/nearby",
    methods=["GET"]
)(
    jwt_required()(get_nearby_places)
)