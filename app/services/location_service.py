import requests
import math


OVERPASS_URL = (
    "https://overpass-api.de/api/interpreter"
)


# Creative mock data for Nairobi locations when API fails
NAIROBI_MOCK_DATA = {
    "school": [
        {"name": "Nairobi Primary School", "latitude": -1.2867, "longitude": 36.8315, "address": "Nairobi Central, Kenyatta Avenue"},
        {"name": "Strathmore University", "latitude": -1.3156, "longitude": 36.8119, "address": "Madaraka Estate, Ole Sangale Road"},
        {"name": "Kenya High School", "latitude": -1.2987, "longitude": 36.7879, "address": "Mbagathi Way, Kilimani"},
        {"name": "St. Mary's School", "latitude": -1.2456, "longitude": 36.8745, "address": "Langata Road, Karen"},
        {"name": "International School of Kenya", "latitude": -1.2234, "longitude": 36.8912, "address": "Rwanda Road, Gigiri"},
        {"name": "Nairobi International School", "latitude": -1.3045, "longitude": 36.8123, "address": "Valley Road, Parklands"},
        {"name": "Kenyatta University Primary", "latitude": -1.3923, "longitude": 36.6412, "address": "Kenyatta University, Kahawa"},
        {"name": "Mombasa Road Primary School", "latitude": -1.3423, "longitude": 36.8901, "address": "Mombasa Road, South B"},
    ],
    "hospital": [
        {"name": "Kenyatta National Hospital", "latitude": -1.2963, "longitude": 36.7962, "address": "Hospital Road, Upper Hill"},
        {"name": "Aga Khan University Hospital", "latitude": -1.2833, "longitude": 36.8214, "address": "Third Parklands Avenue, Parklands"},
        {"name": "Nairobi Hospital", "latitude": -1.2987, "longitude": 36.7899, "address": "Upper Hill Road, Kilimani"},
        {"name": "Mater Hospital", "latitude": -1.3123, "longitude": 36.8456, "address": "Mater Close, South C"},
        {"name": "St. Mary's Hospital", "latitude": -1.2567, "longitude": 36.8567, "address": "Langata Road, Karen"},
        {"name": "Coptic Hospital", "latitude": -1.2845, "longitude": 36.8712, "address": "Ngong Road, Ongata Rongai"},
        {"name": "Eastleigh Health Centre", "latitude": -1.2345, "longitude": 36.8923, "address": "First Avenue, Eastleigh"},
        {"name": "Kisumu County Referral Hospital", "latitude": -0.1022, "longitude": 34.7616, "address": "Kisumu, Lake Region"},
    ],
    "park": [
        {"name": "Uhuru Park", "latitude": -1.2867, "longitude": 36.8312, "address": "Central Business District"},
        {"name": "Karura Forest", "latitude": -1.2345, "longitude": 36.8123, "address": "Kiambu Road, Karura"},
        {"name": "Central Park", "latitude": -1.2987, "longitude": 36.7879, "address": "Nairobi West, Lower Kabete"},
        {"name": " arboretum Park", "latitude": -1.2345, "longitude": 36.8234, "address": "Forest Road, Ngara"},
        {"name": "Jeevanjee Gardens", "latitude": -1.2845, "longitude": 36.8256, "address": "Maven Road, Central"},
        {"name": "Nairobi National Park", "latitude": -1.3567, "longitude": 36.8123, "address": "Langata Road, Mombasa"},
        {"name": "Oloolua Nature Trail", "latitude": -1.4234, "longitude": 36.7823, "address": "Kiserian Road, Ngong"},
        {"name": "Mamba swamps", "latitude": -1.3456, "longitude": 36.8656, "address": "Mombasa Road, Dandora"},
    ],
    "supermarket": [
        {"name": "Westgate Mall", "latitude": -1.2867, "longitude": 36.8312, "address": "Mwimbi Road, Westlands"},
        {"name": "Garden City Mall", "latitude": -1.2345, "longitude": 36.8923, "address": "Thika Road, Roysambu"},
        {"name": "Two Rivers Mall", "latitude": -1.3567, "longitude": 36.7823, "address": "Limuru Road, Kiambu"},
        {"name": "The Mall Westlands", "latitude": -1.2845, "longitude": 36.8256, "address": "Waiyaki Way, Westlands"},
        {"name": "Galleria Mall", "latitude": -1.4234, "longitude": 36.8923, "address": "Langata Road, Karen"},
        {"name": "Crossroads Mall", "latitude": -1.2987, "longitude": 36.7879, "address": "W、高公路, Kilimani"},
        {"name": "Karen Shopping Centre", "latitude": -1.2456, "longitude": 36.8745, "address": "Karen Road, Karen"},
        {"name": "Jiran Market", "latitude": -1.2845, "longitude": 36.8712, "address": "Jiran Road, Ongata Rongai"},
    ],
    "library": [
        {"name": "Kenya National Library", "latitude": -1.2867, "longitude": 36.8312, "address": "Kenyatta Avenue, Central"},
        {"name": "McMillan Library", "latitude": -1.2845, "longitude": 36.8256, "address": "McMillan Street, Central"},
        {"name": "Kenyatta University Library", "latitude": -1.3923, "longitude": 36.6412, "address": "Kenyatta University, Kahawa"},
        {"name": "Strathmore University Library", "latitude": -1.3156, "longitude": 36.8119, "address": "Madaraka Estate"},
        {"name": "Goethe Institute Library", "latitude": -1.2987, "longitude": 36.7879, "address": "Library Lane, Kilimani"},
        {"name": "British Council Library", "latitude": -1.2845, "longitude": 36.8234, "address": "Upper Hill Road"},
    ],
    "pharmacy": [
        {"name": "Pharmplus Pharmacy", "latitude": -1.2867, "longitude": 36.8312, "address": "Kenyatta Avenue, Central"},
        {"name": "Medix Pharmacy", "latitude": -1.2845, "longitude": 36.8256, "address": "Westlands, Waiyaki Way"},
        {"name": "Globe Pharmacy", "latitude": -1.2987, "longitude": 36.7879, "address": "Upper Hill, Kilimani"},
        {"name": "Crown Pharmacy", "latitude": -1.2345, "longitude": 36.8923, "address": "Thika Road, Garden City"},
        {"name": "MediCare Pharmacy", "latitude": -1.2456, "longitude": 36.8745, "address": "Langata, Karen"},
        {"name": "Health Plus Pharmacy", "latitude": -1.2845, "longitude": 36.8712, "address": "Ngong Road, Ongata"},
    ],
    "playground": [
        {"name": "Uhuru Park Playground", "latitude": -1.2867, "longitude": 36.8312, "address": "Central Business District"},
        {"name": "Kilimani Playground", "latitude": -1.2987, "longitude": 36.7879, "address": "Kilimani Drive, Kilimani"},
        {"name": "Westlands Playground", "latitude": -1.2845, "longitude": 36.8256, "address": "Westlands, Waiyaki Way"},
        {"name": "Karen Playground", "latitude": -1.2456, "longitude": 36.8745, "address": "Karen Road, Karen"},
        {"name": "Langata Playground", "latitude": -1.3567, "longitude": 36.8123, "address": "Langata Road, Mombasa"},
        {"name": "Kasarani Playground", "latitude": -1.2234, "longitude": 36.8912, "address": "Kasarani Stadium"},
    ],
}


