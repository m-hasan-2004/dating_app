from django.utils.translation import gettext_lazy as _

class PersonalInfoErrorMessages:
    EDUCATION = {
        "required": _("Education is required."),
        "invalid_choice": _("Invalid choice for education."),
    }
    FIELD_OF_STUDY = {
        "required": _("Degree is required."),
        'max_length': _("Degree cannot exceed 150 characters."),
    }
    FUTURE_SPOUSE_JOB = {
        "required": _("Future spouse job is required."),
        "invalid_choice": _("Invalid choice for future spouse job."),
    }
    CURRENT_RESIDENCE_LOCATION = {
        "required": _("Current residence location is required."),
        'max_length': _("Current residence location  cannot exceed 150 characters."),
    }
    AFTER_MARRIAGE_RESIDENCE_LOCATION = {
        "required": _("After marriage residence location is required."),
        "invalid_choice": _("Invalid choice for after marriage residence location."),
    }
    USER = {
        "required": _("User is required."),
    }

class PhysicalInfoErrorMessages:
    HEIGHT = {
        "required": _("Height is required."),
        "invalid": _("Invalid height value."),
    }
    WEIGHT = {
        "required": _("Weight is required."),
        "invalid": _("Invalid weight value."),
    }
    SKIN_COLOR = {
        "required": _("Skin color is required."),
        "invalid_choice": _("Invalid choice for skin color."),
    }
    USER = {
        "required": _("User is required."),
    }

class IntellectualInfoErrorMessages:
    APPEARANCE_TYPE = {
        "required": _("Appearance type is required."),
        "invalid_choice": _("Invalid choice for appearance type."),
    }
    AGE_DIFFERENCE = {
        "required": _("Age difference is required."),
        "invalid_choice": _("Invalid choice for age difference."),
    }
    FUTURE_SPOUSE_FAMILY_RELIGIOUS_STATUS_IMPORTANCE = {
        "required": _("Future spouse family religious status importance is required."),
        "invalid_choice": _("Invalid choice for future spouse family religious status importance."),
    }
    FUTURE_SPOUSE_FAMILY_FINANCIAL_STATUS_IMPORTANCE = {
        "required": _("Future spouse family financial status importance is required."),
        "invalid_choice": _("Invalid choice for future spouse family financial status importance."),
    }
    MARRIAGE_WITH_SOMEONE_WITH_MARRIAGE_EXPERIENCE = {
        "required": _("Marriage with someone with marriage experience is required."),
        "invalid_choice": _("Invalid choice for marriage with someone with marriage experience."),
    }
    FUTURE_SPOUSE_ORIGINALITY = {
        "required": _("Future spouse originality is required."),
        "invalid_choice": _("Invalid choice for future spouse originality."),
    }
    MOST_IMPORTANT_MORAL_FEATURE_OF_FUTURE_SPOUSE = {
        "required": _("Most important moral feature of future spouse is required."),
    }
    MARRIAGE_WITH_DISABLED = {
        "required": _("Marriage with disabled is required."),
        "invalid_choice": _("Invalid choice for marriage with disabled."),
    }
    MARRIAGE_WITH_DISABLED_VETERAN_EXPLANATION = {
        "required": _("Marriage with disabled & Veteran Explanation is required."),
        'max_length': _("Marriage With Disabled & Veteran Explanation cannot exceed 150 characters."),
    }
    RED_FLAGS = {
        "required": _("Red flags are required."),
    }
    USER = {
        "required": _("User is required."),
    }

class ExtraInfoErrorMessages:
    ADDITIONAL_EXPLANATIONS = {
        "required": _("Additional explanations are required."),
    }
    USER = {
        "required": _("User is required."),
    }
