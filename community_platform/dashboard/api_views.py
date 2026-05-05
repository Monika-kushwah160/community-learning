from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from sessions_app.models import Session, Enrollment
from .serializers import SessionSerializer, EnrollmentSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def dashboard_api(request):

    sessions_taught = Session.objects.filter(
        instructor=request.user
    ).count()

    sessions_attended = Enrollment.objects.filter(
        user=request.user
    ).count()

    enrollments = Enrollment.objects.filter(user=request.user)
    my_sessions = Session.objects.filter(instructor=request.user)

    return Response({
        "username": request.user.username,
        "points": request.user.points,
        "sessions_attended": sessions_attended,
        "sessions_taught": sessions_taught,
        "badges": 0,
        "enrollments": EnrollmentSerializer(enrollments, many=True).data,
        "my_sessions": SessionSerializer(my_sessions, many=True).data
    })