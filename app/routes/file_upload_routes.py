from flask import Blueprint

from flask_jwt_extended import (
    jwt_required
)

from app.controllers.file_upload_controller import (
    upload_user_profile_image,
    upload_child_profile_image
)


file_upload_bp = Blueprint(
    "file_upload_bp",
    __name__
)


file_upload_bp.route(
    "/upload/profile-image",
    methods=["POST"]
)(
    jwt_required()(upload_user_profile_image)
)

file_upload_bp.route(
    "/upload/children/<int:child_id>/profile-image",
    methods=["POST"]
)(
    jwt_required()(upload_child_profile_image)
)