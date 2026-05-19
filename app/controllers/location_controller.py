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

        latitude = request.args.get(
            "lat"
        )

        longitude = request.args.get(
            "lng"
        )

        amenity = request.args.get(
            "amenity"
        )

        if not latitude or not longitude:

            return error_response(
                message="Latitude and longitude required",
                status_code=400
            )

        if not amenity:

            return error_response(
                message="Amenity type required",
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