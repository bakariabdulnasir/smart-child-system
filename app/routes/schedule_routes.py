from flask import Blueprint

from flask_jwt_extended import jwt_required

from app.controllers.schedule_controller import (
    create_schedule,
    get_schedules,
    get_schedule,
    update_schedule,
    delete_schedule
)


schedule_bp = Blueprint(
    "schedule_bp",
    __name__
)


schedule_bp.route(
    "/schedules",
    methods=["POST"]
)(jwt_required()(create_schedule))

schedule_bp.route(
    "/schedules",
    methods=["GET"]
)(jwt_required()(get_schedules))

schedule_bp.route(
    "/schedules/<int:schedule_id>",
    methods=["GET"]
)(jwt_required()(get_schedule))

schedule_bp.route(
    "/schedules/<int:schedule_id>",
    methods=["PATCH"]
)(jwt_required()(update_schedule))

schedule_bp.route(
    "/schedules/<int:schedule_id>",
    methods=["DELETE"]
)(jwt_required()(delete_schedule))