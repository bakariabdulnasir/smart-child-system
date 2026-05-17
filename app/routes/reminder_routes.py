from flask import Blueprint

from flask_jwt_extended import jwt_required

from app.controllers.reminder_controller import (
    create_reminder,
    get_reminders,
    get_reminder,
    update_reminder,
    delete_reminder
)


reminder_bp = Blueprint(
    "reminder_bp",
    __name__
)


reminder_bp.route(
    "/reminders",
    methods=["POST"]
)(jwt_required()(create_reminder))

reminder_bp.route(
    "/reminders",
    methods=["GET"]
)(jwt_required()(get_reminders))

reminder_bp.route(
    "/reminders/<int:reminder_id>",
    methods=["GET"]
)(jwt_required()(get_reminder))

reminder_bp.route(
    "/reminders/<int:reminder_id>",
    methods=["PATCH"]
)(jwt_required()(update_reminder))

reminder_bp.route(
    "/reminders/<int:reminder_id>",
    methods=["DELETE"]
)(jwt_required()(delete_reminder))