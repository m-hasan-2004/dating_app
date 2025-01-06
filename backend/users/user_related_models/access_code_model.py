from django.utils.translation import gettext_lazy as _
from django.urls import reverse
from django.db import models
from uuid import uuid4
from django.utils import timezone
from core.utils.model_error_messages import AccessCodeErrorMessages
from core.utils.help_text import AccessCodeHelpText


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
        error_messages=AccessCodeErrorMessages.CODE,
        help_text=AccessCodeHelpText.CODE
    )
    active = models.BooleanField(
        _("Active"),
        default=True,
        error_messages=AccessCodeErrorMessages.ACTIVE,
        help_text=AccessCodeHelpText.ACTIVE
    )
    date_created = models.DateTimeField(
        _("Date created"),
        auto_now=False,
        auto_now_add=True,
        error_messages=AccessCodeErrorMessages.DATE_CREATED,
        help_text=AccessCodeHelpText.DATE_CREATED
    )
    
    def __str__(self):
        return f"Access Code: {str(self.code)}"

    def get_absolute_url(self):
        return reverse("AccessCode_detail", kwargs={"pk": self.pk})

    class Meta:
        verbose_name = _("Access Code Management")
        verbose_name_plural = _("Access Codes Management")

