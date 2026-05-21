from flask import jsonify

from flask_jwt_extended import (
    jwt_required,
    get_jwt_identity
)

from app.models.child import Child
from app.models.task import Task
from app.models.event import Event
from app.models.schedule import Schedule
from app.models.reminder import Reminder
from app.models.notification import Notification
from app.models.trusted_contact import TrustedContact


@jwt_required()
def dashboard_summary():

    current_user_id = get_jwt_identity()

    # =====================================
    # CHILDREN
    # =====================================
    children = Child.query.filter_by(
        parent_id=current_user_id
    ).all()

    children_ids = [child.id for child in children]

    # =====================================
    # TASKS
    # =====================================
    tasks = []
    if children_ids:
        tasks = Task.query.filter(
            Task.child_id.in_(children_ids)
        ).all()

    pending_tasks = [task for task in tasks if hasattr(task, "status") and task.status == "pending"]
    pending_count = len(pending_tasks)

# =====================================
    # EVENTS - Filter by current user to prevent duplication
    # =====================================
    try:
        events = Event.query.filter_by(user_id=current_user_id).all()
    except Exception:
        events = []

    # =====================================
    # SCHEDULES - Filter by current user
    # =====================================
    try:
        schedules = Schedule.query.filter_by(user_id=current_user_id).all()
    except Exception:
        schedules = []

    # =====================================
    # REMINDERS - Filter by current user
    # =====================================
    try:
        reminders = Reminder.query.filter_by(user_id=current_user_id).all()
    except Exception:
        reminders = []

    # =====================================
    # NOTIFICATIONS - Filter by current user
    # =====================================
    try:
        notifications = Notification.query.filter_by(user_id=current_user_id).all()
    except Exception:
        notifications = []

    # =====================================
    # TRUSTED CONTACTS - Filter by current user to prevent data leakage
    # =====================================
    try:
        contacts = TrustedContact.query.filter_by(user_id=current_user_id).all()
    except Exception:
        contacts = []

    # =====================================
    # RECENT TASKS
    # =====================================
    recent_tasks = sorted(
        tasks,
        key=lambda x: x.created_at if hasattr(x, "created_at") else 0,
        reverse=True
    )[:5]

    # =====================================
    # UPCOMING EVENTS
    # =====================================
    upcoming_events = events[:5]

    # =====================================
    # RECENT NOTIFICATIONS
    # =====================================
    recent_notifications = notifications[:5]

    # =====================================
    # RESPONSE
    # =====================================
    return jsonify({
        "success": True,
        "message": "Dashboard summary retrieved successfully",
        "data": {
            "counts": {
                "children": len(children),
                "tasks": len(tasks),
                "pending_tasks": pending_count,
                "events": len(events),
                "schedules": len(schedules),
                "reminders": len(reminders),
                "contacts": len(contacts),
                "notifications": len(notifications),
            },
"children": [
                {
                    "id": child.id,
                    "full_name": child.full_name if hasattr(child, "full_name") else child.name if hasattr(child, "name") else "",
                    "age": child.age if hasattr(child, "age") else "",
                    "medical_notes": child.medical_notes if hasattr(child, "medical_notes") else "",
                    "allergies": child.allergies if hasattr(child, "allergies") else "",
                    "emergency_contact": child.emergency_contact if hasattr(child, "emergency_contact") else "",
                    "emergency_phone": child.emergency_phone if hasattr(child, "emergency_phone") else "",
                    "school": child.school if hasattr(child, "school") else "",
                    "profile_image": child.profile_image if hasattr(child, "profile_image") else None
                }
                for child in children
            ],
            "recent_tasks": [
                {
                    "id": task.id,
                    "title": task.title if hasattr(task, "title") else "",
                    "status": task.status if hasattr(task, "status") else "",
                    "priority": task.priority if hasattr(task, "priority") else ""
                }
                for task in recent_tasks
            ],
"upcoming_events": [
                {
                    "id": event.id if hasattr(event, "id") else "",
                    "title": event.title if hasattr(event, "title") else "",
                    "datetime": str(event.event_date) if hasattr(event, "event_date") else "",
                    "location": event.location if hasattr(event, "location") else ""
                }
                for event in upcoming_events
            ],
            "recent_notifications": [
                {
                    "id": notification.id if hasattr(notification, "id") else "",
                    "message": notification.message if hasattr(notification, "message") else ""
                }
                for notification in recent_notifications
            ],
            "trusted_contacts": [
                {
                    "id": contact.id if hasattr(contact, "id") else "",
                    "name": contact.full_name if hasattr(contact, "full_name") else "",
                    "phone": contact.phone_number if hasattr(contact, "phone_number") else ""
                }
                for contact in contacts
            ]
        }
    }), 200
