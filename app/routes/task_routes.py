from flask import Blueprint

from flask_jwt_extended import jwt_required

from app.controllers.task_controller import (
    create_task,
    get_tasks,
    get_task,
    update_task,
    delete_task
)


task_bp = Blueprint(
    "task_bp",
    __name__
)


task_bp.route(
    "/tasks",
    methods=["POST"]
)(jwt_required()(create_task))

task_bp.route(
    "/tasks",
    methods=["GET"]
)(jwt_required()(get_tasks))

task_bp.route(
    "/tasks/<int:task_id>",
    methods=["GET"]
)(jwt_required()(get_task))

task_bp.route(
    "/tasks/<int:task_id>",
    methods=["PATCH"]
)(jwt_required()(update_task))

task_bp.route(
    "/tasks/<int:task_id>",
    methods=["DELETE"]
)(jwt_required()(delete_task))