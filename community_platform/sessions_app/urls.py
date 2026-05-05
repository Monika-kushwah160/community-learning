from django.urls import path
from .api_views import *

app_name = "sessions"

urlpatterns = [
    path("api/sessions/", session_list_api),
    path("api/sessions/<int:pk>/", session_detail_api),
    path("api/sessions/create/", create_session_api),
    path("api/sessions/join/<int:pk>/", join_session_api),
    path("api/sessions/feedback/<int:pk>/", feedback_api),
]