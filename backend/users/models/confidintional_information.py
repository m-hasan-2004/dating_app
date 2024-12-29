from .validators import LandlineNumberValidator
from phonenumber_field.modelfields import PhoneNumberField
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError
from multiselectfield import MultiSelectField
from django.urls import reverse
from django.db import models
from .choices import Choices
from .error_messages import IdentityInfoErrorMessages, BirthCertificateInfoErrorMessages


class IdentityInfo(models.Model):
    first_name = models.CharField(
        _("First Name"),
        max_length=80,
        help_text=_("Enter the first name of the user."),
        error_messages=IdentityInfoErrorMessages.FIRST_NAME,
    )
    last_name = models.CharField(
        _("Last Name"),
        max_length=50,
        help_text=_("Optional. 50 characters or fewer."),
        error_messages=IdentityInfoErrorMessages.LAST_NAME,
    )
    father_name = models.CharField(
        _("Father's Name"),
        max_length=80,
        help_text=_("Optional. 80 characters or fewer."),
        error_messages=IdentityInfoErrorMessages.FATHER_NAME,
    )
    eitta_number = PhoneNumberField(
        _("Eitta Number"),
        unique=True,
        region="IR",
        help_text=_("Enter a unique Eitta number in the format: +98 or 09**."),
        blank=True,
        null=True,
        error_messages=IdentityInfoErrorMessages.EITTA_NUMBER,
    )
    landline_phone = models.CharField(
        _("Landline Phone"),
        max_length=12,
        validators=[LandlineNumberValidator.landline_number_validator],
        help_text=_("Enter a landline number in the format: 025-32305083."),
        blank=True,
        null=True,
        error_messages=IdentityInfoErrorMessages.LANDLINE_PHONE,
    )
    mother_phone = PhoneNumberField(
        _("Mother's Phone"),
        unique=True,
        region="IR",
        help_text=_("Enter a unique phone number for the mother in the format: +98 or 09**."),
        blank=True,
        null=True,
        error_messages=IdentityInfoErrorMessages.MOTHER_PHONE,
    )
    father_phone = PhoneNumberField(
        _("Father's Phone"),
        unique=True,
        region="IR",
        help_text=_("Enter a unique phone number for the father in the format: +98 or 09**."),
        blank=True,
        null=True,
        error_messages=IdentityInfoErrorMessages.FATHER_PHONE,
    )
    home_address = models.CharField(
        _("Home Address"),
        max_length=150,
        help_text=_("Enter the home address of the user."),
        error_messages=IdentityInfoErrorMessages.HOME_ADDRESS,
    )
    work_address = models.CharField(
        _("Work Address"),
        max_length=150,
        help_text=_("Enter the work address of the user."),
        blank=True,
        null=True,
        error_messages=IdentityInfoErrorMessages.WORK_ADDRESS,
    )
    originality = models.CharField(
        _("Originality"),
        max_length=80,
        help_text=_("Enter the originality of the user."),
        error_messages=IdentityInfoErrorMessages.ORIGINALITY,
    )
    education = models.CharField(
        _("Education"),
        max_length=80,
        help_text=_("Enter the education level of the user."),
        error_messages=IdentityInfoErrorMessages.EDUCATION,
    )
    job = models.CharField(
        _("Job"),
        max_length=50,
        choices=Choices.JOB_OPTIONS,
        help_text=_("Select the job of the user."),
        error_messages=IdentityInfoErrorMessages.JOB,
    )
    insurance = models.CharField(
        _("Insurance"),
        max_length=50,
        choices=Choices.INSURANCE_OPTIONS,
        help_text=_("Select the insurance type of the user."),
        error_messages=IdentityInfoErrorMessages.INSURANCE,
    )
    income = models.BigIntegerField(
        _("Income in Rials"),
        help_text=_("Enter the income of the user in Rials."),
        error_messages=IdentityInfoErrorMessages.INCOME,
    )
    assets = models.CharField(
        _("Assets"),
        max_length=150,
        help_text=_("Enter the assets of the user."),
        error_messages=IdentityInfoErrorMessages.ASSETS,
    )
    weight = models.DecimalField(
        _("Weight (in kg)"),
        max_digits=5,
        decimal_places=2,
        help_text=_("Enter the weight of the user in kilograms."),
        error_messages=IdentityInfoErrorMessages.WEIGHT,
    )
    height = models.DecimalField(
        _("Height (in cm)"),
        max_digits=5,
        decimal_places=2,
        help_text=_("Enter the height of the user in centimeters."),
        error_messages=IdentityInfoErrorMessages.HEIGHT,
    )
    introduced_subjects = models.ManyToManyField(
        "users.User",
        verbose_name=_("Introduced Subjects"),
        related_name="confidintional_info_subjects",
        blank=True,
        help_text=_("Select the user who introduced the subjects."),
        error_messages=IdentityInfoErrorMessages.INTRODUCED_SUBJECTS,
    )
    prefered_meeting_time = models.CharField(
        _("Prefered Meeting Time"),
        max_length=150,
        help_text=_("Enter the preferred meeting time of the user."),
        error_messages=IdentityInfoErrorMessages.PREFERED_MEETING_TIME,
    )
    type_of_payment = models.CharField(
        _("Type of payment"),
        max_length=20,
        choices=Choices.TYPE_OF_PAYMENT_OPTIONS,
        help_text=_("Select the type of payment."),
        error_messages=IdentityInfoErrorMessages.TYPE_OF_PAYMENT,
    )
    user = models.OneToOneField(
        "users.User",
        verbose_name=_("User"),
        on_delete=models.CASCADE,
        related_name="confidintional_info_user",
        help_text=_("Select the user associated with this identity information."),
        error_messages=IdentityInfoErrorMessages.USER,
    )


    class Meta:
        verbose_name = _("IdentityInfo")
        verbose_name_plural = _("IdentityInfos")

    def __str__(self):
        return self.first_name

    def get_absolute_url(self):
        return reverse("IdentityInfo_detail", kwargs={"pk": self.pk})
    
    
