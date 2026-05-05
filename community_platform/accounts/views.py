from django.shortcuts import render, redirect, get_object_or_404
from django.contrib.auth import login
from django.contrib.auth.views import LoginView, LogoutView
from django.contrib.auth.decorators import login_required
from .tasks import send_welcome_email
from .forms import SignUpForm, ProfileForm
from .models import Profile,User


def signup_view(request):
    if request.method == "POST":
        form = SignUpForm(request.POST)

        if form.is_valid():
            user = form.save()

            # create profile automatically
            Profile.objects.create(user=user)

             # send email using celery
            send_welcome_email.delay(user.email, user.username)

            # redirect to login page
            return redirect("login")

    else:
        form = SignUpForm()

    return render(request, "accounts/signup.html", {"form": form})


# LOGIN VIEW
class CustomLoginView(LoginView):
    template_name = "accounts/login.html"

    def get_success_url(self):
        return "/"


# LOGOUT VIEW
class CustomLogoutView(LogoutView):
    next_page = "login"



# PROFILE VIEW
@login_required
def profile_view(request, user_id):
    user = get_object_or_404(User, id=user_id)
    profile, created = Profile.objects.get_or_create(user=user)

    return render(request, "accounts/profile.html", {
        "profile": profile,
        "user_obj": user
    })


# EDIT PROFILE
@login_required
def edit_profile(request, user_id):

    # prevent editing other users
    if request.user.id != user_id:
        return redirect("profile", user_id=request.user.id)

    profile, created = Profile.objects.get_or_create(user=request.user)

    if request.method == "POST":
        form = ProfileForm(request.POST, request.FILES, instance=profile)

        if form.is_valid():
            form.save()
            return redirect("profile", user_id=request.user.id)

    else:
        form = ProfileForm(instance=profile)

    return render(request, "accounts/edit_profile.html", {"form": form})

