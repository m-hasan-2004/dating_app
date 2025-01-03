from django import forms
from django.contrib.auth.forms import UserCreationForm, UserChangeForm
from users.user_related_models import User, AccessCode, validate_active_access_code
from django.utils.translation import gettext_lazy as _

class CustomUserCreationForm(UserCreationForm):
    access_code = forms.CharField(
        max_length=50,
        required=True,
        help_text=_("Enter an active access code for the user.")
    )

    def clean_access_code(self):
        access_code = self.cleaned_data.get('access_code')
        validate_active_access_code(access_code)
        return access_code

    def clean(self):
        cleaned_data = super().clean()
        access_code = cleaned_data.get('access_code')
        username = cleaned_data.get('username')
        email = cleaned_data.get('email')

        if not access_code:
            self.add_error('access_code', _("This field is required."))
        if not username:
            self.add_error('username', _("This field is required."))
        if not email:
            self.add_error('email', _("This field is required."))

        return cleaned_data

    def save(self, commit=True):
        user = super().save(commit=False)
        if commit:
            user.save()
            # Mark the access code as used
            code = AccessCode.objects.get(code=user.access_code)
            code.active = False
            code.save()
        return user

    class Meta:
        model = User
        fields = ("username", "email", "access_code", "password1", "password2")

class CustomUserChangeForm(UserChangeForm):
    def clean_access_code(self):
        # Don't validate access code during updates
        return self.cleaned_data.get('access_code')

    class Meta:
        model = User
        fields = ("username", "email", "password")  # Removed access_code from fields


