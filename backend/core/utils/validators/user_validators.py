from django.core.validators import RegexValidator, FileExtensionValidator
from django.core.exceptions import ValidationError
from django.utils.translation import gettext_lazy as _
from datetime import date
from .preferred_wife_validators import PreferredWifePhysicalInformationValidator
from django.utils import timezone

class ConfidentialInfoValidator:
    landline_number_validator = RegexValidator(
        regex=r"^\d{3}-\d{8}$",
        message=_("Landline number must be in the format XXX-XXXXXXXX."),
    )

    name_validator = RegexValidator(
        regex=r"^[a-zA-Z\s\u0600-\u06FF]+$",
        message=_("Name must contain only letters and spaces"),
    )

    national_code_validator = RegexValidator(
        regex=r"^\d{10}$",
        message=_("National code must be exactly 10 digits"),
    )

    birth_certificate_serial_validator = RegexValidator(
        regex=r"^[A-Za-z0-9-]+$",
        message=_("Birth certificate serial must contain only letters, numbers, and hyphens"),
    )

    def validate_birth_date(value):
        today = date.today()
        age = today.year - value.year - ((today.month, today.day) < (value.month, value.day))
        if age < 18:
            raise ValidationError(_("Must be at least 18 years old"))
        if age > 100:
            raise ValidationError(_("Age cannot exceed 100 years"))

    def validate_marriage_dates(marriage_date, divorce_date, husband_death_date):
        if marriage_date and divorce_date and marriage_date > divorce_date:
            raise ValidationError(_("Marriage date cannot be after divorce date"))
        if marriage_date and husband_death_date and marriage_date > husband_death_date:
            raise ValidationError(_("Marriage date cannot be after husband's death date"))


class PhysicalInformationValidator(PreferredWifePhysicalInformationValidator):

    glasses_size_validator = RegexValidator(
        regex=r"^[-+]?\d*\.?\d+$",
        message=_("Glasses size must be a valid number"),
    )

    def validate_disease_info(disease_or_surgery, medication_type):
        if disease_or_surgery and not medication_type:
            raise ValidationError(_("Please provide medication/surgery/disease type"))
        if not disease_or_surgery and medication_type:
            raise ValidationError(_("Cannot provide medication type without disease history"))


class IntroducedSubjectsValidator:
    username_validator = RegexValidator(
        regex=r"^[a-zA-Z0-9_]+$",
        message=_("Username must contain only letters, numbers, and underscores"),
    )

    def validate_dates_of_meetings(value):
        if len(value.strip()) < 10:
            raise ValidationError(_("Dates of meetings must be at least 10 characters"))
        if len(value.strip()) > 1000:
            raise ValidationError(_("Dates of meetings must not exceed 1000 characters"))

    def validate_result_and_regards(value):
        if len(value.strip()) < 10:
            raise ValidationError(_("Result and regards must be at least 10 characters"))
        if len(value.strip()) > 1000:
            raise ValidationError(_("Result and regards must not exceed 1000 characters"))

    def validate_reason(value):
        if len(value.strip()) < 10:
            raise ValidationError(_("Reason must be at least 10 characters"))
        if len(value.strip()) > 500:
            raise ValidationError(_("Reason must not exceed 500 characters"))

    def validate_positive_negative(positive, negative):
        if positive and negative:
            raise ValidationError(_("Cannot be both positive and negative"))
        if not positive and not negative:
            raise ValidationError(_("Must select either positive or negative"))


class PaymentValidator:
    payment_proof_validator = FileExtensionValidator(
        allowed_extensions=["pdf", "jpg", "jpeg", "png"],
        message=_("Only PDF and image files (jpg, jpeg, png) are allowed"),
    )

    def validate_cost(value):
        try:
            cost = float(value.replace(",", ""))
            if cost < 0:
                raise ValidationError(_("Cost cannot be negative"))
        except ValueError:
            raise ValidationError(_("Invalid cost format"))


class FamilyInformationValidator:
    def validate_divorce_info(divorce_history, divorce_reason):
        if divorce_history and not divorce_reason:
            raise ValidationError(_("Please provide divorce reason when there is divorce history"))
        if not divorce_history and divorce_reason:
            raise ValidationError(_("Cannot provide divorce reason without divorce history"))

    contact_validator = RegexValidator(
        regex=r"^[a-zA-Z\s\u0600-\u06FF,.]+$",
        message=_("Contact information must contain only letters, spaces, and basic punctuation"),
    )

    def validate_death_date(death_date, alive):
        if alive and death_date:
            raise ValidationError(_("Cannot have death date for someone who is alive"))
        if not alive and not death_date:
            raise ValidationError(_("Must provide death date for someone who is not alive"))


