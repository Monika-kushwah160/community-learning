from django.urls import path
from .api_views import get_messages

urlpatterns = [
    path("api/chat/<int:session_id>/", get_messages),
]