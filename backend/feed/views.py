from django.utils import timezone
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.response import Response
import requests


@api_view(['GET'])
@permission_classes([AllowAny])
def launches_view(request):
    url = "https://ll.thespacedevs.com/2.2.0/launch/upcoming/?limit=10"

    try:
        response = requests.get(url, timeout=10)

        if response.status_code == 200:
            data = response.json()
            results = data.get('results', [])

            clean_data = []
            for launch in results:
                clean_data.append({
                    'mission_name': launch['name'],
                    'date_utc': launch['net'],  # No Earlier Than
                    'rocket': launch['rocket']['configuration']['name'],
                    'location': launch['pad']['location']['name'],
                    'details': launch.get('mission', {}).get('description')
                    if launch.get('mission')
                    else "No description.",
                    'image': launch.get('image'),
                })

            return Response(clean_data)
        else:
            return Response({"error": "Launch API unavailable (Rate Limit)"}, status=response.status_code)

    except requests.exceptions.RequestException as e:
        return Response({"error": str(e)}, status=503)


@api_view(['GET'])
@permission_classes([AllowAny])
def asteroids_view(request):
    today = timezone.now().strftime('%Y-%m-%d')
    api_key = "44cRw2uQaRBSjD3dbq2V9z9XbkCzlHSHmO9EMn7K"
    url = f"https://api.nasa.gov/neo/rest/v1/feed?start_date={today}&end_date={today}&api_key={api_key}"

    try:
        response = requests.get(url, timeout=5)
        if response.status_code == 200:
            data = response.json()
            asteroids_today = data['near_earth_objects'][today]

            clean_data = []
            for asteroid in asteroids_today[:5]:
                clean_data.append({
                    'name': asteroid['name'],
                    'diameter_meters': asteroid['estimated_diameter']['meters']['estimated_diameter_max'],
                    'is_hazardous': asteroid['is_potentially_hazardous_asteroid'],  # Чи небезпечний?
                    'velocity_kmh': asteroid['close_approach_data'][0]['relative_velocity']['kilometers_per_hour'],
                    'miss_distance_km': asteroid['close_approach_data'][0]['miss_distance']['kilometers']
                })

            return Response({
                'date': today,
                'asteroids_count': data['element_count'],
                'asteroids': clean_data
            })
        else:
            return Response({"error": "NASA API Error"}, status=response.status_code)

    except requests.exceptions.RequestException as e:
        return Response({"error": str(e)}, status=503)
