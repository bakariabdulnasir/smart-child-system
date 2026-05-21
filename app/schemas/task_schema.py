from marshmallow import (
    Schema,
    fields,
    validate
)


class TaskSchema(Schema):

    title = fields.String(
        required=True,
        validate=validate.Length(min=2)
    )

    description = fields.String()

    status = fields.String(
        validate=validate.OneOf([
            "pending",
            "completed"
        ])
    )

    priority = fields.String(
        validate=validate.OneOf([
            "low",
            "medium",
            "high"
        ])
    )

    due_date = fields.Date()

child_id = fields.Integer(
        required=False,
        allow_none=True
    )
