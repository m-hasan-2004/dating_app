from django.db import models
from .model_choices import Choices
from .model_error_messages import PersonalInfoErrorMessages

class PersonalInformation(models.Model):
    gender = models.CharField(
        max_length=50,
        choices=Choices.GENDER_CHOICES,
        error_messages=PersonalInfoErrorMessages.GENDER
    )
    sadat = models.BooleanField(
        error_messages=PersonalInfoErrorMessages.SADAT
    )
    birth_date = models.DateField(
        error_messages=PersonalInfoErrorMessages.BIRTH_DATE
    )
    birth_location = models.CharField(
        max_length=50,
        error_messages=PersonalInfoErrorMessages.BIRTH_LOCATION
    )
    education = models.CharField(
        max_length=50,
        choices=Choices.EDUCATION_CHOICES,
        error_messages=PersonalInfoErrorMessages.EDUCATION
    )
    degree = models.CharField(
        max_length=50,
        choices=Choices.DEGREE_CHOICES,
        error_messages=PersonalInfoErrorMessages.DEGREE
    )
    military_status = models.CharField(
        max_length=50,
        choices=Choices.MILITARY_STATUS_CHOICES,
        error_messages=PersonalInfoErrorMessages.MILITARY_STATUS
    )
    military_status_explanation = models.TextField(
        blank=True,
        null=True
    )
    income = models.BigIntegerField(
        error_messages=PersonalInfoErrorMessages.INCOME
    )
    deposit = models.BigIntegerField(
        error_messages=PersonalInfoErrorMessages.DEPOSIT
    )
    insurance_type = models.CharField(
        max_length=50,
        choices=Choices.INSURANCE_TYPE_CHOICES,
        error_messages=PersonalInfoErrorMessages.INSURANCE_TYPE
    )
    insurance_years = models.PositiveIntegerField(
        error_messages=PersonalInfoErrorMessages.INSURANCE_YEARS
    )
    leisure_type = models.CharField(
        max_length=50,
        choices=Choices.LEISURE_TYPE_CHOICES,
        error_messages=PersonalInfoErrorMessages.LEISURE_TYPE
    )
    usage_cases = models.CharField(
        max_length=50,
        choices=Choices.USAGE_CASES_CHOICES,
        error_messages=PersonalInfoErrorMessages.USAGE_CASES
    )
    conviction_or_arrest_history = models.BooleanField(
        error_messages=PersonalInfoErrorMessages.CONVICTION_OR_ARREST_HISTORY
    )
    conviction_reason = models.CharField(
        max_length=150,
        blank=True,
        null=True,
        error_messages=PersonalInfoErrorMessages.CONVICTION_REASON
    )
    user = models.OneToOneField(
        "users.User",
        on_delete=models.CASCADE,
        error_messages=PersonalInfoErrorMessages.USER
    )

    def __str__(self):
        return f"{self.user.username}'s Personal Information"
