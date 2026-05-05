from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from accounts.models import User
from .models import Badge, UserBadge
from sessions_app.models import Enrollment, Session


def check_badges(user):
    """
    Check if the user qualifies for new badges
    """

    badges = Badge.objects.filter(points_required__lte=user.points)

    for badge in badges:
        UserBadge.objects.get_or_create(
            user=user,
            badge=badge
        )


@login_required
def my_badges(request):

    badges = UserBadge.objects.filter(user=request.user)

    return render(
        request,
        "gamification/my_badges.html",
        {"badges": badges}
    )


def leaderboard(request):

    users = User.objects.order_by("-points")[:10]

    for user in users:
        user.sessions_attended = Enrollment.objects.filter(user=user).count()
        user.sessions_taught = Session.objects.filter(instructor=user).count()

    return render(
        request,
        "gamification/leaderboard.html",
        {"users": users}
    )