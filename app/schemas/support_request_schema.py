from marshmallow import (
    Schema,
    fields,
    validate
)


class SupportRequestSchema(Schema):

    title = fields.String(
        required=True,
        validate=validate.Length(min=2)
    )

    description = fields.String(
        required=True,
        validate=validate.Length(min=5)
    )

    request_type = fields.String(
        required=True
    )

    location = fields.String(
        required=True
    )

    status = fields.String()

    needed_at = fields.DateTime(
        required=True
    )