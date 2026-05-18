from flask import Blueprint

from flask_jwt_extended import (
    jwt_required
)

from app.controllers.trusted_contact_controller import (
    create_trusted_contact,
    get_trusted_contacts,
    get_trusted_contact,
    update_trusted_contact,
    delete_trusted_contact
)


trusted_contact_bp = Blueprint(
    "trusted_contact_bp",
    __name__
)


trusted_contact_bp.route(
    "/trusted-contacts",
    methods=["POST"]
)(
    jwt_required()(create_trusted_contact)
)

trusted_contact_bp.route(
    "/trusted-contacts",
    methods=["GET"]
)(
    jwt_required()(get_trusted_contacts)
)

trusted_contact_bp.route(
    "/trusted-contacts/<int:contact_id>",
    methods=["GET"]
)(
    jwt_required()(get_trusted_contact)
)

trusted_contact_bp.route(
    "/trusted-contacts/<int:contact_id>",
    methods=["PATCH"]
)(
    jwt_required()(update_trusted_contact)
)

trusted_contact_bp.route(
    "/trusted-contacts/<int:contact_id>",
    methods=["DELETE"]
)(
    jwt_required()(delete_trusted_contact)
)