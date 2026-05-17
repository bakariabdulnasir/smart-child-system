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