from core.utils.validators import LandlineNumberValidator
from phonenumber_field.modelfields import PhoneNumberField
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError
from multiselectfield import MultiSelectField
from django.urls import reverse
from django.db import models
from core.utils.model_choices import Choices
from core.utils.model_error_messages import IdentityInfoErrorMessages, BirthCertificateInfoErrorMessages
from core.utils.help_text import IdentityInfoHelpText, BirthCertificateInfoHelpText


class IdentityInformation(models.Model):
    first_name = models.CharField(
        _("First Name"),
        max_length=80,
        error_messages=IdentityInfoErrorMessages.FIRST_NAME,
        help_text=IdentityInfoHelpText.FIRST_NAME,
    )
    last_name = models.CharField(
        _("Last Name"),
        max_length=50,
        error_messages=IdentityInfoErrorMessages.LAST_NAME,
        help_text=IdentityInfoHelpText.LAST_NAME,
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
        blank=True,
        null=True,
        error_messages=IdentityInfoErrorMessages.EITTA_NUMBER,
        help_text=IdentityInfoHelpText.EITTA_NUMBER,
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
    )
    father_phone = PhoneNumberField(
        _("Father's Phone"),
        unique=True,
        region="IR",
        blank=True,
        null=True,
        error_messages=IdentityInfoErrorMessages.FATHER_PHONE,
        help_text=IdentityInfoHelpText.FATHER_PHONE,
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
        max_length=80,
        error_messages=IdentityInfoErrorMessages.EDUCATION,
        help_text=IdentityInfoHelpText.EDUCATION,
    )
    job = models.CharField(
        _("Job"),
        max_length=50,
        choices=Choices.JOB_OPTIONS,
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
    income = models.BigIntegerField(
        _("Income in Rials"),
        error_messages=IdentityInfoErrorMessages.INCOME,
        help_text=IdentityInfoHelpText.INCOME,
    )
    assets = models.CharField(
        _("Assets"),
        max_length=150,
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
        related_name="confidintional_info_subjects",
        blank=True,
        error_messages=IdentityInfoErrorMessages.INTRODUCED_SUBJECTS,
        help_text=IdentityInfoHelpText.INTRODUCED_SUBJECTS,
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
    user = models.OneToOneField(
        "users.User",
        on_delete=models.CASCADE,
        related_name="confidintional_info_user",
        error_messages=IdentityInfoErrorMessages.USER,
        help_text=IdentityInfoHelpText.USER,
    )


    class Meta:
        verbose_name = _("Identities Information")
        verbose_name_plural = _("Identities Information")

    def __str__(self):
        return self.first_name

    def get_absolute_url(self):
        return reverse("IdentityInfo_detail", kwargs={"pk": self.pk})
    
    
class BirthCertificateInformation(models.Model):
    national_code = models.CharField(
        _("National Code"),
        unique=True,
        max_length=10,
        error_messages=BirthCertificateInfoErrorMessages.NATIONAL_CODE,
        help_text=BirthCertificateInfoHelpText.NATIONAL_CODE,
    )
    birth_certificate_serial = models.CharField(
        _("Birth Certificate Serial"),
        max_length=10,
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
    contract_date = models.DateTimeField(
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
    marriage_date = models.DateTimeField(
        _("Marriage Date"),
        auto_now=False,
        auto_now_add=False,
        blank=True,
        null=True,
        error_messages=BirthCertificateInfoErrorMessages.MARRIAGE_DATE,
        help_text=BirthCertificateInfoHelpText.MARRIAGE_DATE,
    )
    divorce_date = models.DateTimeField(
        _("Divorce Date"),
        auto_now=False,
        auto_now_add=False,
        blank=True,
        null=True,
        error_messages=BirthCertificateInfoErrorMessages.DIVORCE_DATE,
        help_text=BirthCertificateInfoHelpText.DIVORCE_DATE,
    )
    husband_death_date = models.DateTimeField(
        _("Husband Death Date"),
        auto_now=False,
        auto_now_add=False,
        blank=True,
        null=True,
        error_messages=BirthCertificateInfoErrorMessages.HUSBAND_DEATH_DATE,
        help_text=BirthCertificateInfoHelpText.HUSBAND_DEATH_DATE,
    )
    birth_date = models.DateTimeField(
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
    )
    
    class Meta:
        verbose_name = _("Birth Certificate Information")
        verbose_name_plural = _("Birth Certificates Information")

    def __str__(self):
        return self.national_code

    def get_absolute_url(self):
        return reverse("BirthCertificateInfo_detail", kwargs={"pk": self.pk})

