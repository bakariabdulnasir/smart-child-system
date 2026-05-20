from marshmallow import (
    Schema,
    fields,
    validate,
    validates_schema,
    ValidationError
)


class UpdateProfileSchema(Schema):

    full_name = fields.String(
        validate=validate.Length(min=3)
    )

    email = fields.Email()
    
    profile_image = fields.String(allow_none=True)


class ChangePasswordSchema(Schema):

    current_password = fields.String(
        required=True
    )

    new_password = fields.String(
        required=True,
        validate=validate.Length(min=6)
    )

    confirm_password = fields.String(
        required=True
    )

    @validates_schema
    def validate_passwords(self, data, **kwargs):

        if data["new_password"] != data["confirm_password"]:

            raise ValidationError(
                "Passwords do not match",
                field_name="confirm_password"
            )