from flask import Blueprint
from flask_jwt_extended import jwt_required

from app.controllers.child_controller import (
    create_child,
    get_children,
    get_child,
    update_child,
    delete_child
)

child_bp = Blueprint(
    "child_bp",
    __name__
)


child_bp.route(
    "/children",
    methods=["POST"]
)(jwt_required()(create_child))


child_bp.route(
    "/children",
    methods=["GET"]
)(jwt_required()(get_children))


child_bp.route(
    "/children/<int:child_id>",
    methods=["GET"]
)(jwt_required()(get_child))


child_bp.route(
    "/children/<int:child_id>",
    methods=["PATCH"]
)(jwt_required()(update_child))


child_bp.route(
    "/children/<int:child_id>",
    methods=["DELETE"]
)(jwt_required()(delete_child))