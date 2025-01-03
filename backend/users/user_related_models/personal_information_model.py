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
        error_messages=PersonalInfoErrorMessages.SADAT,
        help_text=_("Is the user a Sadat?"),
    )
    birth_date = models.DateField(
        _("Birth Date"),
        error_messages=PersonalInfoErrorMessages.BIRTH_DATE,
        help_text=_("Enter the birth date of the user."),
    )
    birth_location = models.CharField(
        _("Birth Location"),
        max_length=50,
        error_messages=PersonalInfoErrorMessages.BIRTH_LOCATION,
        help_text=_("Enter the birth location of the user."),
    )
    education = models.CharField(
        _("Education"),
        max_length=50,
        choices=Choices.EDUCATION_CHOICES,
        error_messages=PersonalInfoErrorMessages.EDUCATION,
        help_text=_("Select the education level of the user."),
    )
    degree = models.CharField(
        _("Degree"),
        max_length=50,
        choices=Choices.DEGREE_CHOICES,
        error_messages=PersonalInfoErrorMessages.DEGREE,
        help_text=_("Select the degree of the user."),
    )
    military_status = models.CharField(
        _("Military Status"),
        max_length=50,
        choices=Choices.MILITARY_STATUS_CHOICES,
        error_messages=PersonalInfoErrorMessages.MILITARY_STATUS,
        help_text=_("Select the military status of the user."),
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
        error_messages=PersonalInfoErrorMessages.INSURANCE_TYPE,
        help_text=_("Select the type of insurance the user has."),
    )
    insurance_years = models.PositiveIntegerField(
        _("Insurance Years"),
        error_messages=PersonalInfoErrorMessages.INSURANCE_YEARS,
        help_text=PersonalInfoHelpText.INSURANCE_YEARS,
    )
    leisure_type = MultiSelectField(
        _("Leisure Type"),
        choices=Choices.LEISURE_TYPE_CHOICES,
        error_messages=PersonalInfoErrorMessages.LEISURE_TYPE,
        help_text=_("Select the types of leisure activities the user enjoys."),
    )
    usage_cases = MultiSelectField(
        _("Usage Cases"),
        choices=Choices.USAGE_CASES_CHOICES,
        error_messages=PersonalInfoErrorMessages.USAGE_CASES,
        help_text=_("Select the usage cases applicable to the user."),
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
        error_messages=PersonalInfoErrorMessages.USER,
        help_text=_("The user associated with this personal information."),
    )

    def __str__(self):
        return f"{self.user.username}'s Personal Information"

    class Meta:
        verbose_name = _("Personal Information")
        verbose_name_plural = _("Personals Information")