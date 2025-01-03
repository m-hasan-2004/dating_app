from django.db import models
from django.utils.translation import gettext_lazy as _
from core.utils.preferred_wife_model_choices import Choices
from core.utils.preferred_wife_model_error_messages import PersonalInfoErrorMessages
from core.utils.preferred_wife_help_text import PersonalInfoHelpText

class PreferredWifePersonalInformation(models.Model):
    education = models.CharField(
        _("Education"),
        max_length=50,
        choices=Choices.EDUCATION_CHOICES,
        error_messages=PersonalInfoErrorMessages.EDUCATION,
        help_text=PersonalInfoHelpText.EDUCATION
    )
    degree = models.CharField(
        _("Degree"),
        max_length=50,
        choices=Choices.DEGREE_CHOICES,
        error_messages=PersonalInfoErrorMessages.DEGREE,
        help_text=PersonalInfoHelpText.DEGREE
    )
    future_spouse_job = models.CharField(
        _("Future Spouse Job"),
        max_length=50,
        choices=Choices.JOB_OPTIONS,
        error_messages=PersonalInfoErrorMessages.FUTURE_SPOUSE_JOB,
        help_text=PersonalInfoHelpText.FUTURE_SPOUSE_JOB
    )
    current_residence_location = models.CharField(
        _("Current Residence Location"),
        max_length=50,
        choices=Choices.RESIDENCE_LOCATION_CHOICES,
        error_messages=PersonalInfoErrorMessages.CURRENT_RESIDENCE_LOCATION,
        help_text=PersonalInfoHelpText.CURRENT_RESIDENCE_LOCATION
    )
    after_marriage_residence_location = models.CharField(
        _("After Marriage Residence Location"),
        max_length=50,
        choices=Choices.RESIDENCE_LOCATION_CHOICES,
        error_messages=PersonalInfoErrorMessages.AFTER_MARRIAGE_RESIDENCE_LOCATION,
        help_text=PersonalInfoHelpText.AFTER_MARRIAGE_RESIDENCE_LOCATION
    )
    user = models.OneToOneField("users.user", verbose_name=_("User"), on_delete=models.CASCADE, help_text=PersonalInfoHelpText.USER)

    class Meta:
        verbose_name = _("Preferred Wife Personal Information")
        verbose_name_plural = _("Preferred Wife Personal Information")
