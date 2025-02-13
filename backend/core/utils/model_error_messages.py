from django.utils.translation import gettext_lazy as _

class UserErrorMessages:
    USERNAME = {
        "unique": _("This username is already taken."),
        "blank": _("Username cannot be blank."),
        "null": _("Username cannot be null."),
        "max_length": _("Username cannot exceed 150 characters."),
        "invalid": _("Username is invalid.")
    }
    EMAIL = {
        "unique": _("This email is already taken."),
        "blank": _("Email cannot be blank."),
        "null": _("Email cannot be null."),
        "invalid": _("Email is invalid.")
    }
    PHONE_NUMBER = {
        "unique": _("This phone number is already taken."),
        "blank": _("Phone number cannot be blank."),
        "null": _("Phone number cannot be null."),
        "invalid": _("Phone number is invalid.")
    }
    ACCESS_CODE = {
        "blank": _("Access code cannot be blank."),
        "null": _("Access code cannot be null."),
        "invalid": _("Access code is invalid.")
    }
    FIRST_NAME = {
        "blank": _("First name cannot be blank."),
        "null": _("First name cannot be null."),
        "max_length": _("First name cannot exceed 150 characters.")
    }
    LAST_NAME = {
        "blank": _("Last name cannot be blank."),
        "null": _("Last name cannot be null."),
        "max_length": _("Last name cannot exceed 150 characters.")
    }
    MIDDLE_MAN_CODE = {
        "blank": _("Middle man code cannot be blank."),
        "null": _("Middle man code cannot be null."),
        "invalid": _("Middle man code is invalid.")
    }
    DATE_CREATED = {
        "blank": _("Date created cannot be blank."),
        "null": _("Date created cannot be null."),
        "invalid": _("Date created is invalid.")
    }
    IS_STAFF = {
        "blank": _("Staff status cannot be blank."),
        "null": _("Staff status cannot be null."),
        "invalid": _("Staff status is invalid.")
    }
    IS_ACTIVE = {
        "blank": _("Active status cannot be blank."),
        "null": _("Active status cannot be null."),
        "invalid": _("Active status is invalid.")
    }
    DATE_JOINED = {
        "blank": _("Date joined cannot be blank."),
        "null": _("Date joined cannot be null."),
        "invalid": _("Date joined is invalid.")
    }

class AccessCodeErrorMessages:
    CODE = {
        "unique": _("This access code is already taken."),
        "blank": _("Access code cannot be blank."),
        "null": _("Access code cannot be null."),
        "invalid": _("Access code is invalid.")
    }
    ACTIVE = {
        "blank": _("Active status cannot be blank."),
        "null": _("Active status cannot be null."),
        "invalid": _("Active status is invalid.")
    }
    DATE_CREATED = {
        "blank": _("Date created cannot be blank."),
        "null": _("Date created cannot be null."),
        "invalid": _("Date created is invalid.")
    }

