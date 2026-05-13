from flask import jsonify


def success_response(
    message,
    data=None,
    status_code=200
):

    response = {
        "success": True,
        "status_code": status_code,
        "message": message,
        "data": data
    }

    return jsonify(response), status_code


def error_response(
    message,
    errors=None,
    status_code=400
):

    response = {
        "success": False,
        "status_code": status_code,
        "message": message,
        "errors": errors
    }

    return jsonify(response), status_code