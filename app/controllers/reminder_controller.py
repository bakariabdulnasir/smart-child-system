from flask import request

from marshmallow import ValidationError

from flask_jwt_extended import get_jwt_identity

from app.extensions.extensions import db

from app.models.reminder import Reminder

from app.schemas.reminder_schema import ReminderSchema

from app.utils.response import (
    success_response,
    error_response
)


reminder_schema = ReminderSchema()


# CREATE REMINDER

def create_reminder():

    try:

        current_user_id = get_jwt_identity()

        data = request.get_json()

        validated_data = reminder_schema.load(data)

        reminder = Reminder(
            title=validated_data["title"],
            message=validated_data["message"],
            reminder_time=validated_data["reminder_time"],
            user_id=current_user_id
        )

        db.session.add(reminder)

        db.session.commit()

        return success_response(
            message="Reminder created successfully",
            data={
                "reminder": {
                    "id": reminder.id,
                    "title": reminder.title,
                    "message": reminder.message,
                    "reminder_time": reminder.reminder_time
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
            message="Reminder creation failed",
            errors=str(e),
            status_code=500
        )


# GET ALL REMINDERS

from flask import request

def get_reminders():
    try:
        page = request.args.get(
            "page",
            1,
            type=int
        )

        per_page = request.args.get(
            "per_page",
            10,
            type=int
        )

        is_sent = request.args.get(
            "is_sent"
        )

        query = Reminder.query

        if is_sent:
            query = query.filter(
                Reminder.is_sent == (
                    is_sent.lower() == "true"
                )
            )

        paginated_reminders = query.paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )

        reminders_data = []

        for reminder in paginated_reminders.items:
            reminders_data.append({
                "id": reminder.id,
                "title": reminder.title,
                "message": reminder.message,
                "is_sent": reminder.is_sent
            })

        return success_response(
            message="Reminders retrieved successfully",
            data={
                "reminders": reminders_data,
                "pagination": {
                    "page": paginated_reminders.page,
                    "pages": paginated_reminders.pages,
                    "total": paginated_reminders.total
                }
            },
            status_code=200
        )

    except Exception as e:
        return error_response(
            message="Failed to retrieve reminders",
            errors=str(e),
            status_code=500
        ) 


# GET SINGLE REMINDER

def get_reminder(reminder_id):

    try:

        current_user_id = get_jwt_identity()

        reminder = Reminder.query.filter_by(
            id=reminder_id,
            user_id=current_user_id
        ).first()

        if not reminder:

            return error_response(
                message="Reminder not found",
                status_code=404
            )

        return success_response(
            message="Reminder retrieved successfully",
            data={
                "reminder": {
                    "id": reminder.id,
                    "title": reminder.title,
                    "message": reminder.message,
                    "reminder_time": reminder.reminder_time,
                    "is_sent": reminder.is_sent
                }
            },
            status_code=200
        )

    except Exception as e:

        return error_response(
            message="Failed to retrieve reminder",
            errors=str(e),
            status_code=500
        )


# UPDATE REMINDER

def update_reminder(reminder_id):

    try:

        current_user_id = get_jwt_identity()

        reminder = Reminder.query.filter_by(
            id=reminder_id,
            user_id=current_user_id
        ).first()

        if not reminder:

            return error_response(
                message="Reminder not found",
                status_code=404
            )

        data = request.get_json()

        validated_data = reminder_schema.load(
            data,
            partial=True
        )

        reminder.title = validated_data.get(
            "title",
            reminder.title
        )

        reminder.message = validated_data.get(
            "message",
            reminder.message
        )

        reminder.reminder_time = validated_data.get(
            "reminder_time",
            reminder.reminder_time
        )

        reminder.is_sent = validated_data.get(
            "is_sent",
            reminder.is_sent
        )

        db.session.commit()

        return success_response(
            message="Reminder updated successfully",
            data={
                "reminder": {
                    "id": reminder.id,
                    "title": reminder.title
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
            message="Failed to update reminder",
            errors=str(e),
            status_code=500
        )


# DELETE REMINDER

def delete_reminder(reminder_id):

    try:

        current_user_id = get_jwt_identity()

        reminder = Reminder.query.filter_by(
            id=reminder_id,
            user_id=current_user_id
        ).first()

        if not reminder:

            return error_response(
                message="Reminder not found",
                status_code=404
            )

        db.session.delete(reminder)

        db.session.commit()

        return success_response(
            message="Reminder deleted successfully",
            status_code=200
        )

    except Exception as e:

        return error_response(
            message="Failed to delete reminder",
            errors=str(e),
            status_code=500
        )