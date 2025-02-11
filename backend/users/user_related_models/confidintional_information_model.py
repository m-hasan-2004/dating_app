from core.utils.validators import LandlineNumberValidator
from phonenumber_field.modelfields import PhoneNumberField
from django.utils.translation import gettext_lazy as _
from multiselectfield import MultiSelectField
from django.urls import reverse
from django.db import models
from core.utils.model_choices import Choices, FinancialInformationChoices
from core.utils.model_error_messages import IdentityInfoErrorMessages, BirthCertificateInfoErrorMessages, IntroducedSubjectsErrorMessages
from core.utils.help_text import IdentityInfoHelpText, BirthCertificateInfoHelpText, IntroducedSubjectsHelpText
from django.core.validators import FileExtensionValidator

class IdentityInformation(models.Model):
    first_name = models.CharField(
        _("First Name"),
        max_length=80,
        error_messages=IdentityInfoErrorMessages.FIRST_NAME,
        help_text=IdentityInfoHelpText.FIRST_NAME,
        db_index=True,
    )
    last_name = models.CharField(
        _("Last Name"),
        max_length=50,
        error_messages=IdentityInfoErrorMessages.LAST_NAME,
        help_text=IdentityInfoHelpText.LAST_NAME,
        db_index=True,
    )
    father_name = models.CharField(
        _("Father's Name"),
        max_length=80,
        error_messages=IdentityInfoErrorMessages.FATHER_NAME,
        help_text=IdentityInfoHelpText.FATHER_NAME,
    )
    eitta_number = PhoneNumberField(
        _("Eitta Number"),
        unique=True,
        region="IR",
        error_messages=IdentityInfoErrorMessages.EITTA_NUMBER,
        help_text=IdentityInfoHelpText.EITTA_NUMBER,
        db_index=True,
    )
    landline_phone = models.CharField(
        _("Landline Phone"),
        max_length=12,
        validators=[LandlineNumberValidator.landline_number_validator],
        blank=True,
        null=True,
        error_messages=IdentityInfoErrorMessages.LANDLINE_PHONE,
        help_text=IdentityInfoHelpText.LANDLINE_PHONE,
    )
    mother_phone = PhoneNumberField(
        _("Mother's Phone"),
        unique=True,
        region="IR",
        blank=True,
        null=True,
        error_messages=IdentityInfoErrorMessages.MOTHER_PHONE,
        help_text=IdentityInfoHelpText.MOTHER_PHONE,
        db_index=True,
    )
    father_phone = PhoneNumberField(
        _("Father's Phone"),
        unique=True,
        region="IR",
        blank=True,
        null=True,
        error_messages=IdentityInfoErrorMessages.FATHER_PHONE,
        help_text=IdentityInfoHelpText.FATHER_PHONE,
        db_index=True,
    )
    home_address = models.CharField(
        _("Home Address"),
        max_length=150,
        error_messages=IdentityInfoErrorMessages.HOME_ADDRESS,
        help_text=IdentityInfoHelpText.HOME_ADDRESS,
    )
    work_address = models.CharField(
        _("Work Address"),
        max_length=150,
        blank=True,
        null=True,
        error_messages=IdentityInfoErrorMessages.WORK_ADDRESS,
        help_text=IdentityInfoHelpText.WORK_ADDRESS,
    )
    originality = models.CharField(
        _("Originality"),
        max_length=80,
        error_messages=IdentityInfoErrorMessages.ORIGINALITY,
        help_text=IdentityInfoHelpText.ORIGINALITY,
    )
    education = models.CharField(
        _("Education"),
        choices=Choices.EDUCATION_CHOICES,
        error_messages=IdentityInfoErrorMessages.EDUCATION,
        help_text=IdentityInfoHelpText.EDUCATION,
    )
    job = models.CharField(
        _("Job"),
        max_length=100,
        error_messages=IdentityInfoErrorMessages.JOB,
        help_text=IdentityInfoHelpText.JOB,
    )
    insurance = models.CharField(
        _("Insurance"),
        max_length=50,
        choices=Choices.INSURANCE_OPTIONS,
        error_messages=IdentityInfoErrorMessages.INSURANCE,
        help_text=IdentityInfoHelpText.INSURANCE,
    )
    income = models.CharField(
        _("Income in Tooman"),
        choices=Choices.INCOME_OPTIONS,
        error_messages=IdentityInfoErrorMessages.INCOME,
        help_text=IdentityInfoHelpText.INCOME,
    )
    assets = MultiSelectField(
        _("Capital"),
        choices=FinancialInformationChoices.CAPITAL_CHOICES,
        error_messages=IdentityInfoErrorMessages.ASSETS,
        help_text=IdentityInfoHelpText.ASSETS,
    )
    weight = models.DecimalField(
        _("Weight (in kg)"),
        max_digits=5,
        decimal_places=2,
        error_messages=IdentityInfoErrorMessages.WEIGHT,
        help_text=IdentityInfoHelpText.WEIGHT,
    )
    height = models.DecimalField(
        _("Height (in cm)"),
        max_digits=5,
        decimal_places=2,
        error_messages=IdentityInfoErrorMessages.HEIGHT,
        help_text=IdentityInfoHelpText.HEIGHT,
    )
    introduced_subjects = models.ManyToManyField(
        "users.User",
        verbose_name=_("Introduced Subjects"),
        related_name="confidintional_info_subjects",
        blank=True,
        error_messages=IdentityInfoErrorMessages.INTRODUCED_SUBJECTS,
        help_text=IdentityInfoHelpText.INTRODUCED_SUBJECTS,
    )
    introduced_subjects_explantions = models.TextField(
        _("Introduced Subjects Explanations"),
        error_messages=IdentityInfoErrorMessages.INTRODUCED_SUBJECTS,
        help_text=IdentityInfoHelpText.INTRODUCED_SUBJECTS_EXPLANTIONS,
        blank=True,
        null=True,
    )
    prefered_meeting_time = models.CharField(
        _("Prefered Meeting Time"),
        max_length=150,
        error_messages=IdentityInfoErrorMessages.PREFERED_MEETING_TIME,
        help_text=IdentityInfoHelpText.PREFERED_MEETING_TIME,
    )
    type_of_payment = models.CharField(
        _("Type of payment"),
        max_length=20,
        choices=Choices.TYPE_OF_PAYMENT_OPTIONS,
        error_messages=IdentityInfoErrorMessages.TYPE_OF_PAYMENT,
        help_text=IdentityInfoHelpText.TYPE_OF_PAYMENT,
    )
    payment_proof = models.FileField(
        _("Proof Of Payment"),
        upload_to="payment_proofs/%Y/%m/%d/",
        null=True,
        blank=True,
        validators=[FileExtensionValidator(allowed_extensions=['pdf', 'jpg', 'jpeg', 'png'], 
        message=IdentityInfoErrorMessages.PAYMENT_PROOF)],
        help_text=IdentityInfoHelpText.PAYMENT_PROOF
    )
    user = models.OneToOneField(
        "users.User",
        on_delete=models.CASCADE,
        related_name="confidintional_info_user",
        error_messages=IdentityInfoErrorMessages.USER,
        help_text=IdentityInfoHelpText.USER,
        db_index=True
    )

    class Meta:
        verbose_name = _("Identities Information")
        verbose_name_plural = _("Identities Information")

    def __str__(self):
        return self.last_name

    def get_absolute_url(self):
        return reverse("IdentityInfo_detail", kwargs={"pk": self.pk})
    
    
