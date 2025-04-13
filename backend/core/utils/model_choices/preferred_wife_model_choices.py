from django.utils.translation import gettext_lazy as _
from .user_model_choices import Choices as CHO


class Choices:
    FIELD_OF_STUDY_CHOICES = (
        ("Medical", _("Medical")),
        ("Engineer", _("Engineer")),
        ("Human Science", _("Human Science")),
        ("Hoze Mobtadas", _("Hoze Mobtadas")),
        ("Hoze Not Mobtadas", _("Hoze Not Mobtadas")),
        ("Art", _("Art")),
        ("Other", _("Other")),
    )
    RESIDENCE_LOCATION_CHOICES = (
        ("Exactly Qom", _("Exactly Qom")),
        ("Near Qom", _("Near Qom")),
        ("Mega Cities", _("Mega Cities")),
        ("Anywhere in Iran", _("Anywhere in Iran")),
        ("Villages Near Qom", _("Villages Near Qom")),
        ("Environs Near Qom", _("Environs Near Qom")),
        ("Foreign Country", _("Foreign Country")),
        ("Agreement", _("Agreement")),
    )
    SKIN_COLOR_CHOICES = CHO.SKIN_COLOR_CHOICES
    APPEARANCE_TYPE_CHOICES = (
        ("Religious", _("Religious")),
        ("Norm", _("Norm")),
        ("Cador", _("Cador")),
        ("Manto", _("Manto")),
        ("Sport & Modern", _("Sport & Modern")),
    )
    AGE_DIFFERENCE_CHOICES = (
        ("Same", _("Same")),
        ("Till 3", _("Till 3")),
        ("3 to 7", _("3 to 7")),
        ("7 to 10", _("7 to 10")),
        ("10 to 15", _("10 to 15")),
        ("Depends on the Looks", _("Depends on the Looks")),
        ("Doesn’t Matter", _("Doesn’t Matter")),
    )
    IMPORTANCE_CHOICES = (
        ("Too Much", _("Too Much")),
        ("Much", _("Much")),
        ("Any", _("Any")),
        ("Low", _("Low")),
        ("Doesn’t Matter", _("Doesn’t Matter")),
    )
    MARRIAGE_EXPERIENCE_CHOICES = (
        ("Never", _("Never")),
        ("Divorced Virgin", _("Divorced Virgin")),
        ("Divorced No Life", _("Divorced No Life")),
        ("No Child", _("No Child")),
        ("Child Present", _("Child Present")),
        ("Have Children", _("Have Children")),
        ("Have Boy", _("Have Boy")),
        ("Have Girl", _("Have Girl")),
    )
    MARRIAGE_WITH_DISABLED_CHOICES = (
        ("Yes", _("Yes")),
        ("No", _("No")),
        ("Depends", _("Depends")),
    )
    IRAN_PROVINCES = CHO.IRAN_PROVINCES
    FUTURE_SPOUSE_JOB = (
        ("free", _("Freelance")),
        ("military", _("Military")),
        ("office", _("Office")),
        ("teacher", _("Teacher")),
        ("hoze_m", _("Hoze M")),
        ("hoze_n", _("Hoze N")),
        ("hoze_s", _("hoze Sis")),
        ("womanly", _("Womanly Job")),
        ("no_job", _("No Job At All")),
        ("housekeeper", _("Housekeeper")),
        ("Doesn’t Matter", _("Doesn’t Matter")),
    )
