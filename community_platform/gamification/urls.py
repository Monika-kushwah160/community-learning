from django.urls import path
from .api_views import leaderboard_api, my_badges_api

urlpatterns = [
    path("api/leaderboard/", leaderboard_api),
    path("api/badges/", my_badges_api),
]