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

    children_ids = [
        child.id
        for child in children
    ]


    # =====================================
    # TASKS
    # =====================================
    tasks = []

    if children_ids:

        tasks = Task.query.filter(
            Task.child_id.in_(children_ids)
        ).all()


    pending_tasks = [

        task

        for task in tasks

        if hasattr(task, "status")
        and task.status == "pending"
    ]


    # =====================================
    # EVENTS
    # =====================================
    try:

        events = Event.query.all()

    except Exception:

        events = []


    # =====================================
    # SCHEDULES
    # =====================================
    try:

        schedules = Schedule.query.all()

    except Exception:

        schedules = []


    # =====================================
    # REMINDERS
    # =====================================
    try:

        reminders = Reminder.query.all()

    except Exception:

        reminders = []


    # =====================================
    # NOTIFICATIONS
    # =====================================
    try:

        notifications = Notification.query.all()

    except Exception:

        notifications = []


    # =====================================
    # TRUSTED CONTACTS
    # =====================================
    try:

        contacts = TrustedContact.query.all()

    except Exception:

        contacts = []


    # =====================================
    # RECENT TASKS
    # =====================================
    recent_tasks = sorted(

        tasks,

        key=lambda x:
        x.created_at
        if hasattr(x, "created_at")
        else 0,

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

        "message":
        "Dashboard summary retrieved successfully",

        "data": {

            # =================================
            # COUNTS
            # =================================
            "counts": {

                "children":
                len(children),

                "tasks":
                len(tasks),

                "pending_tasks":
                len(pending_tasks),

                "events":
                len(events),

                "schedules":
                len(schedules),

                "reminders":
                len(reminders),

                "contacts":
                len(contacts),

                "notifications":
                len(notifications),
            },


            # =================================
            # CHILDREN
            # =================================
            "children": [

                {
                    "id":
                    child.id,

                    "name":
                    child.name
                    if hasattr(child, "name")
                    else "",

                    "age":
                    child.age
                    if hasattr(child, "age")
                    else "",

                    "medical_notes":
                    child.medical_notes
                    if hasattr(child, "medical_notes")
                    else ""
                }

                for child in children
            ],


            # =================================
            # RECENT TASKS
            # =================================
            "recent_tasks": [

                {
                    "id":
                    task.id,

                    "title":
                    task.title
                    if hasattr(task, "title")
                    else "",

                    "status":
                    task.status
                    if hasattr(task, "status")
                    else "",

                    "priority":
                    task.priority
                    if hasattr(task, "priority")
                    else ""
                }

                for task in recent_tasks
            ],


            # =================================
            # UPCOMING EVENTS
            # =================================
            "upcoming_events": [

                {
                    "id":
                    event.id
                    if hasattr(event, "id")
                    else "",

                    "title":
                    event.title
                    if hasattr(event, "title")
                    else "",

                    "datetime":
                    str(event.datetime)
                    if hasattr(event, "datetime")
                    else "",

                    "location":
                    event.location
                    if hasattr(event, "location")
                    else ""
                }

                for event in upcoming_events
            ],


            # =================================
            # RECENT NOTIFICATIONS
            # =================================
            "recent_notifications": [

                {
                    "id":
                    notification.id
                    if hasattr(notification, "id")
                    else "",

                    "message":
                    notification.message
                    if hasattr(notification, "message")
                    else ""
                }

                for notification
                in recent_notifications
            ],


            # =================================
            # TRUSTED CONTACTS
            # =================================
            "trusted_contacts": [

                {
                    "id":
                    contact.id
                    if hasattr(contact, "id")
                    else "",

                    "name":
                    contact.name
                    if hasattr(contact, "name")
                    else "",

                    "phone":
                    contact.phone
                    if hasattr(contact, "phone")
                    else ""
                }

                for contact in contacts
            ]
        }

    }), 200