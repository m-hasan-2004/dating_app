from django.db import models
from core.utils.model_choices.user_model_choices import Choices
from core.utils.error_msgs.model_error_messages import PersonalInfoErrorMessages
from core.utils.help_texts.help_text import PersonalInfoHelpText
from django.utils.translation import gettext_lazy as _
from multiselectfield import MultiSelectField
from core.utils.validators.user_validators import PersonalInformationValidator


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
        help_text=PersonalInfoHelpText.SADAT,
    )
    birth_date = models.DateField(
        _("Birth Date"),
        error_messages=PersonalInfoErrorMessages.BIRTH_DATE,
        help_text=PersonalInfoHelpText.BIRTH_DATE,
        db_index=True,
        validators=[PersonalInformationValidator.validate_birth_date],
    )
    birth_location = models.CharField(
        _("Birth Location"),
        max_length=50,
        error_messages=PersonalInfoErrorMessages.BIRTH_LOCATION,
        help_text=PersonalInfoHelpText.BIRTH_LOCATION,
    )
    education = models.CharField(
        _("Education"),
        max_length=50,
        choices=Choices.EDUCATION_CHOICES,
        error_messages=PersonalInfoErrorMessages.EDUCATION,
        help_text=PersonalInfoHelpText.EDUCATION,
    )
    degree = models.CharField(
        _("Degree"),
        max_length=150,
        error_messages=PersonalInfoErrorMessages.DEGREE,
        help_text=PersonalInfoHelpText.DEGREE,
    )
    military_status = models.CharField(
        _("Military Status"),
        choices=Choices.MILITARY_STATUS_CHOICES,
        error_messages=PersonalInfoErrorMessages.MILITARY_STATUS,
        help_text=PersonalInfoHelpText.MILITARY_STATUS,
    )
    military_status_explanation = models.TextField(
        _("Military Status Explanation"),
        blank=True,
        null=True,
        error_messages=PersonalInfoErrorMessages.MILITARY_STATUS,
        help_text=PersonalInfoHelpText.MILITARY_STATUS_EXPLANATION,
    )
    income = models.CharField(
        _("Income"),
        choices=Choices.INCOME_OPTIONS,
        error_messages=PersonalInfoErrorMessages.INCOME,
        help_text=PersonalInfoHelpText.INCOME,
        db_index=True,
    )
    deposit = models.CharField(
        _("Deposit"),
        choices=Choices.DEPOSIT_OPTIONS,
        error_messages=PersonalInfoErrorMessages.DEPOSIT,
        help_text=PersonalInfoHelpText.DEPOSIT,
    )
    have_insurance = models.BooleanField(
        _("Have Insurance"),
        help_text=PersonalInfoHelpText.INSURANCE_TYPE,
        default=True,
    )

    insurance_type = MultiSelectField(
        _("Insurance Type"),
        choices=Choices.INSURANCE_OPTIONS,
        error_messages=PersonalInfoErrorMessages.INSURANCE_TYPE,
        help_text=PersonalInfoHelpText.INSURANCE_TYPE,
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
        help_text=PersonalInfoHelpText.LEISURE_TYPE,
    )
    usage_cases = MultiSelectField(
        _("Usage Cases"),
        choices=Choices.USAGE_CASES_CHOICES,
        error_messages=PersonalInfoErrorMessages.USAGE_CASES,
        help_text=PersonalInfoHelpText.USAGE_CASES,
        db_index=True,
    )
    usage_case_description = models.TextField(
        _("Usage Case Description"),
        blank=True,
        null=True,
        error_messages=PersonalInfoErrorMessages.USAGE_CASE_DESCRIPTION,
        help_text=PersonalInfoHelpText.USAGE_CASE_DESCRIPTION,
    )
    tatoo = models.BooleanField(
        _("Tatto"),
        db_index=True,
        error_messages=PersonalInfoErrorMessages.TATTO,
        help_text=PersonalInfoHelpText.TATTO,
        default=False,
    )
    tatto_description = models.TextField(
        _("Tatto Description"),
        blank=True,
        null=True,
        error_messages=PersonalInfoErrorMessages.TATTO_DESCRIPTION,
        help_text=PersonalInfoHelpText.TATTO_DESCRIPTION,
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
        help_text=PersonalInfoHelpText.USER,
        db_index=True,
        related_name="personalinformation",
    )

    def clean(self):
        """
        Perform complex validations using the PersonalInformationValidator.
        """
        super().clean()
        validator = PersonalInformationValidator()
        validator.clean(self.__dict__)

    def __str__(self):
        return f"اطلاعات کاربر: {self.user.last_name}"

    class Meta:
        verbose_name = _("Personal Information")
        verbose_name_plural = _("Personals Information")
