from django.utils.translation import gettext_lazy as _


class SubjectHelpText:
    PREFERRED_DATE_TIMES = _(
        "Enter your preferred date and times for meetings (e.g., 'Weekdays after 6 PM, Weekends anytime')."
    )
    SIGNUP_FEE_TYPE = _(
        "Select the payment method for the signup fee - Cash or Card (Transfer to Card)."
    )
    ACCOUNT_NUMBER = _(
        "Enter your bank account number (10-20 digits). This is required if you select 'Card' as payment method."
    )
    BANK = _(
        "Enter the name of your bank (e.g., Melli, Mellat, Saderat, etc.)."
    )
    GENDER_TARGET = _(
        "Select the gender you are interested in (Man/Woman)."
    )
    AMOUNT = _(
        "Enter the amount in Rials. Only numbers and decimal point are allowed."
    )
    PROFESSIONAL_OPINION = _(
        "Enter any professional opinion or notes about the subject (max 1000 characters)."
    )