class IdentityInfoErrorMessages:
    FIRST_NAME = {
        "blank": _("First name cannot be blank."),
        "null": _("First name cannot be null."),
        "max_length": _("First name cannot exceed 80 characters.")
    }
    LAST_NAME = {
        "blank": _("Last name cannot be blank."),
        "null": _("Last name cannot be null."),
        "max_length": _("Last name cannot exceed 50 characters.")
    }
    FATHER_NAME = {
        "blank": _("Father's name cannot be blank."),
        "null": _("Father's name cannot be null."),
        "max_length": _("Father's name cannot exceed 80 characters.")
    }
    EITTA_NUMBER = {
        "unique": _("This Eitta number is already taken."),
        "blank": _("Eitta number cannot be blank."),
        "null": _("Eitta number cannot be null."),
        "invalid": _("Eitta number is invalid.")
    }
    LANDLINE_PHONE = {
        "blank": _("Landline phone cannot be blank."),
        "null": _("Landline phone cannot be null."),
        "invalid": _("Landline phone is invalid.")
    }
    MOTHER_PHONE = {
        "unique": _("This mother's phone number is already taken."),
        "blank": _("Mother's phone number cannot be blank."),
        "null": _("Mother's phone number cannot be null."),
        "invalid": _("Mother's phone number is invalid.")
    }
    FATHER_PHONE = {
        "unique": _("This father's phone number is already taken."),
        "blank": _("Father's phone number cannot be blank."),
        "null": _("Father's phone number cannot be null."),
        "invalid": _("Father's phone number is invalid.")
    }
    HOME_ADDRESS = {
        "blank": _("Home address cannot be blank."),
        "null": _("Home address cannot be null."),
        "max_length": _("Home address cannot exceed 150 characters.")
    }
    WORK_ADDRESS = {
        "blank": _("Work address cannot be blank."),
        "null": _("Work address cannot be null."),
        "max_length": _("Work address cannot exceed 150 characters.")
    }
    ORIGINALITY = {
        "blank": _("Originality cannot be blank."),
        "null": _("Originality cannot be null."),
        "max_length": _("Originality cannot exceed 80 characters.")
    }
    EDUCATION = {
        "blank": _("Education cannot be blank."),
        "null": _("Education cannot be null."),
        "max_length": _("Education cannot exceed 80 characters.")
    }
    JOB = {
        "blank": _("Job cannot be blank."),
        "null": _("Job cannot be null."),
        "invalid": _("Job is invalid.")
    }
    INSURANCE = {
        "blank": _("Insurance cannot be blank."),
        "null": _("Insurance cannot be null."),
        "invalid": _("Insurance is invalid.")
    }
    INCOME = {
        "blank": _("Income cannot be blank."),
        "null": _("Income cannot be null."),
        "invalid": _("Income is invalid.")
    }
    ASSETS = {
        "blank": _("Assets cannot be blank."),
        "null": _("Assets cannot be null."),
        "max_length": _("Assets cannot exceed 150 characters.")
    }
    WEIGHT = {
        "blank": _("Weight cannot be blank."),
        "null": _("Weight cannot be null."),
        "invalid": _("Weight is invalid.")
    }
    HEIGHT = {
        "blank": _("Height cannot be blank."),
        "null": _("Height cannot be null."),
        "invalid": _("Height is invalid.")
    }
    PREFERED_MEETING_TIME = {
        "blank": _("Preferred meeting time cannot be blank."),
        "null": _("Preferred meeting time cannot be null."),
        "max_length": _("Preferred meeting time cannot exceed 150 characters.")
    }
    TYPE_OF_PAYMENT = {
        "blank": _("Type of payment cannot be blank."),
        "null": _("Type of payment cannot be null."),
        "invalid": _("Type of payment is invalid.")
    }
    PAYMENT_PROOF = {
        "invalid": _("Invalid file type. Only PDF, JPG, JPEG, and PNG files are allowed.")
    }
    USER = {
        "blank": _("User cannot be blank."),
        "null": _("User cannot be null."),
        "invalid": _("User is invalid.")
    }

class BirthCertificateInfoErrorMessages:
    NATIONAL_CODE = {
        "unique": _("This national code is already taken."),
        "blank": _("National code cannot be blank."),
        "null": _("National code cannot be null."),
        "max_length": _("National code cannot exceed 10 characters.")
    }
    BIRTH_CERTIFICATE_SERIAL = {
        "blank": _("Birth certificate serial cannot be blank."),
        "null": _("Birth certificate serial cannot be null."),
        "max_length": _("Birth certificate serial cannot exceed 10 characters.")
    }
    BIRTH_CERTIFICATE_LOCATION = {
        "blank": _("Birth certificate location cannot be blank."),
        "null": _("Birth certificate location cannot be null."),
        "max_length": _("Birth certificate location cannot exceed 50 characters.")
    }
    MARRIAGE_EXPERINCE = {
        "blank": _("Marriage experience cannot be blank."),
        "null": _("Marriage experience cannot be null."),
        "invalid": _("Marriage experience is invalid.")
    }
    CONTRACT_DATE = {
        "blank": _("Contract date cannot be blank."),
        "null": _("Contract date cannot be null."),
        "invalid": _("Contract date is invalid.")
    }
    MARRIAGE_STATUS = {
        "blank": _("Marriage status cannot be blank."),
        "null": _("Marriage status cannot be null."),
        "invalid": _("Marriage status is invalid.")
    }
    MARRIAGE_DATE = {
        "blank": _("Marriage date cannot be blank."),
        "null": _("Marriage date cannot be null."),
        "invalid": _("Marriage date is invalid.")
    }
    DIVORCE_DATE = {
        "blank": _("Divorce date cannot be blank."),
        "null": _("Divorce date cannot be null."),
        "invalid": _("Divorce date is invalid.")
    }
    HUSBAND_DEATH_DATE = {
        "blank": _("Husband death date cannot be blank."),
        "null": _("Husband death date cannot be null."),
        "invalid": _("Husband death date is invalid.")
    }
    BIRTH_DATE = {
        "blank": _("Birth date cannot be blank."),
        "null": _("Birth date cannot be null."),
        "invalid": _("Birth date is invalid.")
    }
    CHILDREN = {
        "blank": _("Children cannot be blank."),
        "null": _("Children cannot be null."),
        "invalid": _("Children is invalid.")
    }
    CHILDREN_CUSTODY = {
        "blank": _("Children custody cannot be blank."),
        "null": _("Children custody cannot be null."),
        "invalid": _("Children custody is invalid.")
    }
    USER = {
        "blank": _("User cannot be blank."),
        "null": _("User cannot be null."),
        "invalid": _("User is invalid.")
    }

