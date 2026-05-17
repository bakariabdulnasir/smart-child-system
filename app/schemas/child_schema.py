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