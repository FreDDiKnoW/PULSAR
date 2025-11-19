from django.urls import path
from .views import registration_view, home_view, profile_view
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView


urlpatterns = [
        path('', home_view, name='home'),
        path('api/register/', registration_view, name='register'),
        path('api/login/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
        path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
        path('api/profile/', profile_view, name='profile'),
]
