from django.utils import timezone
import requests
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserRegistrationSerializer, UserProfileSerializer, UserLoginSerializer
from rest_framework.permissions import IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework.decorators import parser_classes
from django.contrib.auth import authenticate


@api_view(['GET'])
@permission_classes([AllowAny])
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


@api_view(['POST'])
@permission_classes([AllowAny])
def login_view(request):
    serializer = UserLoginSerializer(data=request.data)
    if serializer.is_valid():
        username = serializer.validated_data['username']
        password = serializer.validated_data['password']
        user = authenticate(username=username, password=password)

        if user is not None:
            refresh = RefreshToken.for_user(user)
            user_serializer = UserProfileSerializer(user, context={'request': request})
            return Response({
                'tokens': {'refresh': str(refresh), 'access': str(refresh.access_token), },
                'user': user_serializer.data,
                'message': 'Login successful'}, status=status.HTTP_200_OK)

        else:
            return Response({'error': 'Invalid credentials'}, status=status.HTTP_401_UNAUTHORIZED)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_view(request):
    user = request.user
    serializer = UserProfileSerializer(user, context={'request': request})
    return Response(serializer.data)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def profile_update_view(request):
    user = request.user
    serializer = UserProfileSerializer(user, data=request.data, partial=True, context={'request': request})
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)
    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
