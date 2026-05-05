from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth.decorators import login_required
from chat.models import ChatMessage
from .models import Session, Enrollment
from .forms import SessionForm
from gamification.views import check_badges
from .models import SessionFeedback
from .forms import FeedbackForm


@login_required
def create_session(request):

    if request.method == "POST":
        form = SessionForm(request.POST, request.FILES)

        if form.is_valid():
            session = form.save(commit=False)
            session.instructor = request.user
            session.save()

            return redirect("sessions:session_list")

        else:
            print(form.errors)

    else:
        form = SessionForm()

    return render(request, "sessions/create_session.html", {"form": form})


def session_list(request):

    category = request.GET.get("category")

    if category:
        sessions = Session.objects.filter(category=category)
    else:
        sessions = Session.objects.all()

    return render(request, "sessions/session_list.html", {"sessions": sessions})


def session_detail(request, pk):

    session = get_object_or_404(Session, id=pk)

    return render(
        request,
        "sessions/session_detail.html",
        {"session": session}
    )


@login_required
def join_session(request, pk):

    session = get_object_or_404(Session, id=pk)

    enrollment, created = Enrollment.objects.get_or_create(
        user=request.user,
        session=session
    )

    if created:

        request.user.points += 10
        request.user.save()

        check_badges(request.user)

        message = "You successfully joined this session and earned 10 points!"

    else:

        message = "You already joined this session."

    # load last 30 chat messages
    messages = ChatMessage.objects.filter(
        session=session
    ).select_related("user").order_by("-created_at")[:30]

    messages = messages[::-1]

    return render(
        request,
        "sessions/join_session.html",
        {
            "session": session,
            "message": message,
            "messages": messages
        }
    )


@login_required
def leave_feedback(request, pk):

    session = get_object_or_404(Session, id=pk)

    if request.method == "POST":

        form = FeedbackForm(request.POST)

        if form.is_valid():

            feedback = form.save(commit=False)

            feedback.user = request.user
            feedback.session = session
            feedback.save()

            request.user.points += 5
            request.user.save()

            return redirect("sessions:session_detail", pk=pk)

    else:

        form = FeedbackForm()

    return render(
        request,
        "sessions/feedback.html",
        {
            "form": form,
            "session": session
        }
    )