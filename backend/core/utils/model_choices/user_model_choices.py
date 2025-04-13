from django.utils.translation import gettext_lazy as _


class Choices:
    INSURANCE_OPTIONS = (
        ("tamin", _("Tamin")),
        ("takmili", _("Takmili")),
        ("darmani", _("Darmani")),
        ("niroo_mosalah", _("Niroo Mosalah")),
        ("ommr", _("Ommr")),
        ("iran", _("Iran")),
        ("asia", _("Asia")),
        ("dana", _("Dana")),
        ("moalem", _("Moalem")),
        ("parsian", _("Parsian")),
        ("pasargad", _("Pasargad")),
        ("Saman", _("Saman")),
        ("melat", _("Melat")),
        ("ma", _("Ma")),
        ("alborz_insurance", _("Alborz")),
        ("kosar", _("Kosar")),
        ("karafarin", _("Karafarin")),
        ("novin", _("Novin")),
        ("day", _("Day")),
        ("sarmad", _("Sarmad")),
        ("Razi", _("Razi")),
        ("taavon", _("Taavon")),
        ("hafez", _("Hafez")),
        ("etkayii", _("Etkayii Iranian")),
        ("tejaratno", _("Tejarat No")),
        ("khavermiane", _("Khavermiane")),
        ("hekmat", _("Hekmat Saba")),
        ("tosehe", _("Tosehe")),
        ("other", _("Other")),
    )
    TYPE_OF_PAYMENT_OPTIONS = (("cash", _("Cash")), ("online", _("Online")))
    INCOME_OPTIONS = (
        ("-10", _("Under 10M")),
        ("10-20", _("Between 10M to 20M")),
        ("20-30", _("Between 20M to 30M")),
        ("30-40", _("Between 30M to 40M")),
        ("40-50", _("Between 40M to 50M")),
        ("50-100", _("Between 50M to 100M")),
        ("+100", _("Plus 100")),
    )
    DEPOSIT_OPTIONS = (
        ("-50", _("Under 50M")),
        ("50-100", _("Between 50M to 100M")),
        ("100-200", _("Between 100M to 200M")),
        ("200-500", _("Between 200M to 500M")),
        ("+500", _("Plus 500M")),
    )
    MARRIAGE_EXPERINCE_OPTION = (
        ("yes", _("Yes")),
        ("no", _("No")),
        ("engagement_only", _("Engagement Only")),
    )
    MARRIAGE_STATUS_OPTIONS = (
        ("husband", _("Husband")),
        ("blank_birth_certificate", _("Blank Birth Certificate")),
    )
    CHILDREN_OPTIONS = (
        ("none", _("None")),
        ("one_boy", _("One Boy")),
        ("two_boys", _("Two Boys")),
        ("three_boys", _("Three Boys")),
        ("one_girl", _("One Girl")),
        ("two_girls", _("Two Girls")),
        ("three_girls", _("Three Girls")),
    )
    CHILDREN_CUSTODY_OPTIONS = (("father", _("Father")), ("mother", _("Mother")))
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
    MILITARY_STATUS_CHOICES = (
        ("Exemption", _("Exemption")),
        ("Mother Sponsorship", _("Mother Sponsorship")),
        ("Father Sponsorship", _("Father Sponsorship")),
        ("Educational Exemption", _("Educational Exemption")),
        ("Medical Exemption", _("Medical Exemption")),
        ("End of Service", _("End of Service")),
        ("No Service", _("No Service")),
        ("Woman", _("Woman")),
    )
    LEISURE_TYPE_CHOICES = (
        ("Park", _("Park")),
        ("Trip", _("Trip")),
        ("Family", _("Family")),
        ("Television", _("Television")),
        ("Mobile", _("Mobile")),
        ("Reading", _("Reading")),
        ("Shrine", _("Shrine")),
        ("Jankaran", _("Jankaran")),
        ("Cinema", _("Cinema")),
        ("Family", _("Visiting Family")),
        ("Gym", _("Gym")),
        ("Poem", _("Poem")),
        ("Garden", _("Garden")),
    )
    USAGE_CASES_CHOICES = (
        ("Alcoholic Drinks", _("Alcoholic Drinks")),
        ("Drugs", _("Drugs")),
        ("Cigarettes", _("Cigarettes")),
        ("Hookah", _("Hookah")),
        ("none", _("None")),
    )
    SKIN_COLOR_CHOICES = (
        ("Very Bright", _("Very Bright")),
        ("Bor", _("Bor")),
        ("Fair", _("Fair")),
        ("White", _("White")),
        ("Wheat", _("Wheat")),
        ("Green", _("Green")),
        ("Olive", _("Olive")),
        ("Darken", _("Darken")),
        ("Black", _("Black")),
        ("Bright Brown", _("Bright Brown")),
        ("Darken Brown", _("Darken Brown")),
        ("Bright", _("Bright")),
        ("Yellow", _("Yellow")),
        ("Whitish White", _("Whitish White")),
        ("Red & White", _("Red & White")),
        ("Bright Green", _("Bright Green")),
        ("other", _("Other")),
    )
    EYES_COLOR_CHOICES = (
        ("Green", _("Green")),
        ("Light Blue", _("Light Blue")),
        ("Hazel", _("Hazel")),
        ("Darken Blue", _("Darken Blue")),
        ("Grey", _("Grey")),
        ("Honey", _("Honey")),
        ("Purple", _("Purple")),
        ("Brown", _("Brown")),
        ("Black", _("Black")),
    )
    BLOOD_TYPE_CHOICES = (
        ("O+", _("O+")),
        ("O-", _("O-")),
        ("A+", _("A+")),
        ("A-", _("A-")),
        ("B+", _("B+")),
        ("B-", _("B-")),
        ("AB+", _("AB+")),
        ("AB-", _("AB-")),
    )
    CHARACTER_AND_TEMPERAMENT_CHOICES = (
        ("Safravi", _("Safravi (Hot & Dry)")),
        ("Damvi", _("Damvi (Hot & Wet)")),
        ("Sodavi", _("Sodavi (Cold & Dry)")),
        ("Balghami", _("Balghami (Cold & Wet)")),
    )
    BODY_AND_FACE_CHOICES = (
        ("Excellent", _("Excellent")),
        ("Good", _("Good")),
        ("Average", _("Average")),
        ("Suitable", _("Suitable")),
        ("Nice Face", _("Nice Face")),
        ("Nice Body", _("Nice Body")),
        ("Looks Older", _("Looks Older")),
        ("Looks Younger", _("Looks Younger")),
        ("Satisfied", _("Satisfied")),
        ("None", _("None")),
    )
    AVERAGE_FAMILY_EDUCATION_CHOICES = (
        ("Under Diploma", _("Under Diploma")),
        ("Diploma", _("Diploma")),
        ("Associate Degree", _("Associate Degree")),
        ("Bachelor's", _("Bachelor's")),
        ("Master's", _("Master's")),
        ("Ph.D.", _("Ph.D.")),
        ("Hoze", _("Hoze")),
    )
    AVERAGE_FAMILY_FINANCE_CHOICES = (
        ("Perfect", _("Perfect")),
        ("Good", _("Good")),
        ("Average", _("Average")),
        ("Weak", _("Weak")),
    )
    ENGAGEMENT_OR_WEDDING_STATUS_CHOICES = (
        ("Engagement", _("Engagement")),
        ("Contract", _("Contract")),
        ("Wedding", _("Wedding")),
        ("None", _("None")),
    )
    CUSTODY_CHOICES = (
        ("Father", _("Father")),
        ("Mother", _("Mother")),
    )
    GROOM_CHOICES = (
        ("groom", _("Groomm")),
        ("zan_dadash", _("Zan Dadash")),
    )
    BRIDE_OR_WIFE_CHOICES = (
        ("bride", _("Bride")),
        ("shohar_khahar", _("Shohar Khahar")),
    )
    IRAN_PROVINCES = (
        ("Alborzz", _("Alborzz")),
        ("Ardabil", _("Ardabil")),
        ("Bushehr", _("Bushehr")),
        ("Chaharmahal and Bakhtiari", _("Chaharmahal and Bakhtiari")),
        ("East Azerbaijan", _("East Azerbaijan")),
        ("Esfahan", _("Esfahan")),
        ("Fars", _("Fars")),
        ("Gilan", _("Gilan")),
        ("Golestan", _("Golestan")),
        ("Hamadan", _("Hamadan")),
        ("Hormozgan", _("Hormozgan")),
        ("Ilam", _("Ilam")),
        ("Kerman", _("Kerman")),
        ("Kermanshah", _("Kermanshah")),
        ("Khuzestan", _("Khuzestan")),
        ("Kohgiluyeh and Boyer-Ahmad", _("Kohgiluyeh and Boyer-Ahmad")),
        ("Kurdistan", _("Kurdistan")),
        ("Lorestan", _("Lorestan")),
        ("Markazi", _("Markazi")),
        ("Mazandaran", _("Mazandaran")),
        ("North Khorasan", _("North Khorasan")),
        ("Qazvin", _("Qazvin")),
        ("Qom", _("Qom")),
        ("Razavi Khorasan", _("Razavi Khorasan")),
        ("Semnan", _("Semnan")),
        ("Sistan and Baluchestan", _("Sistan and Baluchestan")),
        ("South Khorasan", _("South Khorasan")),
        ("Tehran", _("Tehran")),
        ("West Azerbaijan", _("West Azerbaijan")),
        ("Yazd", _("Yazd")),
        ("Zanjan", _("Zanjan")),
        ("doesnt_matter", _("Doesn't Matter")),
    )
    KIDS = (
        ("none", _("None")),
        ("1", _("1")),
        ("2", _("2")),
        ("3", _("3")),
        ("+3", _("+3")),
    )


