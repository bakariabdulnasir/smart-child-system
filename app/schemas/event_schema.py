from marshmallow import (
    Schema,
    fields,
    validate
)

class EventSchema(Schema):

    title = fields.String(
        required=True,
        validate=validate.Length(min=2)
    )

    description = fields.String()

    location = fields.String(
        required=True,
        validate=validate.Length(min=2)
    )

    event_date = fields.DateTime(
        required=True
    )

    child_id = fields.Integer(required=False)
