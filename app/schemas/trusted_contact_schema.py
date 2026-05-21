from marshmallow import (
    Schema,
    fields,
    validate
)


class TrustedContactSchema(Schema):

    full_name = fields.String(
        required=True,
        validate=validate.Length(min=2)
    )

    phone_number = fields.String(
        required=True,
        validate=validate.Length(min=7)
    )

    email = fields.Email(
        allow_none=True,
        load_default=None
    )

    relationship = fields.String(
        required=True,
        validate=validate.Length(min=2)
    )

    address = fields.String()

    is_emergency_contact = fields.Boolean()
