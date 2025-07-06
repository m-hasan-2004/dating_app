from django.utils.translation import gettext_lazy as _


class PhysicalInfoHelpText:
    HEIGHT = _("Enter the height of the user in centimeters.")
    WEIGHT = _("Enter the weight of the user in kilograms.")
    GLASSES = _("Does the user wear glasses?")
    GLASSES_SIZE = _("Enter the size of the glasses if applicable.")
    DISEASE_OR_SURGERY = _("Has the user had any disease or surgery?")
    MEDICATION_SURGERY_DISEASE_TYPE = _(
        "Specify the type of medication, surgery, or disease if applicable."
    )
    SKIN_COLOR = _("Select the skin color of the user.")
    EYES_COLOR = _("Select the eyes color of the user.")
    BLOOD_TYPE = _("Select the blood type of the user.")
    CHARACTER_AND_TEMPERAMENT = _("Select the character and temperament of the user.")
    BODY_AND_FACE = _("Select the body and face characteristics of the user.")
    USER = _("Select the user associated with this physical information.")


class PersonalInfoHelpText:
    GENDER = _("Select the gender of the user.")
    SADAT = _("Is the user a Sadat?")
    BIRTH_DATE = _("Enter the birth date of the user.")
    BIRTH_LOCATION = _("Enter the birth location of the user.")
    EDUCATION = _("Select the education level of the user.")
    DEGREE = _("Select the degree of the user.")
    MILITARY_STATUS = _("Select the military status of the user.")
    MILITARY_STATUS_EXPLANATION = _(
        "Provide an explanation for the military status if applicable."
    )
    INCOME = _("Enter the income of the user.")
    DEPOSIT = _("Enter the deposit amount of the user.")
    HAVE_INSURANCE = _("Show That User Has Insurance Or Not")
    INSURANCE_TYPE = _("Select the type of insurance the user has.")
    INSURANCE_YEARS = _("Enter the number of years the user has had insurance.")
    LEISURE_TYPE = _("Select the types of leisure activities the user enjoys.")
    USAGE_CASES = _("Select the usage cases applicable to the user.")
    USAGE_CASE_DESCRIPTION = _(
        "Provide additional details about usage cases. Like how many cigars or hookah a day."
    )
    TATTO = _("Indicate whether the user has any tattoos.")
    TATTO_DESCRIPTION = _("Provide details about the tattoos, like where on the body.")
    CONVICTION_OR_ARREST_HISTORY = _(
        "Does the user have a conviction or arrest history?"
    )
    CONVICTION_REASON = _("Specify the reason for the conviction if applicable.")
    USER = _("The user associated with this personal information.")


class FinancialInfoHelpText:
    CURRENT_RESIDENCE_STATUS = _("Select the current residence status of the user.")
    OWNERSHIP_STATUS = _("Select the ownership status of the residence.")
    RENT_AMOUNT = _("Enter the rent amount in the local currency.")
    MORTGAGE_AMOUNT = _("Enter the mortgage amount in the local currency.")
    CAPITAL = _("Select the types of capital owned by the user.")
    OTHER_CAPITAL = _("Enter the Other capitals owned by the user.")
    AFTER_MARRIAGE_RESIDENCE_STATUS = _("Select the residence status after marriage.")
    EX_SPOUSE_FINANCIAL_STATUS = _("Select the financial status with the ex-spouse.")
    EX_SPOUSE_FINANCIAL_AMOUNT = _(
        "Enter the financial amount related to the ex-spouse."
    )
    EX_SPOUSE_FINANCIAL_PAY_STATUS = _(
        "Select the payment status for the ex-spouse financial amount."
    )
    DOWRY_TYPE = _("Select the type of dowry Of Future Wife.")
    DOWRY_AMOUNT = _("Enter the dowry amount in the local currency or gold.")
    JAHIZIYEH = _("Select the Status of Jahiziyeh.")
    JAHIZIYEH_EXPLANATION = _("Write the Explanation of Jahiziyeh.")
    USER = _("Select the user associated with this financial information.")


class AccessCodeHelpText:
    CODE = _("Unique access code for user creation.")
    ACTIVE = _("Indicates whether the access code is active.")
    DATE_CREATED = _("The date and time when the access code was created.")