class BirthCertificateInfo(models.Model):
    national_code = models.CharField(
        _("National Code"),
        unique=True,
        max_length=10,
        help_text=_("Enter the national code of the user."),
        error_messages=BirthCertificateInfoErrorMessages.NATIONAL_CODE,
    )
    birth_certificate_serial = models.CharField(
        _("Birth Certificate Serial"),
        max_length=10,
        help_text=_("Enter the birth certificate serial number of the user."),
        error_messages=BirthCertificateInfoErrorMessages.BIRTH_CERTIFICATE_SERIAL,
    )
    birth_certificate_location = models.CharField(
        _("Birth Certificate Location"),
        max_length=50,
        help_text=_("Enter the location where the birth certificate was issued."),
        error_messages=BirthCertificateInfoErrorMessages.BIRTH_CERTIFICATE_LOCATION,
    )
    marriage_experince = models.CharField(
        _("Marriage Experince"),
        max_length=50,
        choices=Choices.MARRIAGE_EXPERINCE_OPTION,
        help_text=_("Select the marriage experience of the user."),
        error_messages=BirthCertificateInfoErrorMessages.MARRIAGE_EXPERINCE,
    )
    contract_date = models.DateTimeField(
        _("Contract Date"),
        auto_now=False,
        auto_now_add=False,
        blank=True,
        null=True,
        help_text=_("Enter the contract date."),
        error_messages=BirthCertificateInfoErrorMessages.CONTRACT_DATE,
    )
    marriage_status = models.CharField(
        _("Marriage Status"),
        max_length=50,
        choices=Choices.MARRIAGE_STATUS_OPTIONS,
        help_text=_("Select the marriage status of the user."),
        error_messages=BirthCertificateInfoErrorMessages.MARRIAGE_STATUS,
    )
    marriage_date = models.DateTimeField(
        _("Marriage Date"),
        auto_now=False,
        auto_now_add=False,
        blank=True,
        null=True,
        help_text=_("Enter the marriage date."),
        error_messages=BirthCertificateInfoErrorMessages.MARRIAGE_DATE,
    )
    divorce_date = models.DateTimeField(
        _("Divorce Date"),
        auto_now=False,
        auto_now_add=False,
        blank=True,
        null=True,
        help_text=_("Enter the divorce date."),
        error_messages=BirthCertificateInfoErrorMessages.DIVORCE_DATE,
    )
    husband_death_date = models.DateTimeField(
        _("Husband Death Date"),
        auto_now=False,
        auto_now_add=False,
        blank=True,
        null=True,
        help_text=_("Enter the husband death date."),
        error_messages=BirthCertificateInfoErrorMessages.HUSBAND_DEATH_DATE,
    )
    birth_date = models.DateTimeField(
        _("Birth Date"),
        auto_now=False,
        auto_now_add=False,
        help_text=_("Enter the birth date of the user."),
        error_messages=BirthCertificateInfoErrorMessages.BIRTH_DATE,
    )
    children = MultiSelectField(
        _("Children"),
        choices=Choices.CHILDREN_OPTIONS,
        help_text=_("Select the number of children."),
        error_messages=BirthCertificateInfoErrorMessages.CHILDREN,
    )
    children_custody = models.CharField(
        _("Children Custody"),
        max_length=50,
        choices=Choices.CHILDREN_CUSTODY_OPTIONS,
        help_text=_("Select the custody status of the children."),
        null=True,
        blank=True,
        error_messages=BirthCertificateInfoErrorMessages.CHILDREN_CUSTODY,
    )
    user = models.OneToOneField(
        "users.User",
        verbose_name=_("User"),
        on_delete=models.CASCADE,
        related_name="birth_certificate_info",
        help_text=_("Select the user associated with this birth certificate information."),
        error_messages=BirthCertificateInfoErrorMessages.USER,
    )
    
    class Meta:
        verbose_name = _("BirthCertificateInfo")
        verbose_name_plural = _("BirthCertificateInfos")

    def __str__(self):
        return self.national_code

    def get_absolute_url(self):
        return reverse("BirthCertificateInfo_detail", kwargs={"pk": self.pk})

