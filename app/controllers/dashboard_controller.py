from datetime import datetime

from flask_jwt_extended import (
    get_jwt_identity
)

from app.models.child import Child
from app.models.task import Task
from app.models.schedule import Schedule
from app.models.reminder import Reminder
from app.models.notification import Notification
from app.models.event import Event

from app.utils.response import (
    success_response,
    error_response
)


def get_dashboard():

    try:

        current_user_id = get_jwt_identity()

        # CHILDREN

        total_children = Child.query.filter_by(
            parent_id=current_user_id
        ).count()

        # TASKS

        user_tasks = Task.query.join(Child).filter(
            Child.parent_id == current_user_id
        )

        total_tasks = user_tasks.count()

        pending_tasks = user_tasks.filter(
            Task.status == "pending"
        ).count()

        completed_tasks = user_tasks.filter(
            Task.status == "completed"
        ).count()

        # SCHEDULES

        total_schedules = Schedule.query.filter_by(
            user_id=current_user_id
        ).count()

        recent_schedules = Schedule.query.filter_by(
            user_id=current_user_id
        ).order_by(
            Schedule.start_time.asc()
        ).limit(5).all()

        schedules_data = []

        for schedule in recent_schedules:

            schedules_data.append({
                "id": schedule.id,
                "title": schedule.title,
                "start_time": schedule.start_time,
                "end_time": schedule.end_time
            })

        # REMINDERS

        total_reminders = Reminder.query.filter_by(
            user_id=current_user_id
        ).count()

        upcoming_reminders = Reminder.query.filter(
            Reminder.user_id == current_user_id,
            Reminder.reminder_time >= datetime.utcnow()
        ).order_by(
            Reminder.reminder_time.asc()
        ).limit(5).all()

        reminders_data = []

        for reminder in upcoming_reminders:

            reminders_data.append({
                "id": reminder.id,
                "title": reminder.title,
                "reminder_time": reminder.reminder_time
            })

        # NOTIFICATIONS

        unread_notifications = Notification.query.filter_by(
            user_id=current_user_id,
            is_read=False
        ).count()

        # EVENTS

        upcoming_events = Event.query.filter(
            Event.user_id == current_user_id,
            Event.event_date >= datetime.utcnow()
        ).order_by(
            Event.event_date.asc()
        ).limit(5).all()

        events_data = []

        for event in upcoming_events:

            events_data.append({
                "id": event.id,
                "title": event.title,
                "location": event.location,
                "event_date": event.event_date
            })

        return success_response(
            message="Dashboard retrieved successfully",
            data={
                "dashboard": {
                    "total_children": total_children,
                    "total_tasks": total_tasks,
                    "pending_tasks": pending_tasks,
                    "completed_tasks": completed_tasks,
                    "total_schedules": total_schedules,
                    "total_reminders": total_reminders,
                    "unread_notifications": unread_notifications,
                    "recent_schedules": schedules_data,
                    "upcoming_reminders": reminders_data,
                    "upcoming_events": events_data
                }
            },
            status_code=200
        )

    except Exception as e:

        return error_response(
            message="Failed to retrieve dashboard",
            errors=str(e),
            status_code=500
        )