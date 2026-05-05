"""
URL configuration for community_platform project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/4.2/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""

from django.urls import path
from .views import signup_view, CustomLoginView, CustomLogoutView, profile_view, edit_profile

# JWT imports
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from .api_views import profile_api,update_profile_api,register_api

urlpatterns = [
    # 🔹 Existing (DON'T TOUCH)
    path("signup/", signup_view, name="signup"),
    path("login/", CustomLoginView.as_view(), name="login"),
    path("logout/", CustomLogoutView.as_view(), name="logout"),
    path("profile/<int:user_id>/", profile_view, name="profile"),
    path("profile/edit/<int:user_id>/", edit_profile, name="edit_profile"),

    # 🔥 NEW JWT APIs
    path("api/token/", TokenObtainPairView.as_view(), name="token_obtain_pair"),
    path("api/token/refresh/", TokenRefreshView.as_view(), name="token_refresh"),
    path("api/profile/", profile_api, name="profile_api"),
    path("api/profile/", profile_api),
    path("api/profile/update/", update_profile_api),
    path("api/register/", register_api),
]