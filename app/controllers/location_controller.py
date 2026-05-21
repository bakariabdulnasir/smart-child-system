from flask import request

from app.services.location_service import (
    search_nearby_places
)

from app.utils.response import (
    success_response,
    error_response
)


def get_nearby_places():

    try:

        latitude_str = request.args.get("lat")
        longitude_str = request.args.get("lng")
        amenity = request.args.get("amenity")

        # Validate latitude is provided and is a valid number
        if not latitude_str:
            return error_response(
                message="Latitude is required",
                status_code=400
            )

        # Validate longitude is provided and is a valid number  
        if not longitude_str:
            return error_response(
                message="Longitude is required",
                status_code=400
            )

        # Validate amenity is provided
        if not amenity:
            return error_response(
                message="Amenity type required",
                status_code=400
            )

        # Convert to float and validate
        try:
            latitude = float(latitude_str)
            longitude = float(longitude_str)
        except (ValueError, TypeError):
            return error_response(
                message="Invalid latitude or longitude: must be numeric values",
                status_code=400
            )

        # Validate latitude range (-90 to 90)
        if latitude < -90 or latitude > 90:
            return error_response(
                message="Invalid latitude: must be between -90 and 90",
                status_code=400
            )

        # Validate longitude range (-180 to 180)
        if longitude < -180 or longitude > 180:
            return error_response(
                message="Invalid longitude: must be between -180 and 180",
                status_code=400
            )

        places = search_nearby_places(
            latitude,
            longitude,
            amenity
        )

        return success_response(
            message="Nearby places retrieved successfully",
            data=places,
            status_code=200
        )

    except Exception as e:

        return error_response(
            message="Failed to retrieve nearby places",
            errors=str(e),
            status_code=500
        )
