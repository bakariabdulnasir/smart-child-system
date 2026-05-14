from flask import jsonify

def success_response(message, data=None, status_code=200):
    response = {
        "success": True,
        "message": message,
        "data": data
    }
    return jsonify(response), status_code

def error_response(error, error_code=None, status_code=200):
    response = {
        "success": False,
        "error": error
    }
    
    if error_code:
        response["error_code"] = error_code
    
    return jsonify(response), status_code
