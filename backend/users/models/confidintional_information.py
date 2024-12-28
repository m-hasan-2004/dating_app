from .validators import LandlineNumberValidator
from django.contrib.auth.validators import UnicodeUsernameValidator
from phonenumber_field.modelfields import PhoneNumberField
from django.utils.translation import gettext_lazy as _
from django.core.exceptions import ValidationError
from multiselectfield import MultiSelectField
from django.utils import timezone
from django.urls import reverse
from django.db import models
from .choices import Choices


class IdentityInfo(models.Model):
    first_name = models.CharField(_("First Name"), max_length=80, help_text=_("Enter the first name of the user."))
    last_name = models.CharField(_("Last Name"), max_length=50, help_text=_("Optional. 50 characters or fewer."))
    father_name = models.CharField(_("Father's Name"), max_length=80, help_text=_("Optional. 80 characters or fewer."))
    eitta_number = PhoneNumberField(_("Eitta Number"), unique=True, region="IR", help_text=_("Enter a unique Eitta number in the format: +98 or 09**."), blank=True, null=True)
    landline_phone = models.CharField(
        _("Landline Phone"), max_length=12, validators=[LandlineNumberValidator.landline_number_validator],
        help_text=_("Enter a landline number in the format: 025-32305083."), blank=True, null=True
    )
    mother_phone = PhoneNumberField(_("Mother's Phone"), unique=True, region="IR", help_text=_("Enter a unique phone number for the mother in the format: +98 or 09**."), blank=True, null=True)
    father_phone = PhoneNumberField(_("Father's Phone"), unique=True, region="IR", help_text=_("Enter a unique phone number for the father in the format: +98 or 09**."), blank=True, null=True)
    home_address = models.CharField(_("Home Address"), max_length=150, help_text=_("Enter the home address of the user."))
    work_address = models.CharField(_("Work Address"), max_length=150, help_text=_("Enter the work address of the user."), blank=True, null=True)
    originality = models.CharField(_("Originality"), max_length=80, help_text=_("Enter the originality of the user."))
    education = models.CharField(_("Education"), max_length=80, help_text=_("Enter the education level of the user."))
    job = models.CharField(_("Job"), max_length=50, choices=Choices.JOB_OPTIONS, help_text=_("Select the job of the user."))
    insurance = models.CharField(_("Insurance"), max_length=50, choices=Choices.INSURANCE_OPTIONS, help_text=_("Select the insurance type of the user."))
    income = models.BigIntegerField(_("Income in Rials"), help_text=_("Enter the income of the user in Rials."))
    assets = models.CharField(_("Assets"), max_length=150, help_text=_("Enter the assets of the user."))
    weight = models.DecimalField(_("Weight (in kg)"), max_digits=5, decimal_places=2, help_text=_("Enter the weight of the user in kilograms."))
    height = models.DecimalField(_("Height (in cm)"), max_digits=5, decimal_places=2, help_text=_("Enter the height of the user in centimeters."))
    introduced_subjects = models.ForeignKey(
        "users.User", verbose_name=_("Introduced Subjects"),
        on_delete=models.PROTECT, related_name="confidintional_info_subjects", blank=True, null=True,
        help_text=_("Select the user who introduced the subjects.")
    )
    prefered_meeting_time = models.CharField(_("Prefered Meeting Time"), max_length=150, help_text=_("Enter the preferred meeting time of the user."))
    type_of_payment = models.CharField(_("Type of payment"), max_length=20, choices=Choices.TYPE_OF_PAYMENT_OPTIONS, help_text=_("Select the type of payment."))
    user = models.OneToOneField("users.User", verbose_name=_("User"), on_delete=models.CASCADE, related_name="confidintional_info_user", help_text=_("Select the user associated with this identity information."))


    class Meta:
        verbose_name = _("IdentityInfo")
        verbose_name_plural = _("IdentityInfos")

    def __str__(self):
        return self.first_name

    def get_absolute_url(self):
        return reverse("IdentityInfo_detail", kwargs={"pk": self.pk})
    
    
class BirthCertificateInfo(models.Model):
    national_code = models.CharField(_("National Code"), unique=True, max_length=10, help_text=_("Enter the national code of the user."))
    birth_certificate_serial = models.CharField(_("Birth Certificate Serial"), max_length=10, help_text=_("Enter the birth certificate serial number of the user."))
    birth_certificate_location = models.CharField(_("Birth Certificate Location"), max_length=50, help_text=_("Enter the location where the birth certificate was issued."))
    marriage_experince = models.CharField(_("Marriage Experince"), max_length=50, choices=Choices.MARRIAGE_EXPERINCE_OPTION, help_text=_("Select the marriage experience of the user."))
    contract_date = models.DateTimeField(_("Contract Date"), auto_now=False, auto_now_add=False, blank=True, null=True, help_text=_("Enter the contract date."))
    marriage_status = models.CharField(_("Marriage Status"), max_length=50, choices=Choices.MARRIAGE_STATUS_OPTIONS, help_text=_("Select the marriage status of the user."))
    marriage_date = models.DateTimeField(_("Marriage Date"), auto_now=False, auto_now_add=False, blank=True, null=True, help_text=_("Enter the marriage date."))
    divorce_date = models.DateTimeField(_("Divorce Date"), auto_now=False, auto_now_add=False, blank=True, null=True, help_text=_("Enter the divorce date."))
    husband_death_date = models.DateTimeField(_("Husband Death Date"), auto_now=False, auto_now_add=False, blank=True, null=True, help_text=_("Enter the husband death date."))
    birth_date = models.DateTimeField(_("Birth Date"), auto_now=False, auto_now_add=False, help_text=_("Enter the birth date of the user."))
    children = MultiSelectField(_("Children"), choices=Choices.CHILDREN_OPTIONS, help_text=_("Select the number of children."))
    children_custody = models.CharField(
        _("Children Custody"), max_length=50, choices=Choices.CHILDREN_CUSTODY_OPTIONS,
        help_text=_("Select the custody status of the children."), null=True, blank=True
    )
    user = models.OneToOneField("users.User", verbose_name=_("User"), on_delete=models.CASCADE, related_name="birth_certificate_info", help_text=_("Select the user associated with this birth certificate information."))
    
    class Meta:
        verbose_name = _("BirthCertificateInfo")
        verbose_name_plural = _("BirthCertificateInfos")

    def __str__(self):
        return self.national_code

    def get_absolute_url(self):
        return reverse("BirthCertificateInfo_detail", kwargs={"pk": self.pk})

