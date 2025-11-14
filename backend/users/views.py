from django.utils import timezone
import requests
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from PULSAR.backend.users.serializers import UserRegistrationSerializer


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


@api_view(['POST'])
@permission_classes([AllowAny])
def registration_view(request):
    serializer = UserRegistrationSerializer(data=request.data)
    if serializer.is_valid():
        user = serializer.save()
        refresh = RefreshToken.for_user(user)

        return Response({
            'user': {
                'username': user.username,
                'email': user.email,
            },
            'tokens': {
                'refresh': str(refresh),
                'access': str(refresh.access_token),
            },
            'message': 'User registered successfully'
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)