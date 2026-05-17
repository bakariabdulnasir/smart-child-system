from marshmallow import (
    Schema,
    fields,
    validate
)


class ReminderSchema(Schema):

    title = fields.String(
        required=True,
        validate=validate.Length(min=2)
    )

    message = fields.String(
        required=True,
        validate=validate.Length(min=2)
    )

    reminder_time = fields.DateTime(
        required=True
    )

    is_sent = fields.Boolean()