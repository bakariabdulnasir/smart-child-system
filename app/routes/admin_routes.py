from flask import Blueprint

from flask_jwt_extended import (
    jwt_required
)

from app.utils.rbac import (
    role_required
)

from app.controllers.admin_controller import (
    get_all_users,
    delete_user,
    update_user_role,
    toggle_user_status
)


admin_bp = Blueprint(
    "admin",
    __name__,
    url_prefix="/api/admin"
)


# GET USERS

admin_bp.route(
    "/users",
    methods=["GET"]
)(
    jwt_required()(
        role_required("admin")(
            get_all_users
        )
    )
)


# DELETE USER

admin_bp.route(
    "/users/<int:user_id>",
    methods=["DELETE"]
)(
    jwt_required()(
        role_required("admin")(
            delete_user
        )
    )
)


# UPDATE ROLE

admin_bp.route(
    "/users/<int:user_id>/role",
    methods=["PATCH"]
)(
    jwt_required()(
        role_required("admin")(
            update_user_role
        )
    )
)


# TOGGLE USER STATUS

admin_bp.route(
    "/users/<int:user_id>/status",
    methods=["PATCH"]
)(
    jwt_required()(
        role_required("admin")(
            toggle_user_status
        )
    )
)