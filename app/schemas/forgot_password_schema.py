from marshmallow import (
    Schema,
    fields,
    validate,
    validates_schema,
    ValidationError
)


class ForgotPasswordSchema(Schema):
    """Schema for forgot password request"""
    
    email = fields.Email(
        required=True,
        error_messages={"required": "Email is required"}
    )


class ResetPasswordSchema(Schema):
    """Schema for password reset"""
    
    token = fields.String(
        required=True,
        error_messages={"required": "Token is required"}
    )
    
    password = fields.String(
        required=True,
        validate=validate.Length(min=6),
        error_messages={"required": "Password is required"}
    )
    
    confirm_password = fields.String(
        required=True,
        error_messages={"required": "Please confirm your password"}
    )

    @validates_schema
    def validate_passwords(self, data, **kwargs):
        """Validate that passwords match"""
        if data.get("password") != data.get("confirm_password"):
            raise ValidationError(
                "Passwords do not match",
                field_name="confirm_password"
            )


# Schema instances
forgot_password_schema = ForgotPasswordSchema()
reset_password_schema = ResetPasswordSchema()
