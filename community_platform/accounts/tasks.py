from celery import shared_task
from django.core.mail import send_mail
from django.conf import settings


@shared_task
def send_welcome_email(user_email, username):
    subject = "Welcome to Community Platform"

    message = f"""
    Hi {username},

    Welcome to our Community Learning Platform.
    We are happy to have you here.

    Thanks
    Community Team
    """

    send_mail(
        subject,
        message,
        settings.EMAIL_HOST_USER,
        [user_email],
        fail_silently=False,
    )