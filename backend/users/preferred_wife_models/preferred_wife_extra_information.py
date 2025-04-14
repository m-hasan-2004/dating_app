from django.db import models
from django.utils.translation import gettext_lazy as _
from core.utils.error_msgs.preferred_wife_model_error_messages import (
    ExtraInfoErrorMessages,
)
from core.utils.help_texts.preferred_wife_help_text import ExtraInfoHelpText
from core.utils.validators.preferred_wife_validators import PreferredWifeExtraInformationValidator


class PreferredWifeExtraInformation(models.Model):
    additional_explanations = models.TextField(
        _("Additional Explanations"),
        error_messages=ExtraInfoErrorMessages.ADDITIONAL_EXPLANATIONS,
        help_text=ExtraInfoHelpText.ADDITIONAL_EXPLANATIONS,
        validators=[PreferredWifeExtraInformationValidator.validate_additional_explanations],
    )
    user = models.OneToOneField(
        "users.user",
        verbose_name=_("User"),
        on_delete=models.CASCADE,
        help_text=ExtraInfoHelpText.USER,
    )

    def __str__(self):
        return f"اطلاعات کاربر: {self.user.last_name}"

    class Meta:
        verbose_name = _("Preferred Wife Extra Information")
        verbose_name_plural = _("Preferred Wife Extra Information")
