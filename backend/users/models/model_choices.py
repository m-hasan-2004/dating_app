from django.utils.translation import gettext_lazy as _

class Choices:
    JOB_OPTIONS = (
        ("freelancer", _("Freelancer")),
        ("military", _("Military")),
        ("administrative", _("Administrative")),
        ("teacher", _("Teacher")),
        ("hoze_molabas", _("Hoze Molabas")),
        ("hoze_none_molabas", _("Hoze None Molabas")),
        ("hoze_sisters", _("Hoze Sisters")),
        ("womanly_job", _("Womanly Job")),
        ("no_job", _("No Job")),
        ("housekeeper", _("Housekeeper")),
        ("doesnt_matter", _("Doesn't matter")),
        ("other", _("Other")),
    )
    INSURANCE_OPTIONS = (
        ("tamin", _("Tamin")),
        ("takmili", _("Takmili")),
        ("darmani", _("Darmani")),
        ("niroo_mosalah", _("Niroo Mosalah")),
        ("ommr", _("Ommr")),
        ("other", _("Other")),
    )
    TYPE_OF_PAYMENT_OPTIONS = (
        ("cash", _("Cash")),
        ("online", _("Online"))
    )
    MARRIAGE_EXPERINCE_OPTION = (
        ("yes", _("Yes")),
        ("no", _("No")),
        ("engagement_only", _("Engagement Only"))
    )
    MARRIAGE_STATUS_OPTIONS = (
        ("husband", _("Husband")),
        ("blank_birth_certificate", _("Blank Birth Certificate"))
    )
    CHILDREN_OPTIONS = (
        ("none", _("None")),
        ("one_boy", _("One Boy")),
        ("two_boys", _("Two Boys")),
        ("three_boys", _("Three Boys")),
        ("one_girl", _("One Girl")),
        ("two_girls", _("Two Girls")),
        ("three_girls", _("Three Girls")),
        ("one_boy_one_girl", _("One Boy, One Girl")),
        ("one_boy_two_girls", _("One Boy, Two Girls")),
        ("two_boys_one_girl", _("Two Boys, One Girl")),
        ("two_boys_two_girls", _("Two Boys, Two Girls")),
        ("three_boys_one_girl", _("Three Boys, One Girl")),
        ("one_boy_three_girls", _("One Boy, Three Girls")),
        ("three_boys_two_girls", _("Three Boys, Two Girls")),
        ("two_boys_three_girls", _("Two Boys, Three Girls")),
        ("three_boys_three_girls", _("Three Boys, Three Girls")),
    )
    CHILDREN_CUSTODY_OPTIONS = (
        ("father", _("Father")),
        ("mother", _("Mother"))
    )
    GENDER_CHOICES = (
        ("Man", _("Man")),
        ("Woman", _("Woman")),
    )
    EDUCATION_CHOICES = (
        ("Unlettered", _("Unlettered")),
        ("Under Diploma", _("Under Diploma")),
        ("Diploma", _("Diploma")),
        ("Associate Degree", _("Associate Degree")),
        ("Bachelor's Degree", _("Bachelor's Degree")),
        ("Master's Degree", _("Master's Degree")),
        ("Ph.D.", _("Ph.D.")),
        ("Hoze (Islamic Seminary) LVL 1", _("Hoze (Islamic Seminary) LVL 1")),
        ("Hoze (Islamic Seminary) LVL 2", _("Hoze (Islamic Seminary) LVL 2")),
        ("Hoze (Islamic Seminary) LVL 3", _("Hoze (Islamic Seminary) LVL 3")),
        ("Hoze (Islamic Seminary) LVL 4", _("Hoze (Islamic Seminary) LVL 4")),
        ("School & Quranic", _("School & Quranic")),
    )
    DEGREE_CHOICES = (
        ("Medical", _("Medical")),
        ("Engineer", _("Engineer")),
        ("Human Science", _("Human Science")),
        ("Hoze Molabas", _("Hoze Molabas")),
        ("Hoze Not Molabas", _("Hoze Not Molabas")),
        ("Art", _("Art")),
        ("Other", _("Other")),
    )
    MILITARY_STATUS_CHOICES = (
        ("Exemption", _("Exemption")),
        ("Mother Sponsorship", _("Mother Sponsorship")),
        ("Father Sponsorship", _("Father Sponsorship")),
        ("Educational Exemption", _("Educational Exemption")),
        ("Medical Exemption", _("Medical Exemption")),
        ("End of Service", _("End of Service")),
    )
    INSURANCE_TYPE_CHOICES = (
        ("Takmili", _("Takmili")),
        ("Darmani", _("Darmani")),
        ("Niro Mosalah (Military Insurance)", _("Niro Mosalah (Military Insurance)")),
        ("Ommi", _("Ommi")),
    )
    LEISURE_TYPE_CHOICES = (
        ("Park", _("Park")),
        ("Trip", _("Trip")),
        ("Family", _("Family")),
        ("Television", _("Television")),
        ("Mobile Reading", _("Mobile Reading")),
        ("Shrine", _("Shrine")),
        ("Jankaran", _("Jankaran")),
        ("Cinema", _("Cinema")),
        ("Working in Home", _("Working in Home")),
        ("Gym", _("Gym")),
        ("Poem", _("Poem")),
        ("Garden", _("Garden")),
    )
    USAGE_CASES_CHOICES = (
        ("Alcoholic Drinks", _("Alcoholic Drinks")),
        ("Drugs", _("Drugs")),
        ("Cigarettes", _("Cigarettes")),
        ("Hookah", _("Hookah")),
    )