def calculate_distance(lat1, lon1, lat2, lon2):
    """Calculate distance between two points in km"""
    R = 6371  # Earth's radius in km
    dlat = math.radians(lat2 - lat1)
    dlon = math.radians(lon2 - lon1)
    a = (math.sin(dlat/2) ** 2 + 
         math.cos(math.radians(lat1)) * math.cos(math.radians(lat2)) * 
         math.sin(dlon/2) ** 2)
    c = 2 * math.atan2(math.sqrt(a), math.sqrt(1-a))
    return R * c


def get_mock_places_nearby(latitude, longitude, amenity, radius_km=15):
    """Get mock places from Nairobi data within radius"""
    mock_data = NAIROBI_MOCK_DATA.get(amenity, [])
    places = []
    for place in mock_data:
        distance = calculate_distance(
            latitude, longitude,
            place["latitude"], place["longitude"]
        )
        if distance <= radius_km:
            places.append({
                "name": place["name"],
                "lat": place["latitude"],
                "lng": place["longitude"],
                "address": place.get("address", "Address not available"),
                "distance": round(distance, 2),
                "amenity": amenity
            })
    places.sort(key=lambda x: x["distance"])
    return places


def search_nearby_places(latitude, longitude, amenity):
    query = f"""
    [out:json];
    (
      node["amenity"="{amenity}"](around:5000,{latitude},{longitude});
      way["amenity"="{amenity}"](around:5000,{latitude},{longitude});
      relation["amenity"="{amenity}"](around:5000,{latitude},{longitude});
    );
    out center;
    """

    try:
        response = requests.get(
            OVERPASS_URL,
            params={"data": query},
            timeout=10
        )

        if response.status_code != 200:
            return get_mock_places_nearby(latitude, longitude, amenity)

        data = response.json()
        elements = data.get("elements", [])
        
        if len(elements) < 3:
            mock_places = get_mock_places_nearby(latitude, longitude, amenity)
            places = []
            for element in elements:
                tags = element.get("tags", {})
                lat = element.get("lat")
                lon = element.get("lon")
                
                if not lat:
                    center = element.get("center", {})
                    lat = center.get("lat")
                    lon = center.get("lon")
                
                if lat and lon:
                    distance = calculate_distance(latitude, longitude, lat, lon)
                    places.append({
                        "name": tags.get("name", "Unknown"),
                        "lat": lat,
                        "lng": lon,
                        "address": tags.get("addr:street", "Address not available"),
                        "distance": round(distance, 2),
                        "amenity": amenity
                    })
            
            combined = places + mock_places
            combined.sort(key=lambda x: x["distance"])
            return combined[:20]

        places = []
        for element in elements:
            tags = element.get("tags", {})
            lat = element.get("lat")
            lon = element.get("lon")

            if not lat:
                center = element.get("center", {})
                lat = center.get("lat")
                lon = center.get("lon")

            if lat and lon:
                distance = calculate_distance(latitude, longitude, lat, lon)
                places.append({
                    "name": tags.get("name", "Unknown"),
                    "lat": lat,
                    "lng": lon,
                    "address": tags.get("addr:street", "Address not available"),
                    "distance": round(distance, 2),
                    "amenity": amenity
                })

        places.sort(key=lambda x: x["distance"])
        return places[:20]

    except Exception as e:
        return get_mock_places_nearby(latitude, longitude, amenity)
