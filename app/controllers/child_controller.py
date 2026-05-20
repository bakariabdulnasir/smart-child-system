from flask import request
from marshmallow import ValidationError
from flask_jwt_extended import get_jwt_identity

from app.extensions.extensions import db
from app.models.child import Child
from app.models.user import User
from app.schemas.child_schema import ChildSchema

from app.utils.response import (
    success_response,
    error_response
)

child_schema = ChildSchema()


def serialize_child(child):
    """Helper function to serialize a child object"""
    return {
        "id": child.id,
        "full_name": child.full_name,
        "age": child.age,
        "gender": child.gender,
        "profile_image": child.profile_image,
        "school": child.school,
        "medical_notes": child.medical_notes,
        "allergies": child.allergies,
        "emergency_contact": child.emergency_contact,
        "emergency_phone": child.emergency_phone,
        "created_at": child.created_at.isoformat() if child.created_at else None
    }


# CREATE CHILD
def create_child():
    try:
        current_user_id = get_jwt_identity()
        user_id = int(current_user_id)
        
        user = User.query.get(user_id)

        if not user:
            return error_response(
                message="User not found",
                status_code=404
            )

        data = request.get_json()

        validated_data = child_schema.load(data)

        child = Child(
            full_name=validated_data["full_name"],
            age=validated_data["age"],
            gender=validated_data["gender"],
            parent_id=user.id,
            profile_image=validated_data.get("profile_image"),
            school=validated_data.get("school"),
            medical_notes=validated_data.get("medical_notes"),
            allergies=validated_data.get("allergies"),
            emergency_contact=validated_data.get("emergency_contact"),
            emergency_phone=validated_data.get("emergency_phone")
        )

        db.session.add(child)
        db.session.commit()

        return success_response(
            message="Child created successfully",
            data={
                "child": serialize_child(child)
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
            message="Child creation failed",
            errors=str(e),
            status_code=500
        )


# GET ALL CHILDREN
def get_children():
    try:
        current_user_id_str = get_jwt_identity()
        
        if not current_user_id_str:
            return error_response(
                message="No user logged in",
                status_code=401
            )
        
        current_user_id = int(current_user_id_str)

        children = Child.query.filter_by(
            parent_id=current_user_id
        ).all()

        children_data = [serialize_child(child) for child in children]

        return success_response(
            message="Children retrieved successfully",
            data={
                "children": children_data
            },
            status_code=200
        )

    except ValueError:
        return error_response(
            message="Invalid user token",
            status_code=401
        )
    except Exception as e:
        return error_response(
            message="Failed to retrieve children",
            errors=str(e),
            status_code=500
        )


# GET SINGLE CHILD
def get_child(child_id):
    try:
        current_user_id = int(get_jwt_identity())

        child = Child.query.filter_by(
            id=child_id,
            parent_id=current_user_id
        ).first()

        if not child:
            return error_response(
                message="Child not found",
                status_code=404
            )

        return success_response(
            message="Child retrieved successfully",
            data={
                "child": serialize_child(child)
            },
            status_code=200
        )

    except Exception as e:
        return error_response(
            message="Failed to retrieve child",
            errors=str(e),
            status_code=500
        )


# UPDATE CHILD
def update_child(child_id):
    try:
        current_user_id = int(get_jwt_identity())

        child = Child.query.filter_by(
            id=child_id,
            parent_id=current_user_id
        ).first()

        if not child:
            return error_response(
                message="Child not found",
                status_code=404
            )

        data = request.get_json()

        validated_data = child_schema.load(
            data,
            partial=True
        )

        # Handle updates - only update if the field is provided in the request
        if "full_name" in data:
            child.full_name = data["full_name"]
        
        if "age" in data:
            child.age = data["age"]
        
        if "gender" in data:
            child.gender = data["gender"]
        
        # Handle profile_image - allow clearing by explicitly passing null
        if "profile_image" in data:
            child.profile_image = data["profile_image"]
        
        if "school" in data:
            child.school = data["school"]
        
        if "medical_notes" in data:
            child.medical_notes = data["medical_notes"]
        
        if "allergies" in data:
            child.allergies = data["allergies"]
        
        if "emergency_contact" in data:
            child.emergency_contact = data["emergency_contact"]
        
        if "emergency_phone" in data:
            child.emergency_phone = data["emergency_phone"]

        db.session.commit()

        return success_response(
            message="Child updated successfully",
            data={
                "child": serialize_child(child)
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
            message="Failed to update child",
            errors=str(e),
            status_code=500
        )


# DELETE CHILD
def delete_child(child_id):
    try:
        current_user_id = int(get_jwt_identity())

        child = Child.query.filter_by(
            id=child_id,
            parent_id=current_user_id
        ).first()

        if not child:
            return error_response(
                message="Child not found",
                status_code=404
            )

        db.session.delete(child)
        db.session.commit()

        return success_response(
            message="Child deleted successfully",
            status_code=200
        )

    except Exception as e:
        return error_response(
            message="Failed to delete child",
            errors=str(e),
            status_code=500
        )
