import os
import requests
from django.conf import settings
from django.core.files.base import ContentFile
from django.core.files.storage import default_storage
from django.utils import timezone
from django.contrib.auth import authenticate, get_user_model
from django.core.mail import send_mail
from django.contrib.auth.tokens import default_token_generator
from django.utils.http import urlsafe_base64_encode, urlsafe_base64_decode
from django.utils.encoding import force_bytes, force_str
from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.response import Response
from rest_framework import status
from rest_framework.permissions import AllowAny, IsAuthenticated
from rest_framework.parsers import MultiPartParser, FormParser
from rest_framework_simplejwt.tokens import RefreshToken
from .serializers import UserRegistrationSerializer, UserProfileSerializer, UserLoginSerializer
from django.core.files.base import ContentFile

User = get_user_model()


def save_default_avatar(user):
    try:
        avatar_url = f"https://ui-avatars.com/api/?name={user.username}&background=random&color=fff&size=512"
        response = requests.get(avatar_url, timeout=5)

        if response.status_code == 200:
            filename = f"avatar_{user.id}.png"
            user.avatar.save(filename, ContentFile(response.content), save=True)
            print(f"Default avatar saved for user {user.username}")

    except Exception as e:
        print(f"Failed to save default avatar: {e}")


def check_email_external(email):
    validation_url = f'https://rapid-email-verifier.fly.dev/api/validate?email={email}'
    try:
        response = requests.get(validation_url, timeout=5)
        if response.status_code == 200:
            data = response.json()
            validations = data.get('validations', {})

            if validations.get('mx_records') is False:
                return 'Invalid email domain. Cannot receive messages.'
            if validations.get('is_disposable') is True:
                return 'Disposable emails are not allowed.'
    except requests.exceptions.RequestException as e:
        print(f"Email validation API warning: {e}")
    return None


@api_view(['GET'])
@permission_classes([AllowAny])
def home_view(request):
    today = timezone.now()
    today_str = today.strftime('%Y-%m-%d')
    file_name = f"moon_{today_str}.jpg"
    upload_path = 'moon_phase/'
    full_file_path = os.path.join(upload_path, file_name)
    abs_folder_path = os.path.join(settings.MEDIA_ROOT, upload_path)

    if default_storage.exists(full_file_path):
        local_url = request.build_absolute_uri(settings.MEDIA_URL + full_file_path)
        return Response({
            'moon_image_url': local_url,
            'moon_phase_name': "Loaded from local cache"
        })
    api_url = f"https://svs.gsfc.nasa.gov/api/dialamoon?date={today_str}"
    data = {
        'moon_image_url': None,
        'moon_phase_name': "Could not load"
    }

    try:
        response = requests.get(api_url, timeout=10)
        if response.status_code == 200:
            nasa_data = response.json()
            remote_image_url = nasa_data.get('image', {}).get('url')
            phase_name = nasa_data.get('phase')
            if remote_image_url:
                img_response = requests.get(remote_image_url)
                if img_response.status_code == 200:
                    if not os.path.exists(abs_folder_path):
                        os.makedirs(abs_folder_path)
                    for file in os.listdir(abs_folder_path):
                        os.remove(os.path.join(abs_folder_path, file))
                    default_storage.save(full_file_path, ContentFile(img_response.content))
                    local_url = request.build_absolute_uri(settings.MEDIA_URL + full_file_path)

                    data['moon_image_url'] = local_url
                    data['moon_phase_name'] = phase_name

    except Exception as e:
        print(f"Error fetching/saving moon data: {e}")

    return Response(data)


@api_view(['POST'])
@permission_classes([AllowAny])
def registration_view(request):
    serializer = UserRegistrationSerializer(data=request.data)

    if serializer.is_valid():
        email = serializer.validated_data['email']
        error_message = check_email_external(email)

        if error_message:
            return Response({'email': [error_message]}, status=status.HTTP_400_BAD_REQUEST)

        user = serializer.save()
        save_default_avatar(user)
        user.is_active = False
        user.save()
        uid = urlsafe_base64_encode(force_bytes(user.pk))
        token = default_token_generator.make_token(user)
        activate_url = f"http://127.0.0.1:8000/api/activate/{uid}/{token}/"

        try:
            send_mail(
                subject='Activate your PULSAR account',
                message=f'Hi {user.username},\n\nPlease click the link to activate your account:\n{activate_url}',
                from_email=settings.DEFAULT_FROM_EMAIL,
                recipient_list=[user.email],
                fail_silently=False,
            )
        except Exception as e:
            print(f"Error sending email: {e}")
            return Response({'error': 'Error sending activation email'}, status=500)

        return Response({
            'message': 'User registered. Please check your email to activate account.',
            'email': user.email
        }, status=status.HTTP_201_CREATED)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['GET'])
@permission_classes([AllowAny])
def activate_account_view(request, uidb64, token):
    try:
        uid = force_str(urlsafe_base64_decode(uidb64))
        user = User.objects.get(pk=uid)

    except (TypeError, ValueError, OverflowError, User.DoesNotExist):
        user = None

    if user is not None and default_token_generator.check_token(user, token):
        user.is_active = True
        user.save()
        return Response({'message': 'Account activated successfully! You can now login.'}, status=status.HTTP_200_OK)
    else:
        return Response({'error': 'Activation link is invalid or expired'}, status=status.HTTP_400_BAD_REQUEST)


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


@api_view(['GET', 'PATCH'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def profile_view(request):
    user = request.user

    if request.method == 'GET':
        serializer = UserProfileSerializer(user, context={'request': request})
        return Response(serializer.data)

    elif request.method == 'PATCH':
        if request.data.get('delete_avatar') == 'true':
            user.avatar.delete()
            user.avatar = None
            save_default_avatar(user)
            user.refresh_from_db()

        serializer = UserProfileSerializer(user, data=request.data, partial=True, context={'request': request})

        if serializer.is_valid():
            serializer.save()

            if not user.avatar:
                print("Avatar is missing. Generating default file...")
                save_default_avatar(user)
                user.refresh_from_db()
                serializer = UserProfileSerializer(user, context={'request': request})

            return Response(serializer.data)

        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_profile_view(request):
    user = request.user
    user.delete()
    return Response(
        {"message": "User account has been deleted successfully"},
        status=status.HTTP_204_NO_CONTENT
    )
