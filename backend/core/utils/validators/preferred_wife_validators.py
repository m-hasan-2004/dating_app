from django.core.validators import MinValueValidator, MaxValueValidator, RegexValidator
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _


class PreferredWifePhysicalInformationValidator:
    height_validator = MinValueValidator(100, _("Height must be at least 100cm"))
    max_height_validator = MaxValueValidator(260, _("Height must be at most 260cm"))
    weight_validator = MinValueValidator(35, _("Weight must be at least 35kg"))
    max_weight_validator = MaxValueValidator(300, _("Weight must be at most 300kg"))


class PreferredWifePersonalInformationValidator:
    education_validator = RegexValidator(
        regex=r"^[a-zA-Z\s\u0600-\u06FF]+$",
        message=_("Education level must contain only letters and spaces"),
    )
    field_of_study_validator = RegexValidator(
        regex=r"^[a-zA-Z\s\u0600-\u06FF]+$",
        message=_("Field of study must contain only letters and spaces"),
    )
    location_validator = RegexValidator(
        regex=r"^[a-zA-Z\s\u0600-\u06FF,.-]+$",
        message=_("Location must contain only letters, spaces, and basic punctuation"),
    )


class PreferredWifeIntellectualInformationValidator:
    def validate_moral_feature(value):
        if len(value.strip()) < 10:
            raise ValidationError(_("Moral feature description must be at least 10 characters long"))
        if len(value.strip()) > 1000:
            raise ValidationError(_("Moral feature description must not exceed 1000 characters"))

    def validate_red_flags(value):
        if len(value.strip()) < 10:
            raise ValidationError(_("Red flags description must be at least 10 characters long"))
        if len(value.strip()) > 1000:
            raise ValidationError(_("Red flags description must not exceed 1000 characters"))

    def validate_disabled_veteran_explanation(value):
        if len(value.strip()) < 10:
            raise ValidationError(_("Explanation must be at least 10 characters long"))
        if len(value.strip()) > 500:
            raise ValidationError(_("Explanation must not exceed 500 characters"))


class PreferredWifeExtraInformationValidator:
    def validate_additional_explanations(value):
        if len(value.strip()) > 2000:
            raise ValidationError(_("Additional explanations must not exceed 2000 characters"))