class FinancialInformationChoices:
    CURRENT_RESIDENCE_STATUS_CHOICES = (
        ("fathers_house", _("Father's House")),
        ("mothers_house", _("Mother's House")),
        ("other", _("Other")),
    )
    OWNERSHIP_STATUS_CHOICES = (
        ("owner", _("Owner")),
        ("rent", _("Rent")),
    )
    CAPITAL_CHOICES = (
        ("house", _("House")),
        ("shop", _("Shop")),
        ("land", _("Land")),
        ("garden", _("Garden")),
        ("factory", _("Factory")),
        ("company", _("Company")),
        ("motorcycle", _("Motorcycle")),
        ("car", _("Car")),
        ("gold", _("Gold")),
        ("other", _("Other")),
    )
    AFTER_MARRIAGE_RESIDENCE_STATUS_CHOICES = (
        ("owner", _("Owner")),
        ("mortgage", _("Mortgage")),
        ("fathers_house", _("Father's House")),
        ("mothers_house", _("Mother's House")),
        ("other", _("Other")),
    )
    JAHIZIYEH_CHOICES = (
        ("does", _("Does")),
        ("doesnt", _("Doesn't")),
        ("wants", _("Wants")),
        ("doesnt_want", _("Doesn't Want")),
        ("man_should_help", _("Man Should Help")),
        ("agreement", _("Agreement")),
    )
    EX_SPOUSE_FINANCIAL_PAY_STATUS_CHOICES = (
        ("monthly", _("Monthly")),
        ("yearly", _("Yearly")),
        ("two_years", _("Two Years")),
    )
    EX_SPOUSE_FINANCIAL_STATUS_CHOICES = (
        ("rights", _("Rights")),
        ("settled", _("Settled")),
        ("creditor", _("Creditor")),
        ("debtor", _("Debtor")),
    )
    DOWRY_TYPE = (
        ("mecca", _("Mecca")),
        ("iraq", _("Iraq")),
        ("syria", _("Syria")),
        ("gold", _("Gold")),
        ("money", _("Money")),
        ("land", _("Land")),
        ("car", _("Car")),
        ("garden", _("Garden")),
        ("house", _("House")),
        ("agreement", _("Agreement")),
    )