class PersonalInfoErrorMessages:
    GENDER = {
        "required": _("Gender is required."),
        "invalid_choice": _("Invalid choice for gender."),
    }
    SADAT = {
        "required": _("Sadat field is required."),
    }
    BIRTH_DATE = {
        "required": _("Birth date is required."),
        "invalid": _("Invalid birth date format."),
    }
    BIRTH_LOCATION = {
        "required": _("Birth location is required."),
        "max_length": _("Birth location cannot exceed 50 characters."),
    }
    EDUCATION = {
        "required": _("Education is required."),
        "invalid_choice": _("Invalid choice for education."),
    }
    DEGREE = {
        "required": _("Degree is required."),
        "invalid_choice": _("Invalid choice for degree."),
    }
    MILITARY_STATUS = {
        "required": _("Military status is required."),
        "invalid_choice": _("Invalid choice for military status."),
    }
    INCOME = {
        "required": _("Income is required."),
        "invalid": _("Invalid income value."),
    }
    DEPOSIT = {
        "required": _("Deposit is required."),
        "invalid": _("Invalid deposit value."),
    }
    INSURANCE_TYPE = {
        "required": _("Insurance type is required."),
        "invalid_choice": _("Invalid choice for insurance type."),
    }
    INSURANCE_YEARS = {
        "required": _("Insurance years are required."),
        "invalid": _("Invalid insurance years value."),
        "max_value": _("Insurance years cannot exceed 60."),
    }
    LEISURE_TYPE = {
        "required": _("Leisure type is required."),
        "invalid_choice": _("Invalid choice for leisure type."),
    }
    USAGE_CASES = {
        "required": _("Usage cases are required."),
        "invalid_choice": _("Invalid choice for usage cases."),
    }
    CONVICTION_OR_ARREST_HISTORY = {
        "required": _("Conviction or arrest history is required."),
    }
    CONVICTION_REASON = {
        "required": _("Conviction reason is required."),
        "max_length": _("Conviction reason cannot exceed 150 characters."),
    }
    USER = {
        "required": _("User is required."),
    }
    TATTO = _("Invalid value for the tattoo field.")
    TATTO_DESCRIPTION = _("Invalid description provided for tattoos.")
    USAGE_CASE_DESCRIPTION = _("Invalid usage case description.")

class PhysicalInfoErrorMessages:
    HEIGHT = {
        "required": _("Height is required."),
        "invalid": _("Invalid height value."),
        "max_value": _("Height cannot exceed 260 cm."),
    }
    WEIGHT = {
        "required": _("Weight is required."),
        "invalid": _("Invalid weight value."),
        "max_value": _("Weight cannot exceed 300 kg."),
    }
    SKIN_COLOR = {
        "required": _("Skin color is required."),
        "invalid_choice": _("Invalid choice for skin color."),
    }
    EYES_COLOR = {
        "required": _("Eyes color is required."),
        "invalid_choice": _("Invalid choice for eyes color."),
    }
    BLOOD_TYPE = {
        "required": _("Blood type is required."),
        "invalid_choice": _("Invalid choice for blood type."),
    }
    CHARACTER_AND_TEMPERAMENT = {
        "required": _("Character and temperament is required."),
        "invalid_choice": _("Invalid choice for character and temperament."),
    }
    GLASSES = {
        "required": _("Glasses field is required."),
    }
    GLASSES_SIZE = {
        "invalid": _("Invalid glasses size value."),
    }
    BODY_AND_FACE = {
        "required": _("Body and face is required."),
        "invalid_choice": _("Invalid choice for body and face."),
    }
    DISEASE_OR_SURGERY = {
        "required": _("Disease or surgery field is required."),
    }
    MEDICATION_SURGERY_DISEASE_TYPE = {
        "max_length": _("Medication, surgery, or disease type cannot exceed 100 characters."),
    }
    USER = {
        "required": _("User is required."),
    }

