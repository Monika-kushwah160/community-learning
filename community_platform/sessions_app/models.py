from django.db import models
from django.conf import settings

User = settings.AUTH_USER_MODEL


class Session(models.Model):

    SESSION_TYPE = (
        ('live', 'Live'),
        ('recorded', 'Recorded')
    )

    title = models.CharField(max_length=200)

    instructor = models.ForeignKey(
        User,
        on_delete=models.CASCADE,
        related_name="sessions"
    )

    category = models.CharField(max_length=100)

    description = models.TextField()

    datetime = models.DateTimeField()

    session_type = models.CharField(
        max_length=10,
        choices=SESSION_TYPE
    )

    recorded_file = models.FileField(
        upload_to="recordings/",
        blank=True,
        null=True
    )

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Enrollment(models.Model):

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    session = models.ForeignKey(
        Session,
        on_delete=models.CASCADE,
        related_name="enrollments"
    )

    enrolled_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} enrolled in {self.session}"


class SessionFeedback(models.Model):

    session = models.ForeignKey(
        Session,
        on_delete=models.CASCADE,
        related_name="feedbacks"
    )

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    rating = models.IntegerField()

    comment = models.TextField(blank=True)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.session}"