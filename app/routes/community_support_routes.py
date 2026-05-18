from flask import Blueprint

from flask_jwt_extended import (
    jwt_required
)

from app.controllers.community_support_controller import (
    create_support_request,
    get_support_requests,
    get_support_request,
    update_support_request,
    delete_support_request,
    create_support_response,
    get_support_responses
)


community_support_bp = Blueprint(
    "community_support_bp",
    __name__
)


# SUPPORT REQUEST ROUTES

community_support_bp.route(
    "/support-requests",
    methods=["POST"]
)(
    jwt_required()(create_support_request)
)

community_support_bp.route(
    "/support-requests",
    methods=["GET"]
)(
    jwt_required()(get_support_requests)
)

community_support_bp.route(
    "/support-requests/<int:request_id>",
    methods=["GET"]
)(
    jwt_required()(get_support_request)
)

community_support_bp.route(
    "/support-requests/<int:request_id>",
    methods=["PATCH"]
)(
    jwt_required()(update_support_request)
)

community_support_bp.route(
    "/support-requests/<int:request_id>",
    methods=["DELETE"]
)(
    jwt_required()(delete_support_request)
)


# SUPPORT RESPONSE ROUTES

community_support_bp.route(
    "/support-requests/<int:request_id>/responses",
    methods=["POST"]
)(
    jwt_required()(create_support_response)
)

community_support_bp.route(
    "/support-requests/<int:request_id>/responses",
    methods=["GET"]
)(
    jwt_required()(get_support_responses)
)