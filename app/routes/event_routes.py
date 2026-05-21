from flask import Blueprint

from app.controllers.event_controller import (
    create_event,
    get_events,
    get_event,
    update_event,
    delete_event
)

event_bp = Blueprint(
    "event_bp",
    __name__
)

event_bp.route(
    "/events",
    methods=["POST"]
)(create_event)

event_bp.route(
    "/events",
    methods=["GET"]
)(get_events)

event_bp.route(
    "/events/<int:id>",
    methods=["GET"]
)(get_event)

event_bp.route(
    "/events/<int:id>",
    methods=["PUT", "PATCH"]
)(update_event)

event_bp.route(
    "/events/<int:id>",
    methods=["DELETE"]
)(delete_event)
