from django.db import models
from django.utils.translation import gettext_lazy as _
from core.utils.preferred_wife_model_choices import Choices
from core.utils.preferred_wife_model_error_messages import PhysicalInfoErrorMessages
from core.utils.preferred_wife_help_text import PhysicalInfoHelpText
from multiselectfield import MultiSelectField

class PreferredWifePhysicalInformation(models.Model):
    height = models.DecimalField(
        _("Height"),
        max_digits=5,
        decimal_places=2,
        error_messages=PhysicalInfoErrorMessages.HEIGHT,
        help_text=PhysicalInfoHelpText.HEIGHT,
        db_index=True,
    )
    weight = models.DecimalField(
        _("Weight"),
        max_digits=5,
        decimal_places=2,
        error_messages=PhysicalInfoErrorMessages.WEIGHT,
        help_text=PhysicalInfoHelpText.WEIGHT,
        db_index=True,
    )
    skin_color = MultiSelectField(
        _("Skin Color"),
        choices=Choices.SKIN_COLOR_CHOICES,
        error_messages=PhysicalInfoErrorMessages.SKIN_COLOR,
        help_text=PhysicalInfoHelpText.SKIN_COLOR,
        db_index=True,
    )
    user = models.OneToOneField("users.user", verbose_name=_("User"), on_delete=models.CASCADE, help_text=PhysicalInfoHelpText.USER, db_index=True)

    def __str__(self):
        return f"اطالاعات کاربر: {self.user.last_name}"
    
    class Meta:
        verbose_name = _("Preferred Wife Physical Information")
        verbose_name_plural = _("Preferred Wife Physical Information")
