from django.db import models
from django.utils.translation import gettext_lazy as _
from core.utils.model_choices.preferred_wife_model_choices import Choices
from core.utils.error_msgs.preferred_wife_model_error_messages import (
    PersonalInfoErrorMessages,
)
from core.utils.help_texts.preferred_wife_help_text import PersonalInfoHelpText
from multiselectfield import MultiSelectField


class PreferredWifePersonalInformation(models.Model):
    education = models.CharField(
        _("Education Level"),
        max_length=50,
        error_messages=PersonalInfoErrorMessages.EDUCATION,
        help_text=PersonalInfoHelpText.EDUCATION,
    )
    field_of_study = models.CharField(
        _("Field of Study"),
        max_length=150,
        error_messages=PersonalInfoErrorMessages.FIELD_OF_STUDY,
        help_text=PersonalInfoHelpText.FIELD_OF_STUDY,
    )
    future_spouse_job = MultiSelectField(
        _("Future Spouse Job"),
        choices=Choices.FUTURE_SPOUSE_JOB,
        error_messages=PersonalInfoErrorMessages.FUTURE_SPOUSE_JOB,
        help_text=PersonalInfoHelpText.FUTURE_SPOUSE_JOB,
        db_index=True,
    )
    current_residence_location = models.CharField(
        _("Current Residence Location"),
        max_length=150,
        error_messages=PersonalInfoErrorMessages.CURRENT_RESIDENCE_LOCATION,
        help_text=PersonalInfoHelpText.CURRENT_RESIDENCE_LOCATION,
        db_index=True,
    )
    after_marriage_residence_location = MultiSelectField(
        _("After Marriage Residence Location"),
        max_length=50,
        choices=Choices.RESIDENCE_LOCATION_CHOICES,
        error_messages=PersonalInfoErrorMessages.AFTER_MARRIAGE_RESIDENCE_LOCATION,
        help_text=PersonalInfoHelpText.AFTER_MARRIAGE_RESIDENCE_LOCATION,
        db_index=True,
    )
    user = models.OneToOneField(
        "users.user",
        verbose_name=_("User"),
        on_delete=models.CASCADE,
        help_text=PersonalInfoHelpText.USER,
        db_index=True,
    )

    def __str__(self):
        return f"اطلاعات کاربر: {self.user.last_name}"

    class Meta:
        verbose_name = _("Preferred Wife Personal Information")
        verbose_name_plural = _("Preferred Wife Personal Information")
