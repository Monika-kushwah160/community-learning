from rest_framework import serializers
from .models import Session, Enrollment, SessionFeedback
from django.contrib.auth import get_user_model

User = get_user_model()


class SessionSerializer(serializers.ModelSerializer):
    instructor = serializers.StringRelatedField()

    class Meta:
        model = Session
        fields = "__all__"


class SessionCreateSerializer(serializers.ModelSerializer):
    class Meta:
        model = Session
        exclude = ["instructor", "created_at"]


class FeedbackSerializer(serializers.ModelSerializer):
    class Meta:
        model = SessionFeedback
        fields = ["rating", "comment"]