class BirthCertificateInformation(models.Model):
    national_code = models.CharField(
        _("National Code"),
        unique=True,
        max_length=10,
        error_messages=BirthCertificateInfoErrorMessages.NATIONAL_CODE,
        help_text=BirthCertificateInfoHelpText.NATIONAL_CODE,
        db_index=True,
    )
    birth_certificate_serial = models.CharField(
        _("Birth Certificate Serial"),
        max_length=15,
        error_messages=BirthCertificateInfoErrorMessages.BIRTH_CERTIFICATE_SERIAL,
        help_text=BirthCertificateInfoHelpText.BIRTH_CERTIFICATE_SERIAL,
    )
    birth_certificate_location = models.CharField(
        _("Birth Certificate Location"),
        max_length=50,
        error_messages=BirthCertificateInfoErrorMessages.BIRTH_CERTIFICATE_LOCATION,
        help_text=BirthCertificateInfoHelpText.BIRTH_CERTIFICATE_LOCATION,
    )
    marriage_experince = models.CharField(
        _("Marriage Experince"),
        max_length=50,
        choices=Choices.MARRIAGE_EXPERINCE_OPTION,
        error_messages=BirthCertificateInfoErrorMessages.MARRIAGE_EXPERINCE,
        help_text=BirthCertificateInfoHelpText.MARRIAGE_EXPERINCE,
    )
    contract_date = models.DateField(
        _("Contract Date"),
        auto_now=False,
        auto_now_add=False,
        blank=True,
        null=True,
        error_messages=BirthCertificateInfoErrorMessages.CONTRACT_DATE,
        help_text=BirthCertificateInfoHelpText.CONTRACT_DATE,
    )
    marriage_status = models.CharField(
        _("Marriage Status"),
        max_length=50,
        choices=Choices.MARRIAGE_STATUS_OPTIONS,
        error_messages=BirthCertificateInfoErrorMessages.MARRIAGE_STATUS,
        help_text=BirthCertificateInfoHelpText.MARRIAGE_STATUS,
    )
    marriage_date = models.DateField(
        _("Marriage Date"),
        auto_now=False,
        auto_now_add=False,
        blank=True,
        null=True,
        error_messages=BirthCertificateInfoErrorMessages.MARRIAGE_DATE,
        help_text=BirthCertificateInfoHelpText.MARRIAGE_DATE,
    )
    divorce_date = models.DateField(
        _("Divorce Date"),
        auto_now=False,
        auto_now_add=False,
        blank=True,
        null=True,
        error_messages=BirthCertificateInfoErrorMessages.DIVORCE_DATE,
        help_text=BirthCertificateInfoHelpText.DIVORCE_DATE,
    )
    husband_death_date = models.DateField(
        _("Husband Death Date"),
        auto_now=False,
        auto_now_add=False,
        blank=True,
        null=True,
        error_messages=BirthCertificateInfoErrorMessages.HUSBAND_DEATH_DATE,
        help_text=BirthCertificateInfoHelpText.HUSBAND_DEATH_DATE,
    )
    birth_date = models.DateField(
        _("Birth Date"),
        auto_now=False,
        auto_now_add=False,
        error_messages=BirthCertificateInfoErrorMessages.BIRTH_DATE,
        help_text=BirthCertificateInfoHelpText.BIRTH_DATE,
    )
    children = MultiSelectField(
        _("Children"),
        choices=Choices.CHILDREN_OPTIONS,
        error_messages=BirthCertificateInfoErrorMessages.CHILDREN,
        help_text=BirthCertificateInfoHelpText.CHILDREN,
    )
    children_custody = models.CharField(
        _("Children Custody"),
        max_length=50,
        choices=Choices.CHILDREN_CUSTODY_OPTIONS,
        null=True,
        blank=True,
        error_messages=BirthCertificateInfoErrorMessages.CHILDREN_CUSTODY,
        help_text=BirthCertificateInfoHelpText.CHILDREN_CUSTODY,
    )
    user = models.OneToOneField(
        "users.User",
        on_delete=models.CASCADE,
        related_name="birth_certificate_info",
        error_messages=BirthCertificateInfoErrorMessages.USER,
        help_text=BirthCertificateInfoHelpText.USER,
        db_index=True
    )
    
    def __str__(self):
        return f"اطالاعات کاربر: {self.user.last_name}"

    def get_absolute_url(self):
        return reverse("BirthCertificateInfo_detail", kwargs={"pk": self.pk})
    
    class Meta:
        verbose_name = _("Birth Certificate Information")
        verbose_name_plural = _("Birth Certificates Information")


