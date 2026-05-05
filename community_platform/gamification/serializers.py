from rest_framework import serializers
from .models import UserBadge
from accounts.models import User


class LeaderboardSerializer(serializers.ModelSerializer):
    sessions_attended = serializers.IntegerField()
    sessions_taught = serializers.IntegerField()

    class Meta:
        model = User
        fields = ["id", "username", "points", "sessions_attended", "sessions_taught"]


class BadgeSerializer(serializers.ModelSerializer):
    name = serializers.CharField(source="badge.name")
    description = serializers.CharField(source="badge.description")

    class Meta:
        model = UserBadge
        fields = ["name", "description"]