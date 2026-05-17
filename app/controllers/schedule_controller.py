from flask import request

from marshmallow import ValidationError

from flask_jwt_extended import get_jwt_identity

from app.extensions.extensions import db

from app.models.schedule import Schedule
from app.models.child import Child

from app.schemas.schedule_schema import ScheduleSchema

from app.utils.response import (
    success_response,
    error_response
)


schedule_schema = ScheduleSchema()


# CREATE SCHEDULE

def create_schedule():

    try:

        current_user_id = get_jwt_identity()

        data = request.get_json()

        validated_data = schedule_schema.load(data)

        child = Child.query.filter_by(
            id=validated_data["child_id"],
            parent_id=current_user_id
        ).first()

        if not child:

            return error_response(
                message="Child not found",
                status_code=404
            )

        overlapping_schedule = Schedule.query.filter(
            Schedule.child_id == child.id,
            Schedule.start_time < validated_data["end_time"],
            Schedule.end_time > validated_data["start_time"]
        ).first()

        if overlapping_schedule:

            return error_response(
                message="Schedule conflict detected",
                status_code=400
            )

        schedule = Schedule(
            title=validated_data["title"],
            description=validated_data.get("description"),
            start_time=validated_data["start_time"],
            end_time=validated_data["end_time"],
            child_id=child.id,
            user_id=current_user_id
        )

        db.session.add(schedule)

        db.session.commit()

        return success_response(
            message="Schedule created successfully",
            data={
                "schedule": {
                    "id": schedule.id,
                    "title": schedule.title
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
            message="Schedule creation failed",
            errors=str(e),
            status_code=500
        )


# GET ALL SCHEDULES

def get_schedules():

    try:

        current_user_id = get_jwt_identity()

        schedules = Schedule.query.filter_by(
            user_id=current_user_id
        ).all()

        schedules_data = []

        for schedule in schedules:

            schedules_data.append({
                "id": schedule.id,
                "title": schedule.title,
                "description": schedule.description,
                "start_time": schedule.start_time,
                "end_time": schedule.end_time,
                "child_id": schedule.child_id
            })

        return success_response(
            message="Schedules retrieved successfully",
            data={
                "schedules": schedules_data
            },
            status_code=200
        )

    except Exception as e:

        return error_response(
            message="Failed to retrieve schedules",
            errors=str(e),
            status_code=500
        )


# GET SINGLE SCHEDULE

def get_schedule(schedule_id):

    try:

        current_user_id = get_jwt_identity()

        schedule = Schedule.query.filter_by(
            id=schedule_id,
            user_id=current_user_id
        ).first()

        if not schedule:

            return error_response(
                message="Schedule not found",
                status_code=404
            )

        return success_response(
            message="Schedule retrieved successfully",
            data={
                "schedule": {
                    "id": schedule.id,
                    "title": schedule.title,
                    "description": schedule.description,
                    "start_time": schedule.start_time,
                    "end_time": schedule.end_time
                }
            },
            status_code=200
        )

    except Exception as e:

        return error_response(
            message="Failed to retrieve schedule",
            errors=str(e),
            status_code=500
        )


# UPDATE SCHEDULE

def update_schedule(schedule_id):

    try:

        current_user_id = get_jwt_identity()

        schedule = Schedule.query.filter_by(
            id=schedule_id,
            user_id=current_user_id
        ).first()

        if not schedule:

            return error_response(
                message="Schedule not found",
                status_code=404
            )

        data = request.get_json()

        validated_data = schedule_schema.load(
            data,
            partial=True
        )

        schedule.title = validated_data.get(
            "title",
            schedule.title
        )

        schedule.description = validated_data.get(
            "description",
            schedule.description
        )

        schedule.start_time = validated_data.get(
            "start_time",
            schedule.start_time
        )

        schedule.end_time = validated_data.get(
            "end_time",
            schedule.end_time
        )

        db.session.commit()

        return success_response(
            message="Schedule updated successfully",
            data={
                "schedule": {
                    "id": schedule.id,
                    "title": schedule.title
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
            message="Failed to update schedule",
            errors=str(e),
            status_code=500
        )


# DELETE SCHEDULE

def delete_schedule(schedule_id):

    try:

        current_user_id = get_jwt_identity()

        schedule = Schedule.query.filter_by(
            id=schedule_id,
            user_id=current_user_id
        ).first()

        if not schedule:

            return error_response(
                message="Schedule not found",
                status_code=404
            )

        db.session.delete(schedule)

        db.session.commit()

        return success_response(
            message="Schedule deleted successfully",
            status_code=200
        )

    except Exception as e:

        return error_response(
            message="Failed to delete schedule",
            errors=str(e),
            status_code=500
        )