from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import Profile
from .serializers import ProfileSerializer, RegisterSerializer


# 🔹 REGISTER API
@api_view(['POST'])
def register_api(request):
    serializer = RegisterSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save()
        return Response({"message": "User registered successfully"}, status=201)

    return Response(serializer.errors, status=400)


# 🔹 PROFILE GET
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def profile_api(request):
    profile, _ = Profile.objects.get_or_create(user=request.user)
    serializer = ProfileSerializer(profile)
    return Response(serializer.data)


# 🔹 PROFILE UPDATE
@api_view(['PUT', 'PATCH'])
@permission_classes([IsAuthenticated])
def update_profile_api(request):
    profile, _ = Profile.objects.get_or_create(user=request.user)

    serializer = ProfileSerializer(
        profile,
        data=request.data,
        partial=True
    )

    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data)

    return Response(serializer.errors, status=400)