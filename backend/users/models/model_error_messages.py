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
    INTRODUCED_SUBJECTS = {
        "blank": _("Introduced subjects cannot be blank."),
        "null": _("Introduced subjects cannot be null."),
        "invalid": _("Introduced subjects is invalid.")
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