from django.contrib.auth.models import User
from django.forms import ModelForm


__author__ = 'kremerdesign'



class UserForm(ModelForm):
    class Meta:
        model = User
        fields = ['first_name', 'last_name', 'email', 'password', 'username']


