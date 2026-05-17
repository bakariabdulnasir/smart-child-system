from datetime import datetime

from flask import request

from marshmallow import ValidationError

from flask_jwt_extended import get_jwt_identity

from app.extensions.extensions import db

from app.models.task import Task
from app.models.child import Child

from app.schemas.task_schema import TaskSchema

from app.utils.response import (
    success_response,
    error_response
)


task_schema = TaskSchema()


# CREATE TASK

def create_task():

    try:

        current_user_id = get_jwt_identity()

        data = request.get_json()

        validated_data = task_schema.load(data)

        child = Child.query.filter_by(
            id=validated_data["child_id"],
            parent_id=current_user_id
        ).first()

        if not child:

            return error_response(
                message="Child not found",
                status_code=404
            )

        task = Task(
            title=validated_data["title"],
            description=validated_data.get("description"),
            status=validated_data.get(
                "status",
                "pending"
            ),
            priority=validated_data.get(
                "priority",
                "medium"
            ),
            due_date=validated_data.get("due_date"),
            child_id=child.id
        )

        db.session.add(task)

        db.session.commit()

        return success_response(
            message="Task created successfully",
            data={
                "task": {
                    "id": task.id,
                    "title": task.title,
                    "status": task.status,
                    "priority": task.priority
                }
            },
            status_code=201
        )

    except ValidationError as err:

        return error_response(
            message="Validation failed",
            errors=err.messages,
            status_code=400
        )

    except Exception as e:

        return error_response(
            message="Task creation failed",
            errors=str(e),
            status_code=500
        )


# GET ALL TASKS

def get_tasks():

    try:

        current_user_id = get_jwt_identity()

        tasks = Task.query.join(Child).filter(
            Child.parent_id == current_user_id
        ).all()

        tasks_data = []

        for task in tasks:

            tasks_data.append({
                "id": task.id,
                "title": task.title,
                "description": task.description,
                "status": task.status,
                "priority": task.priority,
                "child_id": task.child_id
            })

        return success_response(
            message="Tasks retrieved successfully",
            data={
                "tasks": tasks_data
            },
            status_code=200
        )

    except Exception as e:

        return error_response(
            message="Failed to retrieve tasks",
            errors=str(e),
            status_code=500
        )


# GET SINGLE TASK

def get_task(task_id):

    try:

        current_user_id = get_jwt_identity()

        task = Task.query.join(Child).filter(
            Task.id == task_id,
            Child.parent_id == current_user_id
        ).first()

        if not task:

            return error_response(
                message="Task not found",
                status_code=404
            )

        return success_response(
            message="Task retrieved successfully",
            data={
                "task": {
                    "id": task.id,
                    "title": task.title,
                    "description": task.description,
                    "status": task.status,
                    "priority": task.priority
                }
            },
            status_code=200
        )

    except Exception as e:

        return error_response(
            message="Failed to retrieve task",
            errors=str(e),
            status_code=500
        )


# UPDATE TASK

def update_task(task_id):

    try:

        current_user_id = get_jwt_identity()

        task = Task.query.join(Child).filter(
            Task.id == task_id,
            Child.parent_id == current_user_id
        ).first()

        if not task:

            return error_response(
                message="Task not found",
                status_code=404
            )

        data = request.get_json()

        validated_data = task_schema.load(
            data,
            partial=True
        )

        task.title = validated_data.get(
            "title",
            task.title
        )

        task.description = validated_data.get(
            "description",
            task.description
        )

        task.status = validated_data.get(
            "status",
            task.status
        )

        task.priority = validated_data.get(
            "priority",
            task.priority
        )

        task.due_date = validated_data.get(
            "due_date",
            task.due_date
        )

        if task.status == "completed":

            task.completed_at = datetime.utcnow()

        db.session.commit()

        return success_response(
            message="Task updated successfully",
            data={
                "task": {
                    "id": task.id,
                    "title": task.title,
                    "status": task.status
                }
            },
            status_code=200
        )

    except ValidationError as err:

        return error_response(
            message="Validation failed",
            errors=err.messages,
            status_code=400
        )

    except Exception as e:

        return error_response(
            message="Failed to update task",
            errors=str(e),
            status_code=500
        )


# DELETE TASK

def delete_task(task_id):

    try:

        current_user_id = get_jwt_identity()

        task = Task.query.join(Child).filter(
            Task.id == task_id,
            Child.parent_id == current_user_id
        ).first()

        if not task:

            return error_response(
                message="Task not found",
                status_code=404
            )

        db.session.delete(task)

        db.session.commit()

        return success_response(
            message="Task deleted successfully",
            status_code=200
        )

    except Exception as e:

        return error_response(
            message="Failed to delete task",
            errors=str(e),
            status_code=500
        )