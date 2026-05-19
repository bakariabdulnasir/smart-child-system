import requests


OVERPASS_URL = (
    "https://overpass-api.de/api/interpreter"
)


def search_nearby_places(
    latitude,
    longitude,
    amenity
):

    query = f"""
    [out:json];

    (
      node["amenity"="{amenity}"]
      (around:5000,{latitude},{longitude});

      way["amenity"="{amenity}"]
      (around:5000,{latitude},{longitude});

      relation["amenity"="{amenity}"]
      (around:5000,{latitude},{longitude});
    );

    out center;
    """

    response = requests.get(
        OVERPASS_URL,
        params={
            "data": query
        }
    )

    if response.status_code != 200:

        return []

    data = response.json()

    places = []

    for element in data.get(
        "elements",
        []
    ):

        tags = element.get(
            "tags",
            {}
        )

        lat = element.get(
            "lat"
        )

        lon = element.get(
            "lon"
        )

        if not lat:

            center = element.get(
                "center",
                {}
            )

            lat = center.get(
                "lat"
            )

            lon = center.get(
                "lon"
            )

        places.append({
            "name": tags.get(
                "name",
                "Unknown"
            ),
            "latitude": lat,
            "longitude": lon,
            "amenity": amenity
        })

    return places