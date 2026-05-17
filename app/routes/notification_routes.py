from flask import Blueprint

from flask_jwt_extended import jwt_required

from app.controllers.notification_controller import (
    create_notification,
    get_notifications,
    get_notification,
    mark_notification_read,
    get_unread_notifications_count,
    delete_notification
)


notification_bp = Blueprint(
    "notification_bp",
    __name__
)


notification_bp.route(
    "/notifications",
    methods=["POST"]
)(jwt_required()(create_notification))

notification_bp.route(
    "/notifications",
    methods=["GET"]
)(jwt_required()(get_notifications))

notification_bp.route(
    "/notifications/unread-count",
    methods=["GET"]
)(jwt_required()(get_unread_notifications_count))

notification_bp.route(
    "/notifications/<int:notification_id>",
    methods=["GET"]
)(jwt_required()(get_notification))

notification_bp.route(
    "/notifications/<int:notification_id>/read",
    methods=["PATCH"]
)(jwt_required()(mark_notification_read))

notification_bp.route(
    "/notifications/<int:notification_id>",
    methods=["DELETE"]
)(jwt_required()(delete_notification))