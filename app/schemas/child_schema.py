from marshmallow import Schema, fields, validate

class ChildSchema(Schema):
    full_name = fields.String(
        required=True,
        validate=validate.Length(min=2)
    )

    age = fields.Integer(
        required=True
    )

    gender = fields.String(
        required=True,
        validate=validate.OneOf([
            "male",
            "female"
        ])
    )

    profile_image = fields.String(
        required=False,
        allow_none=True
    )

    school = fields.String(
        required=False,
        allow_none=True
    )

    medical_notes = fields.String(
        required=False,
        allow_none=True
    )

    allergies = fields.String(
        required=False,
        allow_none=True
    )

    emergency_contact = fields.String(
        required=False,
        allow_none=True
    )

    emergency_phone = fields.String(
        required=False,
        allow_none=True
    )
