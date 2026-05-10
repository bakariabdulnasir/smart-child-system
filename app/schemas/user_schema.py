from marshmallow import fields, validate

from app.extensions.extensions import ma


class UserRegisterSchema(ma.Schema):

    full_name = fields.String(
        required=True,
        validate=validate.Length(min=3)
    )

    email = fields.Email(
        required=True
    )

    password = fields.String(
        required=True,
        validate=validate.Length(min=6)
    )

    confirm_password = fields.String(
        required=True
    )