class FinancialInformationValidator:
    def validate_rent_mortgage_info(residence_status, rent_amount, mortgage_amount):
        if residence_status == "RENT" and not rent_amount:
            raise ValidationError(_("Must provide rent amount for rental residence"))
        if residence_status == "MORTGAGE" and not mortgage_amount:
            raise ValidationError(_("Must provide mortgage amount for mortgaged residence"))

    amount_validator = RegexValidator(
        regex=r"^[0-9,]+$",
        message=_("Amount must contain only numbers and commas"),
    )

    def validate_jahiziyeh_info(jahiziyeh, explanation):
        if jahiziyeh == "OTHER" and not explanation:
            raise ValidationError(_("Must provide explanation for other jahiziyeh type"))
        if jahiziyeh != "OTHER" and explanation:
            raise ValidationError(_("Cannot provide jahiziyeh explanation for standard types"))

    def validate_ex_spouse_financial_info(status, pay_status, amount):
        if status == "NONE" and (pay_status != "NONE" or amount):
            raise ValidationError(_("Cannot have pay status or amount without financial obligations"))
        if status != "NONE" and not amount:
            raise ValidationError(_("Must provide amount for financial obligations"))


class ParentInformationValidator:
    language_validator = RegexValidator(
        regex=r"^[a-zA-Z\s\u0600-\u06FF,]+$",
        message=_("Language must contain only letters, spaces, and commas"),
    )

    job_validator = RegexValidator(
        regex=r"^[a-zA-Z\s\u0600-\u06FF-]+$",
        message=_("Job must contain only letters, spaces, and hyphens"),
    )

    def validate_parent_dates(birth_date, death_date, alive):
        if alive and death_date:
            raise ValidationError(_("Cannot have death date for living parent"))
        if not alive and not death_date:
            raise ValidationError(_("Must provide death date for deceased parent"))
        if death_date and birth_date and death_date < birth_date:
            raise ValidationError(_("Death date cannot be before birth date"))


class IntellectualInformationValidator:
    @staticmethod
    def validate_marriage_goals(value):
        """Validate marriage goals field."""
        if len(value.strip()) < 10:
            raise ValidationError(_("Marriage goals must be at least 10 characters long"))
        if len(value.strip()) > 1000:
            raise ValidationError(_("Marriage goals must not exceed 1000 characters"))

    @staticmethod
    def validate_pros_cons(value):
        """Validate pros and cons fields."""
        if len(value.strip()) < 10:
            raise ValidationError(_("Description must be at least 10 characters long"))
        if len(value.strip()) > 1000:
            raise ValidationError(_("Description must not exceed 1000 characters"))

    @staticmethod
    def validate_friends_connection_reason(value):
        """Validate friends connection reason field."""
        if len(value.strip()) < 10:
            raise ValidationError(_("Friends connection reason must be at least 10 characters long"))
        if len(value.strip()) > 100:
            raise ValidationError(_("Friends connection reason must not exceed 100 characters"))

    @staticmethod
    def validate_opinion_woman_job(value):
        """Validate opinion about woman's job."""
        if not value:
            raise ValidationError(_("Opinion about woman's job is required"))

    @staticmethod
    def validate_opinion_woman_edu(value):
        """Validate opinion about woman's education."""
        if not value:
            raise ValidationError(_("Opinion about woman's education is required"))

    def clean(self, data):
        """
        Perform complex validations that involve multiple fields.
        """
        errors = {}

        # Validate cover type consistency
        cover_type_house = data.get('cover_type_house')
        cover_type_society = data.get('cover_type_society')
        cover_type_innocent = data.get('cover_type_innocent_contact')

        if cover_type_house and cover_type_society and cover_type_innocent:
            # If someone chooses strict covering in society, they should have appropriate house covering
            if cover_type_society == 'always_chador' and cover_type_house in ['always_free_manto', 'sometimes_free_manto']:
                errors['cover_type_house'] = _("House covering type is inconsistent with society covering type")

            # If someone is very relaxed at home, they shouldn't claim to be very strict outside
            if cover_type_house in ['always_free_manto', 'sometimes_free_manto'] and \
               cover_type_society == 'always_chador' and \
               cover_type_innocent == 'only_chador':
                errors['cover_type_consistency'] = _("Covering type choices are inconsistent across different contexts")

        # Validate prayer and fasting consistency
        worship_prayer = data.get('worship_prayer')
        fasting = data.get('fasting')

        if worship_prayer and fasting:
            # If someone is very religious in prayer, they should be consistent in fasting
            if worship_prayer == 'five_times' and fasting in ['disagree', 'not_obligated']:
                errors['religious_consistency'] = _("Prayer and fasting habits appear inconsistent")

        # Validate political orientation and velayat faqih opinion consistency
        political_orientation = data.get('political_orientation')
        opinion_velayat_faqih = data.get('opinion_velayat_faqih')

        if political_orientation and opinion_velayat_faqih:
            if political_orientation and opinion_velayat_faqih == 'no_opinion':
                errors['political_consistency'] = _("Political orientation and Velayat Faqih opinion appear inconsistent")

        # Validate religious activities consistency
        participating_prayer_quran = data.get('participating_prayer_quran_meetings')
        music = data.get('music')
        dance_singing = data.get('dance_singing_assemblies')

        if participating_prayer_quran == 'always' and music == 'always_listen' and dance_singing == 'always_participate':
            errors['religious_activities_consistency'] = _("Religious activities participation appears inconsistent with entertainment choices")

        # Validate child-related opinions
        opinion_child_quantity = data.get('opinion_child_quantity')
        contract_how = data.get('contract_how')

        if opinion_child_quantity == 'no_children' and contract_how == 'permanent':
            errors['child_planning_consistency'] = _("No children preference is inconsistent with permanent marriage contract choice")

        if errors:
            raise ValidationError(errors)

        return data

