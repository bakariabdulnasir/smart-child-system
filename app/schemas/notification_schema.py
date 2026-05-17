from marshmallow import (
    Schema,
    fields,
    validate
)


class NotificationSchema(Schema):

    title = fields.String(
        required=True,
        validate=validate.Length(min=2)
    )

    message = fields.String(
        required=True,
        validate=validate.Length(min=2)
    )

    type = fields.String(
        validate=validate.OneOf([
            "system",
            "task",
            "schedule",
            "reminder"
        ])
    )

    is_read = fields.Boolean()