class FamilyInfoHelpText:
    EX_HUSBAND_CHILD_STATUS = _("Check the box if you have child from ex husband")
    AVERAGE_FAMILY_EDUCATION = _("Select the average family education level.")
    AVERAGE_FAMILY_FINANCE = _("Select the average family financial status.")
    FAMILY_DIVORCE_HISTORY = _(
        "Indicate if there is a history of divorce in the family."
    )
    FAMILY_DIVORCE_REASON = _(
        "Specify the reason for the family divorce if applicable."
    )
    CONTACT_WITH_FAMILY = _("Describe the contact with the family.")
    CONTACT_WITH_RELATIVES = _("Describe the contact with the Relatives.")
    USER = _("Select the user associated with this family information.")
    STATUS = _("Select the Status Of Life.")
    PERSON_STATUS = _("If user has engagment or related history")
    CONTRACT_LENGTH = _("Enter the length of the contract.")
    LIVING_LENGTH = _("Enter the length of living together.")
    DEATH_DATE = _("Enter the death date if applicable.")
    DIVORCE_DATE = _("Enter the divorce date if applicable.")
    REASON_FOR_DIVORCE_OR_DEATH = _(
        "Specify the reason for divorce or death if applicable."
    )
    BIRTH_DATE = _("Enter the birth date of the girl if applicable.")
    CUSTODY = _("Select the custody status of the children.")
    LIVING_LOCATION = _("Enter the living location if applicable.")
    EDUCATION = _("Select the education level of the family member.")
    JOB = _("Enter the job of the family member.")
    LANGUAGE = _("Enter the language spoken by the parent.")
    BIRTH_DATE = _("Enter the birth date of the parent.")
    ORIGINALITY = _("Enter the originality of the parent.")
    ALIVE = _("Indicate if the parent is alive.")
    DEATH_DATE_PARENT = _("Enter the death date of the parent if applicable.")
    GROOM_OR_ZAN = (_("Select the groom from the available options."),)
    BRIDE_OR_WIFE = _("Select the bride or wife from the available options.")


class IdentityInfoHelpText:
    FIRST_NAME = _("Enter the first name of the user.")
    LAST_NAME = _("Enter the last name of the user.")
    FATHER_NAME = _("Enter the father's name of the user.")
    EITTA_NUMBER = _("Enter a unique Eitta number in the format: +98 or 09**.")
    LANDLINE_PHONE = _("Enter a landline number in the format: 025-32305083.")
    MOTHER_PHONE = _(
        "Enter a unique phone number for the mother in the format: +98 or 09**."
    )
    FATHER_PHONE = _(
        "Enter a unique phone number for the father in the format: +98 or 09**."
    )
    HOME_ADDRESS = _("Enter the home address of the user.")
    WORK_ADDRESS = _("Enter the work address of the user.")
    ORIGINALITY = _("Enter the originality of the user.")
    EDUCATION = _("Enter the education level of the user.")
    JOB = _("Select the job of the user.")
    INSURANCE = _("Select the insurance type of the user.")
    INCOME = _("Enter the income of the user in Tooman.")
    ASSETS = _("Enter the assets of the user.")
    WEIGHT = _("Enter the weight of the user in kilograms.")
    HEIGHT = _("Enter the height of the user in centimeters.")
    INTRODUCED_SUBJECTS = _("Select the user who introduced the subjects.")
    INTRODUCED_SUBJECTS_EXPLANTIONS = _(
        "Needed Explantions About Result of Introduced Subjects."
    )
    PREFERED_MEETING_TIME = _("Enter the preferred meeting time of the user.")
    TYPE_OF_PAYMENT = _("Select the type of payment.")
    PAYMENT_PROOF = _("Upload a PDF, JPG, or PNG file as proof of payment.")
    USER = _("Select the user associated with this identity information.")


class BirthCertificateInfoHelpText:
    NATIONAL_CODE = _("Enter the national code of the user.")
    BIRTH_CERTIFICATE_SERIAL = _(
        "Enter the birth certificate serial number of the user."
    )
    BIRTH_CERTIFICATE_LOCATION = _(
        "Enter the location where the birth certificate was issued."
    )
    MARRIAGE_EXPERINCE = _("Select the marriage experience of the user.")
    CONTRACT_DATE = _("Enter the contract date.")
    MARRIAGE_STATUS = _("Select the marriage status of the user.")
    MARRIAGE_DATE = _("Enter the marriage date.")
    DIVORCE_DATE = _("Enter the divorce date.")
    HUSBAND_DEATH_DATE = _("Enter the husband death date.")
    BIRTH_DATE = _("Enter the birth date of the user.")
    CHILDREN = _("Select the number of children.")
    CHILDREN_CUSTODY = _("Select the custody status of the children.")
    USER = _("Select the user associated with this birth certificate information.")


