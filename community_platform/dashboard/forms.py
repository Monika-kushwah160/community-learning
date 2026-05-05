from django import forms
from .models import Video
from .models import Note

class VideoUploadForm(forms.ModelForm):
    class Meta:
        model = Video
        fields = ['title', 'video_file']

class NoteForm(forms.ModelForm):

    class Meta:
        model = Note
        fields = ['content']