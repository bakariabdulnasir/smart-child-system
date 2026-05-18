from flask import request

from marshmallow import ValidationError

from flask_jwt_extended import (
    get_jwt_identity
)

from app.extensions.extensions import db

from app.models.support_request import (
    SupportRequest
)

from app.models.support_response import (
    SupportResponse
)

from app.schemas.support_request_schema import (
    SupportRequestSchema
)

from app.schemas.support_response_schema import (
    SupportResponseSchema
)

from app.utils.response import (
    success_response,
    error_response
)


support_request_schema = SupportRequestSchema()

support_response_schema = SupportResponseSchema()


# CREATE SUPPORT REQUEST

def create_support_request():

    try:

        current_user_id = get_jwt_identity()

        data = request.get_json()

        validated_data = support_request_schema.load(data)

        support_request = SupportRequest(
            title=validated_data["title"],
            description=validated_data["description"],
            request_type=validated_data["request_type"],
            location=validated_data["location"],
            needed_at=validated_data["needed_at"],
            status=validated_data.get(
                "status",
                "open"
            ),
            user_id=current_user_id
        )

        db.session.add(support_request)

        db.session.commit()

        return success_response(
            message="Support request created successfully",
            data={
                "support_request": {
                    "id": support_request.id,
                    "title": support_request.title,
                    "status": support_request.status
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
            message="Support request creation failed",
            errors=str(e),
            status_code=500
        )


# GET ALL SUPPORT REQUESTS

from flask import request

def get_support_requests():
    try:
        page = request.args.get(
            "page",
            1,
            type=int
        )

        per_page = request.args.get(
            "per_page",
            10,
            type=int
        )

        status = request.args.get(
            "status"
        )

        search = request.args.get(
            "search"
        )

        query = SupportRequest.query

        if status:
            query = query.filter(
                SupportRequest.status == status
            )

        if search:
            query = query.filter(
                SupportRequest.title.ilike(
                    f"%{search}%"
                )
            )

        paginated_requests = query.paginate(
            page=page,
            per_page=per_page,
            error_out=False
        )

        requests_data = []

        for support_request in paginated_requests.items:
            requests_data.append({
                "id": support_request.id,
                "title": support_request.title,
                "status": support_request.status,
                "location": support_request.location
            })

        return success_response(
            message="Support requests retrieved successfully",
            data={
                "support_requests": requests_data,
                "pagination": {
                    "page": paginated_requests.page,
                    "pages": paginated_requests.pages,
                    "total": paginated_requests.total
                }
            },
            status_code=200
        )

    except Exception as e:
        return error_response(
            message="Failed to retrieve support requests",
            errors=str(e),
            status_code=500
        )


# GET SINGLE SUPPORT REQUEST

def get_support_request(request_id):

    try:

        support_request = SupportRequest.query.get(
            request_id
        )

        if not support_request:

            return error_response(
                message="Support request not found",
                status_code=404
            )

        return success_response(
            message="Support request retrieved successfully",
            data={
                "support_request": {
                    "id": support_request.id,
                    "title": support_request.title,
                    "description": support_request.description,
                    "request_type": support_request.request_type,
                    "location": support_request.location,
                    "status": support_request.status,
                    "needed_at": support_request.needed_at,
                    "user_id": support_request.user_id
                }
            },
            status_code=200
        )

    except Exception as e:

        return error_response(
            message="Failed to retrieve support request",
            errors=str(e),
            status_code=500
        )


# UPDATE SUPPORT REQUEST

def update_support_request(request_id):

    try:

        current_user_id = get_jwt_identity()

        support_request = SupportRequest.query.filter_by(
            id=request_id,
            user_id=current_user_id
        ).first()

        if not support_request:

            return error_response(
                message="Support request not found",
                status_code=404
            )

        data = request.get_json()

        validated_data = support_request_schema.load(
            data,
            partial=True
        )

        support_request.title = validated_data.get(
            "title",
            support_request.title
        )

        support_request.description = validated_data.get(
            "description",
            support_request.description
        )

        support_request.request_type = validated_data.get(
            "request_type",
            support_request.request_type
        )

        support_request.location = validated_data.get(
            "location",
            support_request.location
        )

        support_request.status = validated_data.get(
            "status",
            support_request.status
        )

        support_request.needed_at = validated_data.get(
            "needed_at",
            support_request.needed_at
        )

        db.session.commit()

        return success_response(
            message="Support request updated successfully",
            data={
                "support_request": {
                    "id": support_request.id,
                    "status": support_request.status
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
            message="Failed to update support request",
            errors=str(e),
            status_code=500
        )


# DELETE SUPPORT REQUEST

def delete_support_request(request_id):

    try:

        current_user_id = get_jwt_identity()

        support_request = SupportRequest.query.filter_by(
            id=request_id,
            user_id=current_user_id
        ).first()

        if not support_request:

            return error_response(
                message="Support request not found",
                status_code=404
            )

        db.session.delete(support_request)

        db.session.commit()

        return success_response(
            message="Support request deleted successfully",
            status_code=200
        )

    except Exception as e:

        return error_response(
            message="Failed to delete support request",
            errors=str(e),
            status_code=500
        )


# CREATE SUPPORT RESPONSE

def create_support_response(request_id):

    try:

        current_user_id = get_jwt_identity()

        support_request = SupportRequest.query.get(
            request_id
        )

        if not support_request:

            return error_response(
                message="Support request not found",
                status_code=404
            )

        data = request.get_json()

        validated_data = support_response_schema.load(
            data
        )

        support_response = SupportResponse(
            message=validated_data["message"],
            status=validated_data.get(
                "status",
                "pending"
            ),
            support_request_id=request_id,
            user_id=current_user_id
        )

        db.session.add(support_response)

        db.session.commit()

        return success_response(
            message="Support response created successfully",
            data={
                "support_response": {
                    "id": support_response.id,
                    "message": support_response.message
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
            message="Failed to create support response",
            errors=str(e),
            status_code=500
        )


# GET SUPPORT RESPONSES

def get_support_responses(request_id):

    try:

        support_request = SupportRequest.query.get(
            request_id
        )

        if not support_request:

            return error_response(
                message="Support request not found",
                status_code=404
            )

        responses = SupportResponse.query.filter_by(
            support_request_id=request_id
        ).all()

        responses_data = []

        for response in responses:

            responses_data.append({
                "id": response.id,
                "message": response.message,
                "status": response.status,
                "user_id": response.user_id,
                "created_at": response.created_at
            })

        return success_response(
            message="Support responses retrieved successfully",
            data={
                "support_responses": responses_data
            },
            status_code=200
        )

    except Exception as e:

        return error_response(
            message="Failed to retrieve support responses",
            errors=str(e),
            status_code=500
        )