from flask import request

from marshmallow import ValidationError

from flask_jwt_extended import (
    get_jwt_identity
)

from app.extensions.extensions import db

from app.models.trusted_contact import TrustedContact

from app.schemas.trusted_contact_schema import (
    TrustedContactSchema
)

from app.utils.response import (
    success_response,
    error_response
)


trusted_contact_schema = TrustedContactSchema()


# CREATE TRUSTED CONTACT

def create_trusted_contact():

    try:

        current_user_id = get_jwt_identity()

        data = request.get_json()

        validated_data = trusted_contact_schema.load(data)

        trusted_contact = TrustedContact(
            full_name=validated_data["full_name"],
            phone_number=validated_data["phone_number"],
            email=validated_data.get("email"),
            relationship=validated_data["relationship"],
            address=validated_data.get("address"),
            is_emergency_contact=validated_data.get(
                "is_emergency_contact",
                False
            ),
            user_id=current_user_id
        )

        db.session.add(trusted_contact)

        db.session.commit()

        return success_response(
            message="Trusted contact created successfully",
            data={
                "trusted_contact": {
                    "id": trusted_contact.id,
                    "full_name": trusted_contact.full_name,
                    "relationship": trusted_contact.relationship
                }
            },
            status_code=201
        )

    except ValidationError as err:

        return error_response(
            message="Validation failed",
            errors=err.messages,
            status_code=400
        )

    except Exception as e:

        return error_response(
            message="Trusted contact creation failed",
            errors=str(e),
            status_code=500
        )


# GET ALL TRUSTED CONTACTS

def get_trusted_contacts():

    try:

        current_user_id = get_jwt_identity()

        trusted_contacts = TrustedContact.query.filter_by(
            user_id=current_user_id
        ).all()

        trusted_contacts_data = []

        for contact in trusted_contacts:

            trusted_contacts_data.append({
                "id": contact.id,
                "full_name": contact.full_name,
                "phone_number": contact.phone_number,
                "email": contact.email,
                "relationship": contact.relationship,
                "address": contact.address,
                "is_emergency_contact": contact.is_emergency_contact
            })

        return success_response(
            message="Trusted contacts retrieved successfully",
            data={
                "trusted_contacts": trusted_contacts_data
            },
            status_code=200
        )

    except Exception as e:

        return error_response(
            message="Failed to retrieve trusted contacts",
            errors=str(e),
            status_code=500
        )


# GET SINGLE TRUSTED CONTACT

def get_trusted_contact(contact_id):

    try:

        current_user_id = get_jwt_identity()

        contact = TrustedContact.query.filter_by(
            id=contact_id,
            user_id=current_user_id
        ).first()

        if not contact:

            return error_response(
                message="Trusted contact not found",
                status_code=404
            )

        return success_response(
            message="Trusted contact retrieved successfully",
            data={
                "trusted_contact": {
                    "id": contact.id,
                    "full_name": contact.full_name,
                    "phone_number": contact.phone_number,
                    "email": contact.email,
                    "relationship": contact.relationship,
                    "address": contact.address,
                    "is_emergency_contact": contact.is_emergency_contact
                }
            },
            status_code=200
        )

    except Exception as e:

        return error_response(
            message="Failed to retrieve trusted contact",
            errors=str(e),
            status_code=500
        )


# UPDATE TRUSTED CONTACT

def update_trusted_contact(contact_id):

    try:

        current_user_id = get_jwt_identity()

        contact = TrustedContact.query.filter_by(
            id=contact_id,
            user_id=current_user_id
        ).first()

        if not contact:

            return error_response(
                message="Trusted contact not found",
                status_code=404
            )

        data = request.get_json()

        validated_data = trusted_contact_schema.load(
            data,
            partial=True
        )

        contact.full_name = validated_data.get(
            "full_name",
            contact.full_name
        )

        contact.phone_number = validated_data.get(
            "phone_number",
            contact.phone_number
        )

        contact.email = validated_data.get(
            "email",
            contact.email
        )

        contact.relationship = validated_data.get(
            "relationship",
            contact.relationship
        )

        contact.address = validated_data.get(
            "address",
            contact.address
        )

        contact.is_emergency_contact = validated_data.get(
            "is_emergency_contact",
            contact.is_emergency_contact
        )

        db.session.commit()

        return success_response(
            message="Trusted contact updated successfully",
            data={
                "trusted_contact": {
                    "id": contact.id,
                    "full_name": contact.full_name,
                    "phone_number": contact.phone_number,
                    "email": contact.email,
                    "relationship": contact.relationship,
                    "address": contact.address,
                    "is_emergency_contact": contact.is_emergency_contact
                }
            },
            status_code=200
        )

    except ValidationError as err:

        return error_response(
            message="Validation failed",
            errors=err.messages,
            status_code=400
        )

    except Exception as e:

        return error_response(
            message="Failed to update trusted contact",
            errors=str(e),
            status_code=500
        )


# DELETE TRUSTED CONTACT

def delete_trusted_contact(contact_id):

    try:

        current_user_id = get_jwt_identity()

        contact = TrustedContact.query.filter_by(
            id=contact_id,
            user_id=current_user_id
        ).first()

        if not contact:

            return error_response(
                message="Trusted contact not found",
                status_code=404
            )

        db.session.delete(contact)

        db.session.commit()

        return success_response(
            message="Trusted contact deleted successfully",
            status_code=200
        )

    except Exception as e:

        return error_response(
            message="Failed to delete trusted contact",
            errors=str(e),
            status_code=500
        )