class PersonalInformationValidator:
    @staticmethod
    def validate_birth_date(value):
        """Validate birth date."""
        today = timezone.now().date()
        age = today.year - value.year - ((today.month, today.day) < (value.month, value.day))
        
        if age < 18:
            raise ValidationError(_("Must be at least 18 years old"))
        if age > 100:
            raise ValidationError(_("Age cannot exceed 100 years"))

    @staticmethod
    def validate_military_status_explanation(value, military_status):
        """Validate military status explanation."""
        pass

    @staticmethod
    def validate_usage_case_description(value, usage_cases):
        """Validate usage case description: always optional, no dependency on usage_cases."""
        pass

    @staticmethod
    def validate_tatto_description(value, tatoo):
        """Validate tattoo description."""
        pass

    @staticmethod
    def validate_conviction_reason(value, conviction_history):
        """Validate conviction reason."""
        pass

    def clean(self, data):
        """
        Perform complex validations that involve multiple fields.
        """
        errors = {}

        # Validate military status and explanation consistency
        military_status = data.get('military_status')
        military_explanation = data.get('military_status_explanation')
        try:
            self.validate_military_status_explanation(military_explanation, military_status)
        except ValidationError as e:
            errors['military_status_explanation'] = e.message

        # Validate usage cases and description consistency
        usage_cases = data.get('usage_cases', [])
        usage_description = data.get('usage_case_description')
        try:
            self.validate_usage_case_description(usage_description, usage_cases)
        except ValidationError as e:
            errors['usage_case_description'] = e.message

        # Validate tattoo and description consistency
        tatoo = data.get('tatoo')
        tatto_description = data.get('tatto_description')
        try:
            self.validate_tatto_description(tatto_description, tatoo)
        except ValidationError as e:
            errors['tatto_description'] = e.message

        # Validate conviction history and reason consistency
        conviction_history = data.get('conviction_or_arrest_history')
        conviction_reason = data.get('conviction_reason')
        try:
            self.validate_conviction_reason(conviction_reason, conviction_history)
        except ValidationError as e:
            errors['conviction_reason'] = e.message

        # Validate insurance related fields
        have_insurance = data.get('have_insurance')
        insurance_type = data.get('insurance_type')
        insurance_years = data.get('insurance_years')

        if have_insurance:
            if not insurance_type:
                errors['insurance_type'] = _("Insurance type is required when you have insurance")
            if not insurance_years:
                errors['insurance_years'] = _("Insurance years is required when you have insurance")
        else:
            if insurance_type:
                errors['insurance_type'] = _("Insurance type should not be provided when you don't have insurance")
            if insurance_years:
                errors['insurance_years'] = _("Insurance years should not be provided when you don't have insurance")

        if errors:
            raise ValidationError(errors)

        return data

class UserValidator:
    @staticmethod
    def validate_username(value):
        """Validate username."""
        if len(value) < 3:
            raise ValidationError(_("Username must be at least 3 characters long"))
        if len(value) > 150:
            raise ValidationError(_("Username must not exceed 150 characters"))
        if not value.isalnum() and value != '_':
            raise ValidationError(_("Username must contain only letters, numbers, and underscores"))

    @staticmethod
    def validate_email(value):
        """Validate email."""
        if value and '@' not in value:
            raise ValidationError(_("Enter a valid email address"))

    @staticmethod
    def validate_access_code(value):
        """Validate access code."""
        if not value:
            raise ValidationError(_("Access code is required"))
        if len(value) > 50:
            raise ValidationError(_("Access code must not exceed 50 characters"))

    @staticmethod
    def validate_middle_man_code(value):
        """Validate middle man code."""
        if value and len(value) > 100:
            raise ValidationError(_("Middle man code must not exceed 100 characters"))

    def clean(self, data):
        """
        Perform complex validations that involve multiple fields.
        """
        errors = {}

        # Validate access code and middle man code consistency
        access_code = data.get('access_code')
        middle_man_code = data.get('middle_man_code')

        if not access_code and middle_man_code:
            errors['middle_man_code'] = _("Cannot have middle man code without access code")

        # Validate user status consistency
        is_active = data.get('is_active')
        is_staff = data.get('is_staff')
        is_superuser = data.get('is_superuser')

        if is_superuser and not is_staff:
            errors['is_staff'] = _("Superuser must be staff")

        if not is_active and is_staff:
            errors['is_staff'] = _("Inactive user cannot be staff")

        # Validate dates consistency
        if errors:
            raise ValidationError(errors)

        return data