class IntroducedSubjectsInformation(models.Model):
    username = models.CharField(
        _("Username"),
        max_length=50,
        error_messages=IntroducedSubjectsErrorMessages.USERNAME,
        help_text=IntroducedSubjectsHelpText.USERNAME,
    )
    birth_date = models.DateField(
        _("Birth Date"),
        auto_now=False,
        auto_now_add=False,
        error_messages=BirthCertificateInfoErrorMessages.BIRTH_DATE,
        help_text=BirthCertificateInfoHelpText.BIRTH_DATE,
    )
    marriage_status = models.CharField(
        _("Marriage Status"),
        choices=Choices.MARRIAGE_STATUS_OPTIONS,
        error_messages=BirthCertificateInfoErrorMessages.MARRIAGE_STATUS,
        help_text=BirthCertificateInfoHelpText.MARRIAGE_STATUS,
    )  
    postive = models.BooleanField(
        _("Positive"),
        error_messages=IntroducedSubjectsErrorMessages.POSTIVE,
        help_text=IntroducedSubjectsHelpText.POSTIVE,
    )
    negative = models.BooleanField(
        _("Negative"),
        error_messages=IntroducedSubjectsErrorMessages.NEGATIVE,
        help_text=IntroducedSubjectsHelpText.NEGATIVE,
    )
    reason = models.TextField(
        _("Reason"),
        error_messages=IntroducedSubjectsErrorMessages.REASON,
        help_text=IntroducedSubjectsHelpText.REASON,
    )
    dates_of_meetings = models.TextField(
        _("Dates Of Meetings"),
        error_messages=IntroducedSubjectsErrorMessages.DATES_OF_MEETINGS,
        help_text=IntroducedSubjectsHelpText.DATES_OF_MEETINGS,
    )
    result_and_regards = models.TextField(
        _("Result & Regards"),
        error_messages=IntroducedSubjectsErrorMessages.RESULT_AND_REGARDS,
        help_text=IntroducedSubjectsHelpText.RESULT_AND_REGARDS,
    )
    cost_of_introduction = models.CharField(
        _("Cost of Introduction"),
        max_length=100,
        error_messages=IntroducedSubjectsErrorMessages.COST_OF_INTRODUCTION,
        help_text=IntroducedSubjectsHelpText.COST_OF_INTRODUCTION,
    )
    cost_of_meeting = models.CharField(
        _("Cost of Meeting"),
        max_length=100,
        error_messages=IntroducedSubjectsErrorMessages.COST_OF_MEETING,
        help_text=IntroducedSubjectsHelpText.COST_OF_MEETING,
    )
    user = models.ForeignKey(
        "users.User",
        on_delete=models.CASCADE,
        related_name="introduced_subjects_info",
        error_messages=BirthCertificateInfoErrorMessages.USER,
        help_text=BirthCertificateInfoHelpText.USER,
        db_index=True
    )

    def __str__(self):
        return f"اطالاعات کاربر: {self.user.last_name}"

    def get_absolute_url(self):
        return reverse("IntroducedSubjects_details", kwargs={"pk": self.pk})
    
    class Meta:
        verbose_name = 'IntroducedSubjects'
        verbose_name_plural = 'IntroducedSubjectss'