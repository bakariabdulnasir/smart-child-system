from marshmallow import (
    Schema,
    fields,
    validate
)


class SupportResponseSchema(Schema):

    message = fields.String(
        required=True,
        validate=validate.Length(min=2)
    )

    status = fields.String()