from rest_framework import serializers
from sessions_app.models import Session, Enrollment


class SessionSerializer(serializers.ModelSerializer):
    instructor = serializers.StringRelatedField()

    class Meta:
        model = Session
        fields = ["id", "title", "datetime", "instructor"]


class EnrollmentSerializer(serializers.ModelSerializer):
    session = SessionSerializer()

    class Meta:
        model = Enrollment
        fields = ["session"]