from django.db import models
from django.utils.translation import gettext_lazy as _
from core.utils.preferred_wife_model_choices import Choices
from core.utils.preferred_wife_model_error_messages import PhysicalInfoErrorMessages
from core.utils.preferred_wife_help_text import PhysicalInfoHelpText

class PreferredWifePhysicalInformation(models.Model):
    height = models.DecimalField(
        _("Height"),
        max_digits=5,
        decimal_places=2,
        error_messages=PhysicalInfoErrorMessages.HEIGHT,
        help_text=PhysicalInfoHelpText.HEIGHT
    )
    weight = models.DecimalField(
        _("Weight"),
        max_digits=5,
        decimal_places=2,
        error_messages=PhysicalInfoErrorMessages.WEIGHT,
        help_text=PhysicalInfoHelpText.WEIGHT
    )
    skin_color = models.CharField(
        _("Skin Color"),
        max_length=50,
        choices=Choices.SKIN_COLOR_CHOICES,
        error_messages=PhysicalInfoErrorMessages.SKIN_COLOR,
        help_text=PhysicalInfoHelpText.SKIN_COLOR
    )
    user = models.OneToOneField("users.user", verbose_name=_("User"), on_delete=models.CASCADE, help_text=PhysicalInfoHelpText.USER)

    class Meta:
        verbose_name = _("Preferred Wife Physical Information")
        verbose_name_plural = _("Preferred Wife Physical Information")
