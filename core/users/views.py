from django.utils import timezone
import requests
from rest_framework.decorators import api_view
from rest_framework.response import Response


@api_view(['GET'])
def home_view(request):
    today = timezone.now()
    today_str = today.strftime('%Y-%m-%d')
    api_url = f"https://svs.gsfc.nasa.gov/api/dialamoon?date={today_str}"
    data = {
        'moon_image_url': None,
        'moon_phase_name': "Could not load"
    }

    try:
        response = requests.get(api_url)
        if response.status_code == 200:
            nasa_data = response.json()
            data['moon_image_url'] = nasa_data.get('image', {}).get('url')
            data['moon_phase_name'] = nasa_data.get('phase')

    except requests.exceptions.RequestException as e:
        print(f"Error fetching moon data: {e}")
    return Response(data)
