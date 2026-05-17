from flask import request

from marshmallow import ValidationError

from flask_jwt_extended import get_jwt_identity

from app.extensions.extensions import db

from app.models.notification import Notification

from app.schemas.notification_schema import NotificationSchema

from app.utils.response import (
    success_response,
    error_response
)


notification_schema = NotificationSchema()


# CREATE NOTIFICATION

def create_notification():

    try:

        current_user_id = get_jwt_identity()

        data = request.get_json()

        validated_data = notification_schema.load(data)

        notification = Notification(
            title=validated_data["title"],
            message=validated_data["message"],
            type=validated_data.get(
                "type",
                "system"
            ),
            user_id=current_user_id
        )

        db.session.add(notification)

        db.session.commit()

        return success_response(
            message="Notification created successfully",
            data={
                "notification": {
                    "id": notification.id,
                    "title": notification.title,
                    "message": notification.message,
                    "type": notification.type
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
            message="Notification creation failed",
            errors=str(e),
            status_code=500
        )


# GET ALL NOTIFICATIONS

def get_notifications():

    try:

        current_user_id = get_jwt_identity()

        notifications = Notification.query.filter_by(
            user_id=current_user_id
        ).order_by(
            Notification.created_at.desc()
        ).all()

        notifications_data = []

        for notification in notifications:

            notifications_data.append({
                "id": notification.id,
                "title": notification.title,
                "message": notification.message,
                "type": notification.type,
                "is_read": notification.is_read,
                "created_at": notification.created_at
            })

        return success_response(
            message="Notifications retrieved successfully",
            data={
                "notifications": notifications_data
            },
            status_code=200
        )

    except Exception as e:

        return error_response(
            message="Failed to retrieve notifications",
            errors=str(e),
            status_code=500
        )


# GET SINGLE NOTIFICATION

def get_notification(notification_id):

    try:

        current_user_id = get_jwt_identity()

        notification = Notification.query.filter_by(
            id=notification_id,
            user_id=current_user_id
        ).first()

        if not notification:

            return error_response(
                message="Notification not found",
                status_code=404
            )

        return success_response(
            message="Notification retrieved successfully",
            data={
                "notification": {
                    "id": notification.id,
                    "title": notification.title,
                    "message": notification.message,
                    "type": notification.type,
                    "is_read": notification.is_read
                }
            },
            status_code=200
        )

    except Exception as e:

        return error_response(
            message="Failed to retrieve notification",
            errors=str(e),
            status_code=500
        )


# MARK AS READ

def mark_notification_read(notification_id):

    try:

        current_user_id = get_jwt_identity()

        notification = Notification.query.filter_by(
            id=notification_id,
            user_id=current_user_id
        ).first()

        if not notification:

            return error_response(
                message="Notification not found",
                status_code=404
            )

        notification.is_read = True

        db.session.commit()

        return success_response(
            message="Notification marked as read",
            data={
                "notification": {
                    "id": notification.id,
                    "is_read": notification.is_read
                }
            },
            status_code=200
        )

    except Exception as e:

        return error_response(
            message="Failed to update notification",
            errors=str(e),
            status_code=500
        )


# GET UNREAD COUNT

def get_unread_notifications_count():

    try:

        current_user_id = get_jwt_identity()

        unread_count = Notification.query.filter_by(
            user_id=current_user_id,
            is_read=False
        ).count()

        return success_response(
            message="Unread notification count retrieved",
            data={
                "unread_count": unread_count
            },
            status_code=200
        )

    except Exception as e:

        return error_response(
            message="Failed to retrieve unread count",
            errors=str(e),
            status_code=500
        )


# DELETE NOTIFICATION

def delete_notification(notification_id):

    try:

        current_user_id = get_jwt_identity()

        notification = Notification.query.filter_by(
            id=notification_id,
            user_id=current_user_id
        ).first()

        if not notification:

            return error_response(
                message="Notification not found",
                status_code=404
            )

        db.session.delete(notification)

        db.session.commit()

        return success_response(
            message="Notification deleted successfully",
            status_code=200
        )

    except Exception as e:

        return error_response(
            message="Failed to delete notification",
            errors=str(e),
            status_code=500
        )