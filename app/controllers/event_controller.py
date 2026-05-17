from flask import request
from datetime import datetime
from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from app.models.event import Event
from app.models.user import User
from app.extensions.extensions import db
from app.schemas.event_schema import EventSchema
from app.utils.response import (
    success_response,
    error_response
)

event_schema = EventSchema()
events_schema = EventSchema(many=True)


@jwt_required()
def create_event():
    try:

        data = request.get_json()

        errors = event_schema.validate(data)

        if errors:
            return error_response(
                message="Validation failed",
                status_code=400,
                errors=errors
            )

        current_user_id = get_jwt_identity()

        event = Event(
            title=data["title"],
            description=data.get("description"),
            location=data["location"],
            event_date=datetime.fromisoformat(data["event_date"]),
            user_id=current_user_id
        )

        db.session.add(event)
        db.session.commit()

        return success_response(
            message="Event created successfully",
            status_code=201,
            data=event_schema.dump(event)
        )

    except Exception as e:
        return error_response(
            message="Event creation failed",
            status_code=500,
            errors=str(e)
        )


@jwt_required()
def get_events():
    try:

        current_user_id = get_jwt_identity()

        events = Event.query.filter_by(
            user_id=current_user_id
        ).all()

        return success_response(
            message="Events fetched successfully",
            status_code=200,
            data=events_schema.dump(events)
        )

    except Exception as e:
        return error_response(
            message="Fetching events failed",
            status_code=500,
            errors=str(e)
        )


@jwt_required()
def get_event(id):
    try:

        current_user_id = get_jwt_identity()

        event = Event.query.filter_by(
            id=id,
            user_id=current_user_id
        ).first()

        if not event:
            return error_response(
                message="Event not found",
                status_code=404
            )

        return success_response(
            message="Event fetched successfully",
            status_code=200,
            data=event_schema.dump(event)
        )

    except Exception as e:
        return error_response(
            message="Fetching event failed",
            status_code=500,
            errors=str(e)
        )


@jwt_required()
def update_event(id):
    try:

        current_user_id = get_jwt_identity()

        event = Event.query.filter_by(
            id=id,
            user_id=current_user_id
        ).first()

        if not event:
            return error_response(
                message="Event not found",
                status_code=404
            )

        data = request.get_json()

        if "title" in data:
            event.title = data["title"]

        if "description" in data:
            event.description = data["description"]

        if "location" in data:
            event.location = data["location"]

        if "event_date" in data:
            event.event_date = data["event_date"]

        db.session.commit()

        return success_response(
            message="Event updated successfully",
            status_code=200,
            data=event_schema.dump(event)
        )

    except Exception as e:
        return error_response(
            message="Updating event failed",
            status_code=500,
            errors=str(e)
        )


@jwt_required()
def delete_event(id):
    try:

        current_user_id = get_jwt_identity()

        event = Event.query.filter_by(
            id=id,
            user_id=current_user_id
        ).first()

        if not event:
            return error_response(
                message="Event not found",
                status_code=404
            )

        db.session.delete(event)
        db.session.commit()

        return success_response(
            message="Event deleted successfully",
            status_code=200
        )

    except Exception as e:
        return error_response(
            message="Deleting event failed",
            status_code=500,
            errors=str(e)
        )