class UserHelpText:
    ID = _("Unique identifier for the user.")
    ACCESS_CODE = _("Required access code for initial user creation.")
    MIDDLE_MAN_CODE = _("Optional Username or Full Name for middle man reference.")
    USERNAME = _("150 characters or fewer. Letters, digits and @/./+/-/_ only.")
    FIRST_NAME = _("150 characters or fewer.")
    LAST_NAME = _("150 characters or fewer.")
    DATE_CREATED = _("The date and time when the user was created.")
    PHONE_NUMBER = _("+98 or 09** format accepted.")
    EMAIL = _("Email format accepted.")
    IS_STAFF = _("Designates whether the user can log into this admin site.")
    IS_ACTIVE = _(
        "Designates whether this user should be treated as active. Unselect this instead of deleting accounts."
    )
    DATE_JOINED = _("The date and time when the user joined.")


class IntellectualInfoHelpText:
    FASTING_EXPLANATION = _("If you cannot fast due to sickness, please explain your condition.")
    MARRIAGE_GOALS = _("Describe your goals and purposes for marriage in detail.")
    OPINION_WOMAN_JOB = _(
        "Select your opinion about a woman's job and employment status."
    )
    OPINION_WOMAN_EDU = _("Choose your stance on women's education.")
    PROS_OF_YOURSELF = _("List positive traits about yourself.")
    CONS_OF_YOURSELF = _("List aspects of yourself you wish to improve.")
    TYPE_CONNECTION_FRIENDS = _(
        "Specify the type of connection you prefer with friends."
    )
    FRIENDS_CONNECTION_REASON = _("Explain why you connect with friends.")
    POLITICAL_ORIENTATION = _("Indicate whether you have a political orientation.")
    OPINION_VELAYAT_FAQIH = _("State your opinion on Velayat Faqih.")
    OPINION_CHILD_QUANTITY = _("How many children do you prefer to have?")
    CONTRACT_HOW = _("Define how you prefer the marriage contract to be arranged.")
    WEDDING_HOW = _("Choose your preferred wedding arrangement.")
    WORSHIP_PRAYER = _("Indicate your level of commitment to worship and prayer.")
    FASTING = _("Describe your practice regarding fasting.")
    COVER_TYPE_HOUSE = _("Choose your preferred clothing style at home.")
    COVER_TYPE_SOCIETY = _("Select your dress preference in society and the workplace.")
    UNIQUE_ID = _("A unique identifier for this record.")
    PARTICIPATING_PRAYER_QURAN_MEETINGS = _(
        "Select your level of participation in prayer and Quran meetings."
    )
    MUSIC = _("Select your music preference.")
    DANCE_SINGING_ASSEMBLIES = _(
        "Select your preference for dance and singing assemblies."
    )
    OPINION_INNOCENT_CONTACT = _("Select your opinion about innocent contacts.")
    COVER_TYPE_INNOCENT_CONTACT = _(
        "Select the cover type for innocent contact situations."
    )
    DECISION_MAKING_CHOOSING_SPOUSE = _(
        "Select your decision-making approach when choosing a spouse."
    )
    USER = _("Select the user associated with this information.")


class IntroducedSubjectsHelpText:
    USERNAME = _(
        "Enter the username of the introduced subject. This should be unique and descriptive."
    )
    POSTIVE = _("Indicate whether the introduction was positive.")
    NEGATIVE = _("Indicate whether the introduction was negative.")
    REASON = _("Provide a detailed reason for the introduction's outcome.")
    DATES_OF_MEETINGS = _("List the dates of meetings with the introduced subject.")
    RESULT_AND_REGARDS = _("Summarize the results and any regards from the meetings.")
    COST_OF_INTRODUCTION = _("Specify the cost associated with the introduction.")
    COST_OF_MEETING = _("Specify the cost associated with the meetings.")
    USER = _("Select the user associated with this information.")

