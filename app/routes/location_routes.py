from flask import Blueprint

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from app.controllers.location_controller import (
    get_nearby_places
)


location_bp = Blueprint(
    "location_bp",
    __name__
)


# Define the route with proper JWT decorator
@location_bp.route("/locations/nearby", methods=["GET"])
@jwt_required()
def nearby_places():
    return get_nearby_places()
