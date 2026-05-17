from marshmallow import (
    Schema,
    fields,
    validate,
    validates_schema,
    ValidationError
)

from datetime import datetime


class ScheduleSchema(Schema):

    title = fields.String(
        required=True,
        validate=validate.Length(min=2)
    )

    description = fields.String()

    start_time = fields.DateTime(
        required=True
    )

    end_time = fields.DateTime(
        required=True
    )

    child_id = fields.Integer(
        required=True
    )

    @validates_schema
    def validate_schedule(self, data, **kwargs):

        start_time = data.get("start_time")

        end_time = data.get("end_time")

        if start_time and end_time:

            if end_time <= start_time:

                raise ValidationError(
                    "End time must be after start time"
                )