from django import forms
from .models import Session, SessionFeedback, Enrollment


class SessionForm(forms.ModelForm):

    class Meta:
        model = Session

        fields = [
            "title",
            "category",
            "description",
            "datetime",
            "session_type",
            "recorded_file"
        ]

class FeedbackForm(forms.ModelForm):

    class Meta:
        model = SessionFeedback
        fields = ["rating", "comment"]