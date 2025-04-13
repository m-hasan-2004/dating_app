from django.contrib.auth.models import (
    BaseUserManager,
    AbstractBaseUser,
    PermissionsMixin,
)
from core.utils.validators.user_validators import UnicodeUsernameValidator
from core.utils.validators.shared import validate_active_access_code
from users.user_related_models import AccessCode
from phonenumber_field.modelfields import PhoneNumberField
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError
from core.utils.error_msgs.model_error_messages import UserErrorMessages
from core.utils.help_texts.help_text import UserHelpText
from django.utils import timezone
from django.urls import reverse
from django.db import models
from uuid import uuid4


class UserManager(BaseUserManager):
    def create_user(
        self, username, email, access_code=None, password=None, **extra_fields
    ):
        """
        Create and return a regular user with the given username, email, access code, and password.
        """
        if not email:
            raise ValueError(_("The Email field must be set."))
        if not access_code:
            raise ValueError(_("The Access Code must be set."))

        # Validate the access code
        validate_active_access_code(access_code)
        code = AccessCode.objects.get(code=access_code)

        email = self.normalize_email(email)
        username = self.model.normalize_username(username)
        user = self.model(
            username=username, email=email, access_code=access_code, **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)

        # Mark the access code as used
        code.active = False
        code.save()

        return user

    def create_superuser(self, username, email, password=None, **extra_fields):
        """
        Create and return a superuser with the given username, email, and password.
        Access code is optional for superusers.
        """
        extra_fields.setdefault("is_staff", True)
        extra_fields.setdefault("is_superuser", True)

        if extra_fields.get("is_staff") is not True:
            raise ValueError(_("Superuser must have is_staff=True."))
        if extra_fields.get("is_superuser") is not True:
            raise ValueError(_("Superuser must have is_superuser=True."))

        user = self.model(
            username=username, email=self.normalize_email(email), **extra_fields
        )
        user.set_password(password)
        user.save(using=self._db)
        return user


class User(AbstractBaseUser, PermissionsMixin):
    """
    User Model Based on  abstract base class implementing a fully featured User model with
    admin-compliant permissions.

    Username and password are required for login.
    """

    username_validator = UnicodeUsernameValidator()

    id = models.UUIDField(
        _("id"),
        primary_key=True,
        default=uuid4,
        editable=False,
        help_text=UserHelpText.ID,
    )
    access_code = models.CharField(
        _("User Access Code"),
        max_length=50,
        null=False,
        blank=False,
        validators=[validate_active_access_code],
        help_text=UserHelpText.ACCESS_CODE,
        error_messages=UserErrorMessages.ACCESS_CODE,
    )
    middle_man_code = models.CharField(
        _("Middle man code"),
        max_length=100,
        blank=True,
        null=True,
        help_text=UserHelpText.MIDDLE_MAN_CODE,
        error_messages=UserErrorMessages.MIDDLE_MAN_CODE,
    )
    username = models.CharField(
        _("username"),
        max_length=150,
        unique=True,
        help_text=UserHelpText.USERNAME,
        validators=[username_validator],
        error_messages=UserErrorMessages.USERNAME,
    )
    date_created = models.DateTimeField(
        _("Date created"),
        auto_now=False,
        auto_now_add=True,
        help_text=UserHelpText.DATE_CREATED,
        error_messages=UserErrorMessages.DATE_CREATED,
    )
    phone_number = PhoneNumberField(
        _("Phone Number"),
        unique=True,
        region="IR",
        help_text=UserHelpText.PHONE_NUMBER,
        error_messages=UserErrorMessages.PHONE_NUMBER,
    )
    email = models.EmailField(
        _("email address"),
        blank=True,
        null=True,
        help_text=UserHelpText.EMAIL,
        error_messages=UserErrorMessages.EMAIL,
    )
    is_staff = models.BooleanField(
        _("staff status"),
        default=False,
        help_text=UserHelpText.IS_STAFF,
        error_messages=UserErrorMessages.IS_STAFF,
    )
    is_active = models.BooleanField(
        _("active"),
        default=True,
        help_text=UserHelpText.IS_ACTIVE,
        error_messages=UserErrorMessages.IS_ACTIVE,
    )
    date_joined = models.DateTimeField(
        _("date joined"),
        default=timezone.localtime,
        help_text=UserHelpText.DATE_JOINED,
        error_messages=UserErrorMessages.DATE_JOINED,
    )

    objects = UserManager()

    EMAIL_FIELD = "email"
    USERNAME_FIELD = "username"
    REQUIRED_FIELDS = ["email"]

    def clean(self):
        super().clean()
        self.email = self.__class__.objects.normalize_email(self.email)
        # Only validate access_code for new users (when id is None)
        if not self.pk and not self.access_code:
            raise ValidationError(
                {"access_code": _("Access code is required for new users.")}
            )

    def __str__(self):
        return self.username

    def get_absolute_url(self):
        return reverse("User_detail", kwargs={"pk": self.pk})

    class Meta:
        verbose_name = _("User")
        verbose_name_plural = _("Users Management")
