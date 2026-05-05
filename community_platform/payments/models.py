from django.db import models
from django.conf import settings
from sessions_app.models import Session


class Payment(models.Model):

    user = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.CASCADE
    )

    session = models.ForeignKey(
        Session,
        on_delete=models.CASCADE
    )

    amount = models.DecimalField(max_digits=8, decimal_places=2)

    stripe_payment_id = models.CharField(max_length=200)

    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user} - {self.session}"