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


# CREATE CHILD
def create_child():
    try:
        current_user_id = get_jwt_identity()

        user = User.query.get(current_user_id)

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
            parent_id=user.id
        )

        db.session.add(child)
        db.session.commit()

        return success_response(
            message="Child created successfully",
            data={
                "child": {
                    "id": child.id,
                    "full_name": child.full_name,
                    "age": child.age,
                    "gender": child.gender
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
            message="Child creation failed",
            errors=str(e),
            status_code=500
        )


# GET ALL CHILDREN
def get_children():
    try:
        current_user_id = get_jwt_identity()

        children = Child.query.filter_by(
            parent_id=current_user_id
        ).all()

        children_data = []

        for child in children:
            children_data.append({
                "id": child.id,
                "full_name": child.full_name,
                "age": child.age,
                "gender": child.gender
            })

        return success_response(
            message="Children retrieved successfully",
            data={
                "children": children_data
            },
            status_code=200
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
        current_user_id = get_jwt_identity()

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
                "child": {
                    "id": child.id,
                    "full_name": child.full_name,
                    "age": child.age,
                    "gender": child.gender
                }
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
        current_user_id = get_jwt_identity()

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

        child.full_name = validated_data.get(
            "full_name",
            child.full_name
        )

        child.age = validated_data.get(
            "age",
            child.age
        )

        child.gender = validated_data.get(
            "gender",
            child.gender
        )

        db.session.commit()

        return success_response(
            message="Child updated successfully",
            data={
                "child": {
                    "id": child.id,
                    "full_name": child.full_name,
                    "age": child.age,
                    "gender": child.gender
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
            message="Failed to update child",
            errors=str(e),
            status_code=500
        )


# DELETE CHILD
def delete_child(child_id):
    try:
        current_user_id = get_jwt_identity()

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