class FamilyInfoErrorMessages:
    AVERAGE_FAMILY_EDUCATION = {
        "required": _("Average family education is required."),
        "invalid_choice": _("Invalid choice for average family education."),
    }
    AVERAGE_FAMILY_FINANCE = {
        "required": _("Average family finance is required."),
        "invalid_choice": _("Invalid choice for average family finance."),
    }
    FAMILY_DIVORCE_HISTORY = {
        "required": _("Family divorce history is required."),
    }
    FAMILY_DIVORCE_REASON = {
        "max_length": _("Family divorce reason cannot exceed 150 characters."),
    }
    CONTACT_WITH_FAMILY = {
        "required": _("Contact with family is required."),
        "max_length": _("Contact with family cannot exceed 50 characters."),
    }
    ENGAGEMENT_OR_WEDDING_STATUS = {
        "required": _("Engagement or wedding status is required."),
        "invalid_choice": _("Invalid choice for engagement or wedding status."),
    }
    EX_HUSBAND_CHILD_STATUS = {
        "required": _("Ex-husband child status is required."),
    }
    GIRL_BIRTH_DATE = {
        "invalid": _("Invalid girl birth date."),
    }
    BOY_BIRTH_DATE = {
        "invalid": _("Invalid boy birth date."),
    }
    CUSTODY = {
        "required": _("Custody is required."),
        "invalid_choice": _("Invalid choice for custody."),
    }
    LIVING_LOCATION = {
        "max_length": _("Living location cannot exceed 50 characters."),
    }

class FinancialInformationErrorMessages:
    CURRENT_RESIDENCE_STATUS_ERROR_MESSAGES = {
        'required': "Current residence status is required.",
        'invalid_choice': "Invalid choice for current residence status.",
    }
    OWNERSHIP_STATUS_ERROR_MESSAGES = {
        'required': "Ownership status is required.",
        'invalid_choice': "Invalid choice for ownership status.",
    }
    RENT_AMOUNT_ERROR_MESSAGES = {
        'required': "Rent amount is required.",
        'invalid': "Invalid value for rent amount.",
    }
    MORTGAGE_AMOUNT_ERROR_MESSAGES = {
        'required': "Mortgage amount is required.",
        'invalid': "Invalid value for mortgage amount.",
    }
    CAPITAL_ERROR_MESSAGES = {
        'required': "Capital is required.",
        'invalid_choice': "Invalid choice for capital.",
    }
    OTHER_CAPTIAL_ERROR_MESSAGES = {
        'max_length': "Other Captial cannot exceed 150 characters.",
    }
    AFTER_MARRIAGE_RESIDENCE_STATUS_ERROR_MESSAGES = {
        'required': "After marriage residence status is required.",
        'invalid_choice': "Invalid choice for after marriage residence status.",
    }
    EX_SPOUSE_FINANCIAL_STATUS_ERROR_MESSAGES = {
        'required': "Ex-spouse financial status is required.",
        'invalid_choice': "Invalid choice for ex-spouse financial status.",
    }
    EX_SPOUSE_FINANCIAL_AMOUNT_ERROR_MESSAGES = {
        'required': "Ex-spouse financial amount is required.",
        'max_length': "Ex-spouse financial amount cannot exceed 50 characters.",
    }
    EX_SPOUSE_FINANCIAL_PAY_STATUS_ERROR_MESSAGES = {
        'required': "Ex-spouse financial pay status is required.",
        'invalid_choice': "Invalid choice for ex-spouse financial pay status.",
    }
    DOWRY_TYPE_ERROR_MESSAGES = {
        'required': "Dowry type is required.",
        'invalid_choice': "Invalid choice for dowry type.",
    }
    DOWRY_AMOUNT_ERROR_MESSAGES = {
        'required': "Dowry amount is required.",
        'max_length': "Dowry amount cannot exceed 50 characters.",
    }
    JAHIZIYEH_ERROR_MESSAGES = {
        'required': "Dowry type is required.",
        'invalid_choice': "Invalid choice for dowry type.",
    }

