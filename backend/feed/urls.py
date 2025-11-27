from django.urls import path
from .views import launches_view, asteroids_view

urlpatterns = [
    path('launches/', launches_view, name='spacex-launches'),
    path('asteroids/', asteroids_view, name='nasa-asteroids'),
]
