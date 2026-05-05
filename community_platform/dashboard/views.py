from django.shortcuts import render
from django.contrib.auth.decorators import login_required
from sessions_app.models import Session
from sessions_app.models import Enrollment


@login_required
def dashboard(request):

    sessions_taught = Session.objects.filter(
        instructor=request.user
    ).count()

    sessions_attended = Enrollment.objects.filter(
        user=request.user
    ).count()

    enrollments = Enrollment.objects.filter(
        user=request.user
    )

    my_sessions = Session.objects.filter(
        instructor=request.user
    )

    context = {
        "sessions_attended": sessions_attended,
        "sessions_taught": sessions_taught,
        "points": request.user.points,
        "badges": 0,
        "enrollments": enrollments,
        "my_sessions": my_sessions
    }

    return render(request, "dashboard/dashboard.html", context)