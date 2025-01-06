from django.db import models
from django.utils.translation import gettext_lazy as _
from core.utils.preferred_wife_model_choices import Choices
from core.utils.preferred_wife_model_error_messages import IntellectualInfoErrorMessages
from core.utils.preferred_wife_help_text import IntellectualInfoHelpText
from multiselectfield import MultiSelectField

class PreferredWifeIntellectualInformation(models.Model):
    appearance_type = MultiSelectField(
        _("Appearance Type"),
        max_length=50,
        choices=Choices.APPEARANCE_TYPE_CHOICES,
        error_messages=IntellectualInfoErrorMessages.APPEARANCE_TYPE,
        help_text=IntellectualInfoHelpText.APPEARANCE_TYPE
    )
    age_difference = MultiSelectField(
        _("Age Difference"),
        choices=Choices.AGE_DIFFERENCE_CHOICES,
        error_messages=IntellectualInfoErrorMessages.AGE_DIFFERENCE,
        help_text=IntellectualInfoHelpText.AGE_DIFFERENCE
    )
    future_spouse_family_religious_status_importance = models.CharField(
        _("Future Spouse Family Religious Status Importance"),
        max_length=50,
        choices=Choices.IMPORTANCE_CHOICES,
        error_messages=IntellectualInfoErrorMessages.FUTURE_SPOUSE_FAMILY_RELIGIOUS_STATUS_IMPORTANCE,
        help_text=IntellectualInfoHelpText.FUTURE_SPOUSE_FAMILY_RELIGIOUS_STATUS_IMPORTANCE,
        db_index=True,
    )
    future_spouse_family_financial_status_importance = models.CharField(
        _("Future Spouse Family Financial Status Importance"),
        max_length=50,
        choices=Choices.IMPORTANCE_CHOICES,
        error_messages=IntellectualInfoErrorMessages.FUTURE_SPOUSE_FAMILY_FINANCIAL_STATUS_IMPORTANCE,
        help_text=IntellectualInfoHelpText.FUTURE_SPOUSE_FAMILY_FINANCIAL_STATUS_IMPORTANCE,
        db_index=True,
    )
    marriage_with_someone_with_marriage_experience = MultiSelectField(
        _("Marriage with Someone with Marriage Experience"),
        choices=Choices.MARRIAGE_EXPERIENCE_CHOICES,
        error_messages=IntellectualInfoErrorMessages.MARRIAGE_WITH_SOMEONE_WITH_MARRIAGE_EXPERIENCE,
        help_text=IntellectualInfoHelpText.MARRIAGE_WITH_SOMEONE_WITH_MARRIAGE_EXPERIENCE,
        db_index=True,
    )
    most_important_moral_feature_of_future_spouse = models.TextField(
        _("Most Important Moral Feature of Future Spouse"),
        error_messages=IntellectualInfoErrorMessages.MOST_IMPORTANT_MORAL_FEATURE_OF_FUTURE_SPOUSE,
        help_text=IntellectualInfoHelpText.MOST_IMPORTANT_MORAL_FEATURE_OF_FUTURE_SPOUSE
    )
    marriage_with_disabled = models.CharField(
        _("Marriage with Disabled Person"),
        max_length=50,
        choices=Choices.MARRIAGE_WITH_DISABLED_CHOICES,
        error_messages=IntellectualInfoErrorMessages.MARRIAGE_WITH_DISABLED,
        help_text=IntellectualInfoHelpText.MARRIAGE_WITH_DISABLED,
        db_index=True,
    )
    marriage_with_veteran = models.CharField(
        _("Marriage with Veteran Person"),
        choices=Choices.MARRIAGE_WITH_DISABLED_CHOICES,
        error_messages=IntellectualInfoErrorMessages.MARRIAGE_WITH_DISABLED,
        help_text=IntellectualInfoHelpText.MARRIAGE_WITH_DISABLED,
        db_index=True,
    )
    red_flags = models.TextField(
        _("Red Flags"),
        error_messages=IntellectualInfoErrorMessages.RED_FLAGS,
        help_text=IntellectualInfoHelpText.RED_FLAGS
    )
    user = models.OneToOneField("users.user", verbose_name=_("User"), on_delete=models.CASCADE, help_text=IntellectualInfoHelpText.USER, db_index=True)
    
    def __str__(self):
        return f"اطالاعات کاربر: {self.user.last_name}"

    class Meta:
        verbose_name = _("Preferred Wife Intellectual Information")
        verbose_name_plural = _("Preferred Wife Intellectual Information")

class FutureSposeOriginality(models.Model):
    future_spouse_originality = models.CharField(
        _("Future Spouse Originality"),
        max_length=50,
        error_messages=IntellectualInfoErrorMessages.FUTURE_SPOUSE_ORIGINALITY,
        help_text=IntellectualInfoHelpText.FUTURE_SPOUSE_ORIGINALITY
    )
    user = models.ForeignKey("users.user", verbose_name=_("User"), on_delete=models.CASCADE, help_text=IntellectualInfoHelpText.USER, db_index=True)

    def __str__(self):
        return f"اطالاعات کاربر: {self.user.last_name}"

    class Meta:
        verbose_name = 'FutureSposeOriginality'
        verbose_name_plural = 'FutureSposeOriginalities'