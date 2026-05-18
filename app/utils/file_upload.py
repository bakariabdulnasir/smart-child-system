import os

from uuid import uuid4

from werkzeug.utils import secure_filename

from flask import current_app


ALLOWED_EXTENSIONS = {
    "png",
    "jpg",
    "jpeg",
    "gif"
}


def allowed_file(filename):

    return (
        "." in filename
        and filename.rsplit(".", 1)[1].lower()
        in ALLOWED_EXTENSIONS
    )


def save_file(file, folder_name):

    if not allowed_file(file.filename):

        return None

    filename = secure_filename(file.filename)

    unique_filename = (
        f"{uuid4().hex}_{filename}"
    )

    upload_path = os.path.join(
        current_app.config["UPLOAD_FOLDER"],
        folder_name
    )

    os.makedirs(upload_path, exist_ok=True)

    file_path = os.path.join(
        upload_path,
        unique_filename
    )

    file.save(file_path)

    return f"{folder_name}/{unique_filename}"
