from flask import request

from flask_jwt_extended import (
    get_jwt_identity
)

from app.extensions.extensions import db

from app.models.user import User

from app.models.child import Child

from app.utils.file_upload import (
    save_file
)

from app.utils.response import (
    success_response,
    error_response
)


# UPLOAD USER PROFILE IMAGE

def upload_user_profile_image():

    try:

        current_user_id = get_jwt_identity()

        user = User.query.get(
            current_user_id
        )

        if not user:

            return error_response(
                message="User not found",
                status_code=404
            )

        if "image" not in request.files:

            return error_response(
                message="No image file provided",
                status_code=400
            )

        file = request.files["image"]

        if file.filename == "":

            return error_response(
                message="No selected file",
                status_code=400
            )

        file_path = save_file(
            file,
            "users"
        )

        if not file_path:

            return error_response(
                message="Invalid image format",
                status_code=400
            )

        user.profile_image = file_path

        db.session.commit()

        return success_response(
            message="Profile image uploaded successfully",
            data={
                "profile_image": file_path
            },
            status_code=200
        )

    except Exception as e:

        return error_response(
            message="Failed to upload profile image",
            errors=str(e),
            status_code=500
        )


# UPLOAD CHILD PROFILE IMAGE

def upload_child_profile_image(child_id):

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

        if "image" not in request.files:

            return error_response(
                message="No image file provided",
                status_code=400
            )

        file = request.files["image"]

        if file.filename == "":

            return error_response(
                message="No selected file",
                status_code=400
            )

        file_path = save_file(
            file,
            "children"
        )

        if not file_path:

            return error_response(
                message="Invalid image format",
                status_code=400
            )

        child.profile_image = file_path

        db.session.commit()

        return success_response(
            message="Child profile image uploaded successfully",
            data={
                "profile_image": file_path
            },
            status_code=200
        )

    except Exception as e:

        return error_response(
            message="Failed to upload child profile image",
            errors=str(e),
            status_code=500
        )