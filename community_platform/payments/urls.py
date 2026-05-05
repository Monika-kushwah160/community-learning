from django.urls import path
from .api_views import create_checkout_session, verify_payment

urlpatterns = [
    path("api/checkout/<int:session_id>/", create_checkout_session),
    path("api/verify/", verify_payment),
]