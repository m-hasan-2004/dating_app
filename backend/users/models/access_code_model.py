from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError
from django.urls import reverse
from django.db import models
from uuid import uuid4
from django.utils import timezone
from .model_error_messages import AccessCodeErrorMessages


def validate_active_access_code(code):
    # Don't validate if code is None (for updates)
    if code is None:
        return
    
    try:
        access_code = AccessCode.objects.get(code=code)
        if not access_code.active:
            raise ValidationError(
                _("The provided access code is inactive or expired."),
                params={"code": code},
            )
    except AccessCode.DoesNotExist:
        raise ValidationError(
            _("The provided access code does not exist."),
            params={"code": code},
        )


class AccessCodeManager(models.Manager):
    def generate_code(self, user):
        return self.create(used_by_who=user)

    def validate_code(self, user, code):
        try:
            access_code = self.get(code=code, used_by_who=user, is_used=False)
            return access_code
        except self.model.DoesNotExist:
            return None

    def expire_code(self, code):
        code.is_used = True
        code.date_used = timezone.localtime()
        code.save()


class AccessCode(models.Model):
    code = models.UUIDField(
        _("Access Code"),
        default=uuid4,
        editable=False,
        help_text=_("Unique access code for user creation."),
        error_messages=AccessCodeErrorMessages.CODE,
    )
    active = models.BooleanField(
        _("Active"),
        default=True,
        help_text=_("Indicates whether the access code is active."),
        error_messages=AccessCodeErrorMessages.ACTIVE,
    )
    date_created = models.DateTimeField(
        _("Date created"),
        auto_now=False,
        auto_now_add=True,
        help_text=_("The date and time when the access code was created."),
        error_messages=AccessCodeErrorMessages.DATE_CREATED,
    )

    class Meta:
        verbose_name = _("AccessCode")
        verbose_name_plural = _("AccessCodes")

    def __str__(self):
        return str(self.code)

    def get_absolute_url(self):
        return reverse("AccessCode_detail", kwargs={"pk": self.pk})