class IntellectualInfoErrorMessages:
    MARRIAGE_GOALS = {
        "required": _("Marriage goals and purposes cannot be empty."),
        "max_length": _("Marriage goals should not exceed 1000 characters."),
    }
    OPINION_WOMAN_JOB = {
        "required": _("Please provide your opinion about a woman's job."),
        "invalid_choice": _("The selected option for a woman's job is not valid."),
    }
    OPINION_WOMAN_EDU = {
        "required": _("Please provide your opinion about a woman's education."),
        "invalid_choice": _("The selected option for a woman's education is not valid."),
    }
    PROS_OF_YOURSELF = {
        "required": _("Please list some of your positive attributes."),
        "max_length": _("Your pros should not exceed 1000 characters."),
    }
    CONS_OF_YOURSELF = {
        "required": _("Please list some of your negative attributes."),
        "max_length": _("Your cons should not exceed 1000 characters."),
    }
    TYPE_CONNECTION_FRIENDS = {
        "required": _("Please specify the type of connection you have with friends."),
        "invalid_choice": _("Invalid selection for type of friends' connection."),
    }
    FRIENDS_CONNECTION_REASON = {
        "required": _("Please explain why you maintain connections with your friends."),
        "max_length": _("Your explanation should not exceed 500 characters."),
    }
    POLITICAL_ORIENTATION = {
        "required": _("Please specify your political orientation."),
        "invalid": _("Invalid input for political orientation."),
    }
    OPINION_VELAYAT_FAQIH = {
        "required": _("Please share your opinion about Velayat Faqih."),
        "invalid_choice": _("Invalid selection for opinion about Velayat Faqih."),
    }
    OPINION_CHILD_QUANTITY = {
        "required": _("Please specify your opinion about the number of children."),
        "invalid_choice": _("Invalid selection for child quantity preference."),
    }
    CONTRACT_HOW = {
        "required": _("Please specify how you prefer the marriage contract."),
        "invalid_choice": _("Invalid selection for contract preferences."),
    }
    WEDDING_HOW = {
        "required": _("Please specify how you prefer the wedding."),
        "invalid_choice": _("Invalid selection for wedding preferences."),
    }
    WORSHIP_PRAYER = {
        "required": _("Please describe your worship and prayer habits."),
        "invalid_choice": _("Invalid selection for worship and prayer habits."),
    }
    FASTING = {
        "required": _("Please specify your fasting habits."),
        "invalid_choice": _("Invalid selection for fasting habits."),
    }
    COVER_TYPE_HOUSE = {
        "required": _("Please specify the type of covering you use at home."),
        "invalid_choice": _("Invalid selection for house covering type."),
    }
    COVER_TYPE_SOCIETY = {
        "required": _("Please specify the type of covering you use in society and workplace."),
        "invalid_choice": _("Invalid selection for society and workplace covering type."),
    }
    UNIQUE_ID = {
        "required": _("A unique ID is required."),
        "unique": _("This ID already exists. Please use a different one."),
    }
    PARTICIPATING_PRAYER_QURAN_MEETINGS = {
        "required": _("This field is required. Please select an option."),
    }
    MUSIC = {
        "required": _("This field is required. Please select an option."),
    }
    DANCE_SINGING_ASSEMBLIES = {
        "required": _("This field is required. Please select an option."),
    }
    OPINION_INNOCENT_CONTACT = {
        "required": _("This field is required. Please select an option."),
    }
    COVER_TYPE_INNOCENT_CONTACT = {
        "required": _("This field is required. Please select an option."),
    }
    DECISION_MAKING_CHOOSING_SPOUSE = {
        "required": _("This field is required. Please select an option for decision making."),
    }

class IntroducedSubjectsErrorMessages:
    USERNAME = {
        "required": _("The username is required."),
        "max_length": _("The username cannot exceed 50 characters."),
    }
    POSTIVE = {
        "required": _("You must indicate whether the introduction was positive."),
    }
    NEGATIVE = {
        "required": _("You must indicate whether the introduction was negative."),
    }
    REASON = {
        "required": _("A reason for the introduction's outcome is required."),
    }
    DATES_OF_MEETINGS = {
        "required": _("You must provide the dates of meetings."),
    }
    RESULT_AND_REGARDS = {
        "required": _("You must summarize the results and any regards from the meetings."),
    }
    COST_OF_INTRODUCTION = {
        "required": _("The cost of introduction is required."),
        "max_length": _("The cost of introduction cannot exceed 100 characters."),
    }
    COST_OF_MEETING = {
        "required": _("The cost of meeting is required."),
        "max_length": _("The cost of meeting cannot exceed 100 characters."),
    }
