from django.utils.translation import gettext_lazy as _


class SubjectErrorMessages:
    SUBJECT_PREFERRED_DATE_TIMES = {
        "blank": _("Preferred date times cannot be blank."),
        "null": _("Preferred date times cannot be null."),
        "max_length": _("Preferred date times cannot exceed 255 characters."),
    }
    SIGNUP_FEE_TYPE = {
        "blank": _("Signup fee type cannot be blank."),
        "null": _("Signup fee type cannot be null."),
        "invalid_choice": _("Invalid choice for signup fee type."),
    }
    ACCOUNT_NUMBER = {
        "blank": _("Account number cannot be blank."),
        "null": _("Account number cannot be null."),
        "max_length": _("Account number cannot exceed 20 characters."),
        "invalid": _("Invalid account number format."),
    }
    BANK = {
        "blank": _("Bank name cannot be blank."),
        "null": _("Bank name cannot be null."),
        "max_length": _("Bank name cannot exceed 100 characters."),
        "invalid": _("Invalid bank name format."),
    }
    GENDER_TARGET = {
        "blank": _("Gender target cannot be blank."),
        "null": _("Gender target cannot be null."),
        "invalid_choice": _("Invalid choice for gender target."),
    }
    AMOUNT = {
        "blank": _("Amount cannot be blank."),
        "null": _("Amount cannot be null."),
        "max_length": _("Amount cannot exceed 20 characters."),
        "invalid": _("Invalid amount format."),
    }
    PROFESSIONAL_OPINION = {
        "blank": _("Professional opinion cannot be blank."),
        "null": _("Professional opinion cannot be null."),
        "max_length": _("Professional opinion cannot exceed 1000 characters."),
    }
