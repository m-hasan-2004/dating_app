from django.db import models
from core.utils.model_choices import Choices
from core.utils.model_error_messages import PersonalInfoErrorMessages
from core.utils.help_text import PersonalInfoHelpText
from django.utils.translation import gettext_lazy as _
from multiselectfield import MultiSelectField

class PersonalInformation(models.Model):
    gender = models.CharField(
        _("Gender"),
        max_length=50,
        choices=Choices.GENDER_CHOICES,
        error_messages=PersonalInfoErrorMessages.GENDER,
        help_text=PersonalInfoHelpText.GENDER,
    )
    sadat = models.BooleanField(
        _("Sadat"),
        error_messages=PersonalInfoErrorMessages.SADAT
    )
    birth_date = models.DateField(
        _("Birth Date"),
        error_messages=PersonalInfoErrorMessages.BIRTH_DATE
    )
    birth_location = models.CharField(
        _("Birth Location"),
        max_length=50,
        error_messages=PersonalInfoErrorMessages.BIRTH_LOCATION
    )
    education = models.CharField(
        _("Education"),
        max_length=50,
        choices=Choices.EDUCATION_CHOICES,
        error_messages=PersonalInfoErrorMessages.EDUCATION
    )
    degree = models.CharField(
        _("Degree"),
        max_length=50,
        choices=Choices.DEGREE_CHOICES,
        error_messages=PersonalInfoErrorMessages.DEGREE
    )
    military_status = models.CharField(
        _("Military Status"),
        max_length=50,
        choices=Choices.MILITARY_STATUS_CHOICES,
        error_messages=PersonalInfoErrorMessages.MILITARY_STATUS
    )
    military_status_explanation = models.TextField(
        _("Military Status Explanation"),
        blank=True,
        null=True,
        help_text=PersonalInfoHelpText.MILITARY_STATUS_EXPLANATION,
    )
    income = models.BigIntegerField(
        _("Income"),
        error_messages=PersonalInfoErrorMessages.INCOME,
        help_text=PersonalInfoHelpText.INCOME,
    )
    deposit = models.BigIntegerField(
        _("Deposit"),
        error_messages=PersonalInfoErrorMessages.DEPOSIT,
        help_text=PersonalInfoHelpText.DEPOSIT,
    )
    insurance_type = MultiSelectField(
        _("Insurance Type"),
        choices=Choices.INSURANCE_TYPE_CHOICES,
        error_messages=PersonalInfoErrorMessages.INSURANCE_TYPE
    )
    insurance_years = models.PositiveIntegerField(
        _("Insurance Years"),
        error_messages=PersonalInfoErrorMessages.INSURANCE_YEARS,
        help_text=PersonalInfoHelpText.INSURANCE_YEARS,
    )
    leisure_type = MultiSelectField(
        _("Leisure Type"),
        choices=Choices.LEISURE_TYPE_CHOICES,
        error_messages=PersonalInfoErrorMessages.LEISURE_TYPE
    )
    usage_cases = MultiSelectField(
        _("Usage Cases"),
        choices=Choices.USAGE_CASES_CHOICES,
        error_messages=PersonalInfoErrorMessages.USAGE_CASES
    )
    conviction_or_arrest_history = models.BooleanField(
        _("Conviction or Arrest History"),
        error_messages=PersonalInfoErrorMessages.CONVICTION_OR_ARREST_HISTORY,
        help_text=PersonalInfoHelpText.CONVICTION_OR_ARREST_HISTORY,
    )
    conviction_reason = models.CharField(
        _("Conviction Reason"),
        max_length=150,
        blank=True,
        null=True,
        error_messages=PersonalInfoErrorMessages.CONVICTION_REASON,
        help_text=PersonalInfoHelpText.CONVICTION_REASON,
    )
    user = models.OneToOneField(
        "users.User",
        on_delete=models.CASCADE,
        error_messages=PersonalInfoErrorMessages.USER
    )

    def __str__(self):
        return f"{self.user.username}'s Personal Information"
