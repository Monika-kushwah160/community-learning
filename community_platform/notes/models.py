from django.db import models
from django.conf import settings
from sessions_app.models import Session

class Note(models.Model):
    session = models.ForeignKey(Session, on_delete=models.CASCADE, related_name='notes')
    author = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE,
        related_name="session_notes"
    )
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    attachment = models.FileField(upload_to='notes_attachments/', blank=True, null=True)

    def __str__(self):
        return f'Note by {self.author} on {self.session}'