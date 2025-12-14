from django.urls import path
from .views import home_view, profile_view, login_view, delete_profile_view, activate_account_view, registration_view, \
        ban_user_view
from rest_framework_simplejwt.views import TokenRefreshView


urlpatterns = [
        path('', home_view, name='home'),
        path('api/register/', registration_view, name='register'),
        path('api/login/', login_view, name='token_obtain_pair'),
        path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
        path('api/profile/', profile_view, name='profile'),
        path('api/profile/delete', delete_profile_view, name='profile_delete'),
        path('api/activate/<uidb64>/<token>/', activate_account_view, name='activate'),
        path('api/moderation/ban/', ban_user_view, name='ban_user'),
]
