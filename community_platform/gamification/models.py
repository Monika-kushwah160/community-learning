from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class Badge(models.Model):

    name = models.CharField(max_length=100)

    description = models.TextField()

    icon = models.CharField(max_length=50, blank=True)

    points_required = models.IntegerField()

    def __str__(self):
        return self.name


class UserBadge(models.Model):

    user = models.ForeignKey(
        User,
        on_delete=models.CASCADE
    )

    badge = models.ForeignKey(
        Badge,
        on_delete=models.CASCADE
    )

    awarded_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.badge}"



class Leaderboard(models.Model):

    user = models.OneToOneField(
        User,
        on_delete=models.CASCADE
    )

    rank = models.IntegerField(default=0)

    def __str__(self):
        return f"{self.user} - Rank {self.rank}"