class IntellectualInformationChoices:
    WOMAN_JOB_OPTIONS = (
        ("disagree", _("Disagree")),
        ("agree", _("Agree")),
        ("must_have_job", _("Must have a job")),
        ("depends_work_env", _("Depends on Work Environment")),
        ("depends_job_type", _("Depends on Job Type")),
        ("womanly_job", _("Womanly Job")),
        ("housejob", _("Housejob")),
        ("depends_spouse_opinion", _("Depends On Spouse Opinion")),
    )
    WOMAN_EDU_OPTIONS = (
        ("disagree", _("Disagree")),
        ("agree", _("Agree")),
        ("depends_degree", _("Depends on the Degree")),
        ("depends_spouse_opinion", _("Depends On Spouse Opinion")),
    )
    FRIENDS_CONNECTION_TYPE = (
        ("excellent", _("Excellent")),
        ("good", _("Good")),
        ("average", _("Average")),
        ("weak", _("Weak")),
        ("none", _("None")),
    )
    VELAYAT_FAQIH_OPTIONS = (
        ("agree", _("Agree")),
        ("no_opinion", _("No Opinion")),
    )
    CHILD_QUANTITY_OPTIONS = (
        ("dont_want", _("Don't Want")),
        ("depends", _("Depends")),
        ("one", _("1")),
        ("two", _("2")),
        ("three", _("3")),
        ("more_than_three", _("More than 3")),
        ("agreement", _("Agreement")),
    )
    CONTRACT_HOW_OPTIONS = (
        ("registry", _("In the Registry")),
        ("house_family", _("In House & Family")),
        ("hall", _("In the Hall")),
        ("doesnt_matter", _("Doesn't Matter")),
        ("agreement", _("Agreement")),
    )
    WEDDING_HOW_OPTIONS = (
        ("house_family", _("In House & Family")),
        ("hall", _("In the Hall")),
        ("pilgrimage", _("Pilgrimage")),
        ("trip", _("Trip")),
        ("doesnt_matter", _("Doesn't Matter")),
        ("agreement", _("Agreement")),
    )
    WORSHIP_PRAYER_OPTIONS = (
        ("fully_obligated", _("Fully Obligated")),
        ("sometimes", _("Sometimes")),
        ("not_obligated", _("Not Obligated")),
        ("doesnt_matter", _("Doesn't Matter")),
        ("disagree", _("Disagree")),
    )
    FASTING_OPTIONS = (
        ("fully_obligated", _("Fully Obligated")),
        ("sometimes", _("Sometimes")),
        ("not_obligated", _("Not Obligated")),
        ("disagree", _("Disagree")),
        ("doesnt_matter", _("Doesn't Matter")),
        ("sick", _("Sick")),
    )
    COVER_TYPE_HOUSE_OPTIONS = (
        ("cozy_attractive", _("Cozy & Attractive")),
        ("normal", _("Normal")),
    )
    COVER_TYPE_INNOCENT_CONTACT_OPTIONS = (
        ("only_chador", _("Only Chador")),
        ("formal_manto", _("Formal Manto")),
        ("colored_chador", _("Colored Chador")),
        ("cozy_attractive", _("Cozy & Attractive")),
    )
    PARTICIPATING_PRAYER_QURAN_MEETINGS_OPTIONS = (
        ("too_much", _("Too Much")),
        ("much", _("Much")),
        ("average", _("Average")),
        ("low", _("Low")),
        ("doesnt_matter", _("Doesn't Matter")),
    )
    MUSIC_OPTIONS = (
        ("too_much", _("Too Much")),
        ("much", _("Much")),
        ("average", _("Average")),
        ("low", _("Low")),
        ("never", _("Never")),
    )
    DANCE_SINGING_ASSEMBLIES_OPTIONS = (
        ("too_much", _("Too Much")),
        ("much", _("Much")),
        ("average", _("Average")),
        ("low", _("Low")),
        ("never", _("Never")),
    )
    OPINION_INNOCENT_CONTACT_OPTIONS = (
        ("daily_matters", _("Daily Matters")),
        ("work_matters", _("Work Matters")),
        ("doesnt_matter", _("Doesn't Matter")),
    )
    COVER_TYPE_SOCIETY_OPTIONS = (
        ("always_chador", _("Always Chador")),
        ("always_coverd_manto", _("Always Coverd Manto")),
        ("always_free_manto", _("Always Free Manto")),
        ("sometimes_chador", _("Sometimes Chador")),
        ("sometimes_coverd_manto", _("Sometimes Coverd Manto")),
        ("sometimes_free_manto", _("Sometimes Free Manto")),
    )
    DECISION_MAKING_CHOOSING_SPOUSE_OPTIONS = (
        ("dependent", _("Dependent")),
        ("independet", _("Independet")),
        ("counsole_with_parents", _("Counsole with Parents")),
        ("counsole_with_bros_and_siss", _("Counsole with Brothers and Sisters")),
        ("counsole_with_childs", _("Counsole with Childs")),
        ("counsole_with_professional", _("Counsole with Professional")),
    )
