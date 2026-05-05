from rest_framework.decorators import api_view, permission_classes, parser_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.shortcuts import get_object_or_404

from .models import Session, Enrollment
from .serializers import SessionSerializer, SessionCreateSerializer, FeedbackSerializer


# LIST
@api_view(['GET'])
def session_list_api(request):
    sessions = Session.objects.all()
    serializer = SessionSerializer(sessions, many=True)
    return Response(serializer.data)


# DETAIL
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def session_detail_api(request, pk):
    session = get_object_or_404(Session, id=pk)
    serializer = SessionSerializer(session)

    is_joined = Enrollment.objects.filter(
        user=request.user,
        session=session
    ).exists()

    data = serializer.data
    data["is_joined"] = is_joined   # ✅ add this

    return Response(data)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def create_session_api(request):
    serializer = SessionCreateSerializer(data=request.data)

    if serializer.is_valid():
        session = serializer.save(instructor=request.user)
        return Response(SessionSerializer(session).data)

    return Response(serializer.errors, status=400)



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def join_session_api(request, pk):
    session = get_object_or_404(Session, id=pk)

    enrollment, created = Enrollment.objects.get_or_create(
        user=request.user,
        session=session
    )

    if created:
        request.user.points += 10
        request.user.save()

        return Response({"message": "Joined successfully"})
    else:
        return Response({"message": "Already joined"})



@api_view(['POST'])
@permission_classes([IsAuthenticated])
def feedback_api(request, pk):
    session = get_object_or_404(Session, id=pk)

    serializer = FeedbackSerializer(data=request.data)

    if serializer.is_valid():
        serializer.save(user=request.user, session=session)
        return Response({"message": "Feedback submitted"})

    return Response(serializer.errors, status=400)