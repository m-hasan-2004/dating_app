from django.utils.translation import gettext_lazy as _

class PhysicalInfoHelpText:
    HEIGHT = _("Enter the height of the user in centimeters.")
    WEIGHT = _("Enter the weight of the user in kilograms.")
    GLASSES = _("Does the user wear glasses?")
    GLASSES_SIZE = _("Enter the size of the glasses if applicable.")
    DISEASE_OR_SURGERY = _("Has the user had any disease or surgery?")
    MEDICATION_SURGERY_DISEASE_TYPE = _("Specify the type of medication, surgery, or disease if applicable.")

class PersonalInfoHelpText:
    GENDER = _("Select the gender of the user.")
    MILITARY_STATUS_EXPLANATION = _("Provide an explanation for the military status if applicable.")
    INCOME = _("Enter the income of the user.")
    DEPOSIT = _("Enter the deposit amount of the user.")
    INSURANCE_YEARS = _("Enter the number of years the user has had insurance.")
    CONVICTION_OR_ARREST_HISTORY = _("Does the user have a conviction or arrest history?")
    CONVICTION_REASON = _("Specify the reason for the conviction if applicable.")
