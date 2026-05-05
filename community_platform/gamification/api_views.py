from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from accounts.models import User
from sessions_app.models import Enrollment, Session
from .models import UserBadge
from .serializers import LeaderboardSerializer, BadgeSerializer


# 🔥 Leaderboard API
@api_view(['GET'])
def leaderboard_api(request):

    users = User.objects.order_by("-points")[:10]

    data = []

    for user in users:
        sessions_attended = Enrollment.objects.filter(user=user).count()
        sessions_taught = Session.objects.filter(instructor=user).count()

        data.append({
            "id": user.id,
            "username": user.username,
            "points": user.points,
            "sessions_attended": sessions_attended,
            "sessions_taught": sessions_taught,
        })

    return Response(data)


# 🔥 My Badges API
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_badges_api(request):

    badges = UserBadge.objects.filter(user=request.user)

    serializer = BadgeSerializer(badges, many=True)

    return Response(serializer.data)