from django.urls import path
from .api_views import dashboard_api

urlpatterns = [
    path("api/dashboard/", dashboard_api),
]