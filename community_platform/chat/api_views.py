from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response

from .models import ChatMessage


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_messages(request, session_id):

    messages = ChatMessage.objects.filter(
        session_id=session_id
    ).order_by("created_at")

    data = [
        {
            "user": m.user.username,
            "message": m.message,
            "created_at": m.created_at
        }
        for m in messages
    ]

    return Response(data)