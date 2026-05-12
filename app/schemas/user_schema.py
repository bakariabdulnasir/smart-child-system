from marshmallow import (
    Schema,
    fields,
    validate,
    validates_schema,
    ValidationError
)


class UserRegisterSchema(Schema):

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

    @validates_schema
    def validate_passwords(self, data, **kwargs):

        if data["password"] != data["confirm_password"]:
            raise ValidationError(
                "Passwords do not match",
                field_name="confirm_password"
            )